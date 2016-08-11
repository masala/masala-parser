/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var json     = require('./jsonparser.js'),
        markdown = require('./markdown.js');
    
    return {
        json: json,
        markdown: markdown
    };
    
}());
        
