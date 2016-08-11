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
        token  = require('./token.js'),
        tokenizer = require('./tokenizer.js');
    
    return {
        genlex: genlex,
        token: token,
        tokenizer: tokenizer
    };
    
}());
