/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import stringStreamFactory from './stringstream';

export default {
    ofString : stringStreamFactory
}

/*
 module.exports = (function() {

 'use strict';

 var stringstream = require('./stringstream.js'),
 arraystream = require('./arraystream.js'),
 parserstream = require('./parserstream.js'),
 bufferedstream = require('./bufferedstream.js');


 return {
 ofString : stringstream,
 ofArray : arraystream,
 ofParser : parserstream,
 buffered : bufferedstream
 };

 }());
 */