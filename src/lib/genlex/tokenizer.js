/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var genlex = require('./genlex.js'),
        token = require('./token.js');
    
    // [String] -> Tokenizer
    function Tokenizer(keywords) {
        this.parser = genlex.generator(keywords).tokens(token.builder);
    }
    
    // Stream char -> Try [Token]
    Tokenizer.prototype.tokenize = function (charstream) {
        return this.parser.parse(charstream,0).toTry();
    };
    
    return function (keywords) {
        return new Tokenizer(keywords);
    };
    
}());
