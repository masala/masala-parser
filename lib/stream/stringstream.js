/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var stream = require('./stream.js');
     
     /**
      * String stream class
      */
     function StringStream(source) {
         this.source = source;
     }
     
     StringStream.prototype = stream();
     
     // StringStream 'a => unit -> boolean
     StringStream.prototype.endOfStream = function(index) {
         return this.source.length <= index;
     };
     
     // StringStream 'a => number -> 'a <+> error
     StringStream.prototype.unsafeGet = function(index) {
         return this.source.charAt(index);
     };

     return function(source) {
         return new StringStream(source);
     };
     
 }());