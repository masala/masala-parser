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

import response from './response';
import unit from "../data/unit";
import {AbstractParser} from "./core";


/**
 * Parser class
 */
export default class Parser extends AbstractParser {
    // (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
    constructor(parse) {
        super()
        this.parse = parse.bind(this);
    }
}

// unit -> Parser unit 'c
export function eos() {
    return new Parser((input, index = 0) => {
        if (input.endOfStream(index)) {
            return response.accept(unit, input, index, false);
        } else {
            return response.reject(input, index, false);
        }
    });
}

