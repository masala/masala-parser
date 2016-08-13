/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import parser from  '../parsec/parser.js';
import unit from  '../data/unit.js';

// (string -> 'a,string -> 'a,number -> 'a,string -> 'a,char -> 'a) -> GenlexFactory 'a
function GenlexFactory(keyword, ident, number, string, char) {
    this.keyword = keyword;
    this.ident = ident;
    this.number = number;
    this.string = string;
    this.char = char;
}


class Genlex {

    // [String] -> Genlex
    constructor(keywords) {
        this.keywordParser = (keywords || []).reduce(
            (p, s) => parser.string(s).or(p),
            parser.error
        );

        var idletter = parser.letter.or(parser.char('_')).or(parser.digit);
        this.identParser = parser.letter.then(idletter.optrep());
    }

    // unit -> Parser char char
    space() {           
        return parser.charIn(" \r\n\f\t");
    }

    // unit -> Parser unit char
    spaces() {
        return this.space().optrep().map(() => unit);
    }

    // GenLexFactory 'a -> Parser 'a char
    keyword(f) {
        return this.keywordParser.map(s => f.keyword(s));
    }

    // GenLexFactory 'a -> Parser 'a char
    ident(f) {
        return this.identParser.map(
            r => f.ident([r[0]].concat(r[1]).join(''))
        );
    }

    // GenLexFactory 'a -> Parser 'a char
    number(f) {
        return parser.numberLiteral.map(s => f.number(s));
    }

    // GenLexFactory 'a -> Parser 'a char
    string(f) {
        return parser.stringLiteral.map(s => f.string(s));
    }

    // GenLexFactory 'a -> Parser 'a char
    char(f) {
        return parser.charLiteral.map(s => f.char(s));
    }

    // GenLexFactory 'a -> Parser 'a char
    token(f) {
        return this.keyword(f).or(this.ident(f)).or(this.number(f)).or(this.string(f)).or(this.char(f));
    }

    // GenLexFactory 'a -> Parser 'a char
    tokenBetweenSpaces(f) {
        return this.spaces().thenRight(this.token(f)).thenLeft(this.spaces());
    }

    // GenLexFactory 'a -> Parser ['a] char
    tokens(f) {
        return this.tokenBetweenSpaces(f).optrep().thenLeft(parser.eos);
    }
}

export default {
    factory: function (keyword, ident, number, string, char) {
        return new GenlexFactory(keyword, ident, number, string, char);
    },
    generator: function (keywords) {
        return new Genlex(keywords);
    }
};
