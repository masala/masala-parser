/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var parser   = require('./parser.js'),
        response = require('./response.js');
    
    return {
        parser: parser,
        response: response
    };
    
}());
        
