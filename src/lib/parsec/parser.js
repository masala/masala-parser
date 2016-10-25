/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

/*
 * Parsec: Direct Style Monadic Parser Combinators For The Real World
 *
 * http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf
 */


import  stream from '../stream/index.js';
import unit from '../data/unit.js';
import option from '../data/option.js';
import response from "./response";


/**
 * Parser class
 */
class Parser{

    // (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
    constructor(parse){
        this.parse = parse;
    }

    // Parser 'a 'c => ('a -> Parser 'b 'c) -> Parser 'b 'c
    flatmap(f) {
        return bind(this, f);
    }

    // Parser 'a 'c => ('a -> 'b) -> Parser 'b 'c
    map(f) {
        var self = this;

        return new Parser((input, index=0) => self.parse(input, index).map(f));
    }

    // Parser 'a 'c => ('a -> boolean) -> Parser 'a 'c
    filter(p) {
        var self = this;

        return new Parser((input, index=0) => self.parse(input, index).filter(p));
    }

    // Parser 'a 'c => Comparable 'a -> Parser 'a 'c
    match(v) {
        return this.filter((a) => a === v);
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser ('a,'b) 'c
    then(p) {
        return this.flatmap((a) => p.map((b) => [a, b]));
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'a 'c
    thenLeft(p) {
        return this.then(p).map((r) => r[0]);
    }

    // Parser 'a 'c => 'b -> Parser 'b 'c
    thenReturns(v) {
        return this.thenRight(returns(v));
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'b 'c
    thenRight(p) {
        return this.then(p).map((r) => r[1]);
    }

    // Parser 'a 'c -> Parser 'a 'c
    or(p) {
        return choice(this, p);
    }

    // Parser 'a 'c => unit -> Parser (Option 'a) 'c
    opt() {
        return this.map(option.some).or(returns(option.none()));
    }


    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    rep() {
        return repeatable(this, () => true, (l) => l !== 0);
    }

    // Parser 'a 'c => number -> Parser (List 'a) 'c
    occurrence(occurrence) {
        return repeatable(this, (l) => l < occurrence, (l) => l === occurrence);
    }

    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    optrep() {
        return repeatable(this, () => true, () => true);
    }

    // Parser 'a 'c => Parser 'b 'a -> Parser 'b 'c
    chain(p) {
        var self = this;

        return new Parser((input, index=0) => 
            p.parse(stream.buffered(stream.ofParser(self, input)), index)
        );
    }
}


// Response 'a 'c -> ('a -> Parser 'b 'c) -> Response 'b 'c
function bindAccepted(accept_a, f) {
    return f(accept_a.value).parse(accept_a.input, accept_a.offset).fold(
        (accept_b) =>
            response.accept(
                accept_b.value,
                accept_b.input,
                accept_b.offset,
                accept_a.consumed || accept_b.consumed
            ),
        (reject_b) => 
            response.reject(
                accept_a.input.location(reject_b.offset),
                accept_a.consumed || reject_b.consumed
            )
    );
}

// Parser 'a 'c -> ('a -> Parser 'b 'c) -> Parser 'b 'c
function bind(self, f) {
    return new Parser((input, index=0) => 
        self.parse(input, index).fold(
            (accept_a) => bindAccepted(accept_a, f),
            (reject_a) => reject_a
        )
    );
}

// Parser 'a 'c -> Parser 'a 'c -> Parser 'a 'c
function choice(self, f) {
    return new Parser((input, index=0) =>
        self.parse(input, index).fold(
            (accept) => accept,
            (reject) => reject.consumed ? reject : f.parse(input, index)        
        )
    );
}


// Parser 'a 'c -> unit -> Parser (List 'a) 'c
function repeatable(self, occurrences, accept) {
    return new Parser((input, index=0) => {
        var consumed = false,
            value = [],
            offset = index,
            current = self.parse(input, index);

        while (current.isAccepted() && occurrences(value.length)) {
            value.push(current.value);
            consumed = consumed || current.consumed;
            offset = current.offset;

            current = self.parse(input, offset);
        }

        if (accept(value.length)) {
            return response.accept(value, input, offset, consumed);
        }

        return response.reject(offset, consumed);
    });
}


/*
 * Builders
 */

// (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
function parse(p) {
    return new Parser(p);
}

// (('b -> Parser 'a 'c) * 'b)-> Parser 'a 'c
function lazy(p, parameters) {
    // equivalent of p(...parameters), but would fail if parameters are undefined
    return new Parser((input, index=0) => p.apply(p.prototype, parameters).parse(input, index));
}

// 'a -> Parser 'a 'c
function returns(v) {
    return new Parser((input, index=0) => response.accept(v, input, index, false));
}

// unit -> Parser 'a 'c
function error() {
    return new Parser((input, index=0) => response.reject(input.location(index), false));
}

// unit -> Parser unit 'c
function eos() {
    return new Parser((input, index=0) => {
        if (input.endOfStream(index)) {
            return response.accept(unit, input, index, false);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// ('a -> boolean) -> Parser a 'c
function satisfy(predicate) {
    return new Parser((input, index=0) =>
        input.get(index).filter(predicate).
                      map((value) => response.accept(value, input, index + 1, true)).
                      lazyRecoverWith(() => response.reject(input.location(index), false))
    );
}

// Parser 'a 'c -> Parser 'a 'c
function doTry(p) {
    return new Parser((input, index=0) =>
        p.parse(input, index).fold(
            (accept) => accept,
            (reject) => response.reject(input.location(reject.offset), false)
        )
    );
}

// unit -> Parser 'a 'c
function any() {
    return satisfy(() => true);
}

// Parser 'a ? -> Parser 'a 'a
function not(p) {
    return doTry(p).then(error()).or(any());
}

// unit -> Parser char char
function digit() {
    return satisfy((v) => '0' <= v && v <= '9');
}

// unit -> Parser char char
function lowerCase() {
    return satisfy((v) => 'a' <= v && v <= 'z');
}

// unit -> Parser char char
function upperCase() {
    return satisfy((v) => 'A' <= v && v <= 'Z');
}

// unit -> Parser char char
function letter() {
    return satisfy((v) => ('a' <= v && v <= 'z') || ('A' <= v && v <= 'Z'));
}

// char -> Parser char char
function char(c) {
    if (c.length !== 1) {
        throw new Error("Char parser must contains one character");
    }

    return satisfy((v) => c === v);
}

// char -> Parser char char
function notChar(c) {
    if (c.length !== 1) {
        throw new Error("Char parser must contains one character");
    }

    return satisfy((v) => c !== v);
}

// string -> Parser char char
function charIn(c) {
    return satisfy((v) => c.indexOf(v) !== -1);
}

// string -> Parser char char
function charNotIn(c) {
    return satisfy((v) => c.indexOf(v) === -1);
}

// string -> Parser string char
function string(s) {
    return new Parser((input, index=0) => {
        if (input.subStreamAt(s.split(''), index)) {
            return response.accept(s, input, index + s.length, true);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// string -> Parser string char
function notString(s) {
    return not(string(s));
}

// unit -> Parser char char
function charLiteral() {
    var anyChar = string("\\'").or(notChar("'"));
    return char("'").thenRight(anyChar).thenLeft(char("'"));
}

// unit -> Parser string char
function stringLiteral() {
    var anyChar = string('\\"').or(notChar('"'));
    return char('"').thenRight(anyChar.optrep()).thenLeft(char('"')).map((r) => r.join(''));
}

// unit -> Parser number char
function numberLiteral() {
    // [-+]?\d+([.]\d+)?([eE][+-]?\d+)?
    var join = (r) => r.join(''),
        joinOrEmpty = (r) => r.map(join).orElse(''),
        digits = digit().rep().map(join),
        integer = charIn("+-").opt().then(digits).map((r) => r[0].orElse('') + r[1]),
        float = integer.
                then(char('.').then(digits).opt().map(joinOrEmpty)).
                then(charIn('eE').then(integer).opt().map(joinOrEmpty)).
                map((r) => r[0][0] + r[0][1] + r[1]);

    return float.map((r) => parseFloat(r, 10));
}


export default {
    parse: parse,
    lazy: lazy,
    returns: returns,
    error: error(),
    eos: eos(),
    satisfy: satisfy,
    try: doTry,
    any: any(),
    digit: digit(),
    lowerCase: lowerCase(),
    upperCase: upperCase(),
    not: not,
    letter: letter(),
    notChar: notChar,
    char: char,
    charIn: charIn,
    charNotIn: charNotIn,
    string: string,
    notString: notString,
    charLiteral: charLiteral(),
    stringLiteral: stringLiteral(),
    numberLiteral: numberLiteral()
}