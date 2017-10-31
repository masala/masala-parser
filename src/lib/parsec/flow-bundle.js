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
function lazy(p, parameters) {
    // equivalent of p(...parameters), but would fail if parameters are undefined
    return new Parser((input, index = 0) =>
        p.apply(p.prototype, parameters).parse(input, index)
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

function startsWith(value){
    return nop().thenReturns(value);
}

export default {
    parse,
    nop: nop,
    try: doTry,
    any: any(),
    subStream: subStream,
    not: not,
    lazy: lazy,
    returns: returns,
    error: error(),
    eos: eos(),
    satisfy: satisfy,
    sequence,
    startsWith
};
