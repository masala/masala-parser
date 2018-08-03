/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import {GenLex} from '../../genlex/genlex';

import {F} from '../../parsec/index';
import {C, N} from "../../parsec";

//
// Facilities
//

let genlex = new GenLex();
genlex.keywords(['null', 'false', 'true', '{', '}', '[', ']', ':', ',']);
let number = genlex.tokenize(N.numberLiteral(), 'number', 1100);
let string = genlex.tokenize(C.stringLiteral(), 'string', 800);

function tkKey(s) {
    return genlex.get(s);
}

// unit -> Parser ? Token
function arrayOrNothing() {
    var value = [],
        addValue = e => {
            value = value.concat(e);
            console.log('added value to array', value);
        },
        getValue = () => value,
        item = F.lazy(expr).map(addValue);
    return item.then(tkKey(',').thenRight(item).optrep()).opt().map(getValue);
}

// unit -> Parser ? Token
function objectOrNothing() {
    var value = {},
        addValue = e => {
            value[e[0]] = e[1];
            console.log('added value in object', value);
        },
        getValue = () => value,
        attribute = string
            .thenLeft(tkKey(':'))
            .then(F.lazy(expr))
            .map(addValue);
    return attribute
        .thenLeft(tkKey(',').then(attribute).optrep())
        .opt()
        .map(getValue);
}

// unit -> Parser ? Token
function expr() {
    return number
        .or(string)
        .or(tkKey('null').thenReturns(null))
        .or(tkKey('true').thenReturns(true))
        .or(tkKey('false').thenReturns(false))
        .or(tkKey('[').thenRight(F.lazy(arrayOrNothing)).thenLeft(tkKey(']')))
        .or(tkKey('{').thenRight(F.lazy(objectOrNothing)).thenLeft(tkKey('}')));
}

//const parse =
export default {
    parse: function (source) {

        const parser = genlex.use(expr().thenLeft(F.eos()));

        return parser.parse(source, 0);
    },
};
