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
      * Array stream class
      */
     function ArrayStream(source) {
         this.source = source;
     }

     ArrayStream.prototype = stream();
     
     // ArrayStream 'a => unit -> boolean
     ArrayStream.prototype.endOfStream = function(index) {
         return this.source.length <= index;
     };
     
     // ArrayStream 'a => number -> 'a <+> error
     ArrayStream.prototype.unsafeGet = function(index) {
         return this.source[index];
     };

     return function(source) {
         return new ArrayStream(source);
     };
          
 }());