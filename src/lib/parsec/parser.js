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

import option from '../data/option.js';
import response from "./response";


/**
 * Parser class
 */
export default class Parser{

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

    /**
     * Prints a hint if the parser enters in this step
     * @param hint
     * @returns the equivalent Parser
     */
    debug(hint, details = true) {
        var f = (p)=> {
            if (details){
                console.log('[debug] : ', hint, p);
            }else{
                console.log('[debug] : ', hint);
            }

            return p;
        };
        return this.map(f);
    }

    flattenDeep() {
        return this.map(self => flattenDeep(self))
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

function returns(v) {
    return new Parser((input, index=0) => response.accept(v, input, index, false));
}





/**
 * utility function for flattenDeep()
 */

function flattenDeep(array) {
    let toString = Object.prototype.toString;
    let arrayTypeStr = '[object Array]';
    let result = [];
    let nodes =  array.slice();
    let node;


    if (!array.length) {
        return result;
    }

    node = nodes.pop();

    do {
        if (toString.call(node) === arrayTypeStr) {
            nodes.push.apply(nodes, node);
        } else {
            result.push(node);
        }
    } while (nodes.length && (node = nodes.pop()) !== undefined);

    result.reverse(); // we reverse result to restore the original order
    return result;
}



