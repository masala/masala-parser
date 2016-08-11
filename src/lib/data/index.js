/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var option = require('./option.js'),
        aTry   = require('./try.js'),
        unit   = require('./unit.js');
    
    return {
        option: option,
        try: aTry,
        unit: unit
    };
    
}());
