/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import unit from '../data/unit.js';
import Parser from './parser';
import response from './response';

// (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
function parse(p) {
    return new Parser(p);
}

// (('b -> Parser 'a 'c) * 'b)-> Parser 'a 'c
function lazy(p, parameters, self={}) {
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
    return new Parser((input, index = 0) =>
        response.reject(input.location(index), false)
    );
}

// unit -> Parser unit 'c
function eos() {
    return new Parser((input, index = 0) => {
        if (input.endOfStream(index)) {
            return response.accept(unit, input, index, false);
        } else {
            return response.reject(input.location(index), false);
        }
    });
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
                response.reject(input.location(index), false)
            )
    );
}

// Parser 'a 'c -> Parser 'a 'c
function doTry(p) {
    return new Parser((input, index = 0) =>
        p
            .parse(input, index)
            .fold(
                accept => accept,
                reject => response.reject(input.location(reject.offset), false)
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
        response.accept([], input, index, true)
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

function sequence() {
    var current = nop();
    for (let v in arguments) {
        current = current.then(arguments[v]);
    }
    return current;
}

function startsWith(value) {
    return nop().thenReturns(value);
}

function moveUntil(stop) {
    if (typeof stop === 'string') {
        return searchStringStart(stop);
    }

    if (Array.isArray(stop)) {
        return searchArrayStringStart(stop);
    }

    return doTry(not(stop).rep().then(eos()).thenReturns(undefined))
        .or(not(stop).rep().map(chars => chars.join('')))
        .filter(v => v !== undefined);
}

function dropTo(stop) {
    if (typeof stop === 'string') {
        return moveUntil(stop).then(string(stop)).drop();
    } else {
        return moveUntil(stop).then(stop).drop();
    }
}

export default {
    parse,
    nop,
    try: doTry,
    any: any(),
    subStream,
    not: not,
    lazy,
    returns,
    error: error(),
    eos: eos(),
    satisfy,
    sequence,
    startsWith,
    moveUntil,
    dropTo,
};

/**Optimization functions */

/**
 * Will work only if input.source is a String
 * @param string
 * @returns {Parser}
 */
function searchStringStart(string) {
    return new Parser((input, index = 0) => {
        if (typeof input.source !== 'string') {
            throw 'Input source must be a String';
        }

        const sourceIndex = input.source.indexOf(string, index);
        if (sourceIndex > 0) {
            return response.accept(
                input.source.substring(index, sourceIndex),
                input,
                sourceIndex,
                true
            );
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

/**
 * Will work only if input.source is a String
 * Needs to be tested with ReactJS
 * @param string
 * @returns {Parser}
 */
function searchArrayStringStart(array) {
    return new Parser((input, index = 0) => {
        if (typeof input.source !== 'string') {
            throw 'Input source must be a String';
        }

        let sourceIndex = -1;

        let i = 0;
        while (sourceIndex < 0 && i < array.length) {
            const needle = array[i];
            sourceIndex = input.source.indexOf(needle, index);
            i++;
            if (sourceIndex > 0) {
                break;
            }
        }

        //const sourceIndex = input.source.indexOf(string, index)

        if (sourceIndex > 0) {
            return response.accept(
                input.source.substring(index, sourceIndex),
                input,
                sourceIndex,
                true
            );
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// string -> Parser string char
// index is forwarded at the length of the string
function string(s) {
    return new Parser((input, index = 0) => {
        if (input.subStreamAt(s.split(''), index)) {
            return response.accept(s, input, index + s.length, true);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}