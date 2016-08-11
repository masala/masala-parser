/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var data     = require('./data/index.js'),
        genlex   = require('./genlex/index.js'),
        parsec   = require('./parsec/index.js'),
        standard = require('./standard/index.js'),
        stream   = require('./stream/index.js');
    
    return {
        data: data,
        genlex: genlex,
        parsec: parsec,
        standard: standard,
        stream: stream
    };
    
}());
        
