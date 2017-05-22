/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import genlex from './genlex';
import token from './token';

class Tokenizer {
    // [String] -> Tokenizer
    constructor(keywords) {
        this.parser = genlex.generator(keywords).tokens(token.builder);
    }

    // Stream char -> Try [Token]
    tokenize(charstream) {
        return this.parser.parse(charstream, 0).toTry();
    }
}

export default function(keywords) {
    return new Tokenizer(keywords);
}
