/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import Parser, {eos} from "./parser.js";
import response from "./response.js";
import {NEUTRAL, Tuple} from "../data/tuple.js";

// (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
function parse(p) {
  return new Parser(p);
}

// (('b -> Parser 'a 'c) * 'b)-> Parser 'a 'c
function lazy(p, parameters, self = {}) {

  if (parameters && !Array.isArray(parameters)) {
    throw 'Lazy(parser, [params]) function expect parser parameters to be packed into an array';
  }

  // equivalent of p(...parameters), but would fail if parameters are undefined
  // In some case, p is a function that require a 'this' bound to the function
  // https://github.com/d-plaindoux/masala-parser/issues/9
  return new Parser((input, index = 0) =>
    p.apply(self, parameters).parse(input, index)
  );
}

// 'a -> Parser 'a 'c
function returns(v) {
  return new Parser((input, index = 0) =>
    response.accept(v, input, index, false)
  );
}

// unit -> Parser 'a 'c
function error() {
  return new Parser((input, index = 0) => {
      // TODO: add an optional logger parameter, and log
      return response.reject(input, index, false)
    }
  );
}


// ('a -> boolean) -> Parser a 'c
// index is forwarded at index +1
function satisfy(predicate) {
  return new Parser((input, index = 0) =>
    input
      .get(index)
      .filter(predicate)
      .map(value => response.accept(value, input, index + 1, true))
      .lazyRecoverWith(() =>
        response.reject(input, index, false)
      )
  );
}

// Parser 'a 'c -> Parser 'a 'c
function doTry(p) {
  return new Parser((input, index = 0) => {
    return p
        .parse(input, index)
        .fold(
          accept => accept,
          // we come back to initial offset
          (_) =>  response.reject(input, index, false)
        )
    }
  );
}

function layer(p) {
  return new Parser((input, index = 0) =>
    p
      .parse(input, index)
      .fold(
        accept => {
          // TODO logger

          return response.accept(new Tuple().append(accept.value), input, index, false)
        },
        // Compared to satisfy, we come back to initial offset
        reject => reject
      )
  );
}


// unit -> Parser 'a 'c
function any() {
  return satisfy(() => true);
}

// unit -> Parser 'a 'c
function nop() {
  return new Parser((input, index = 0) =>
    response.accept(NEUTRAL, input, index, true)
  );
}

// Parser 'a ? -> Parser 'a 'a
function not(p) {
  return doTry(p).then(error()).or(any());
}

// int -> Parser (List 'a') a'
function subStream(length) {
  return any().occurrence(length);
}


function startWith(value) {
  return nop().returns(value);
}

function moveUntil(stop, include = false) {
  if (typeof stop === 'string') {
    return searchStringStart(stop, include);
  }

  if (Array.isArray(stop)) {
    return searchArrayStringStart(stop, include);
  }

  let findParser = not(stop).rep().join()
  if (include) {
    return findParser.then(stop).join();
  }

  const foundEos = Symbol('found-eos');
  return doTry(findParser.then(eos()).returns(foundEos))
    .or(findParser)
    .filter(v => v !== foundEos);
}

function dropTo(stop) {
  if (typeof stop === 'string') {
    return moveUntil(stop).then(string(stop)).drop();
  } else {
    return moveUntil(stop).then(stop).drop();
  }
}

/**
 * Accept a pure JS regex, not a string
 * @param rg
 * @returns {Parser}
 */
function regex(rg) {
  // clone with 'y' (sticky) and preserve all the existing flags
  const flags = rg.flags.includes('y') ? rg.flags : rg.flags + 'y';
  const sticky = new RegExp(rg.source, flags);


  return new Parser((input, index = 0) => {
    sticky.lastIndex = index;           // 1. park at current cursor
    const matches = sticky.exec(input.source); // 2. attempt match
    if (!matches) {
      return response.reject(input, index, false);
    } else {
      const text = matches[0];                   // 3. what we consumed
      return response.accept(text, input, sticky.lastIndex, true);
    }
  })
}

function tryAll(parsers) {
  if (parsers.length === 0) {
    return nop();
  }
  let combinator = doTry(parsers[0]);
  for (let i = 1; i < parsers.length; i++) {
    combinator = doTry(combinator.or(doTry(parsers[i])));
  }

  return combinator;
}

export default {
  parse,
  nop,
  try: doTry,
  any,
  subStream,
  not,
  layer,
  lazy,
  returns,
  error,
  eos,
  satisfy,
  startWith,
  moveUntil,
  dropTo,
  regex,
  tryAll
};

/**Optimization functions */

/**
 * Will work only if input.source is a String
 * @param string
 * @param include
 * @returns {Parser}
 */
function searchStringStart(string, include = false) {
  return new Parser((input, index = 0) => {
    if (typeof input.source !== 'string') {
      throw 'Input source must be a String';
    }

    const sourceIndex = input.source.indexOf(string, index);
    let offset = sourceIndex;
    let result = input.source.substring(index, sourceIndex)
    if (include) {
      result += string;
      offset += string.length;
    }
    if (sourceIndex > 0) {
      return response.accept(
        result,
        input,
        offset,
        true
      );
    } else {
      return response.reject(input, index, false);
    }
  });
}

/**
 * Will work only if input.source is a String
 */
function searchArrayStringStart(array, include = false) {
  return new Parser((input, index = 0) => {
    if (typeof input.source !== 'string') {
      throw 'Input source must be a String';
    }

    let sourceIndex = -1;
    let offset, result;

    let i = 0;
    while (sourceIndex < 0 && i < array.length) {
      const needle = array[i];
      sourceIndex = input.source.indexOf(needle, index);
      i++;
      if (sourceIndex > 0) {
        offset = sourceIndex;
        result = input.source.substring(index, sourceIndex);
        if (include) {
          result += needle;
          offset += needle.length;
        }
        break;
      }
    }

    //const sourceIndex = input.source.indexOf(string, index)

    if (sourceIndex > 0) {
      return response.accept(
        result,
        input,
        offset,
        true
      );
    } else {
      return response.reject(input, index, false);
    }
  });
}

// string -> Parser string char
// index is forwarded at the length of the string
export function string(s) {
  return new Parser((input, index = 0) => {
    if (input.subStreamAt(s.split(''), index)) {
      return response.accept(s, input, index + s.length, true);
    } else {
      return response.reject(input, index, false);
    }
  });
}
