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
      * Parser stream class
      */
     function ParserStream(parser, source) {
         this.source = parser;
         this.input = source;
         this.offsets = { };
     }
     
     ParserStream.prototype = stream();
     
     ParserStream.prototype.getOffset = function(index) {
         return this.offsets[index] || index;
     };
               
     // Stream 'a => number -> number
     ParserStream.prototype.location = function(index) {
         return this.input.location(this.getOffset(index-1) + 1);
     };
     
     // ParserStream 'a => unit -> boolean
     ParserStream.prototype.endOfStream = function(index) {
         return this.input.endOfStream(this.getOffset(index));
     };
     
     // ParserStream 'a => number -> 'a <+> error
     ParserStream.prototype.unsafeGet = function(index) {
         var result = this.source.parse(this.input, this.getOffset(index));

         if (result.isAccepted()) {
             this.offsets[index+1] = result.offset;
             return result.value;
         } else {
             throw new Error();
         }
     };

     return function(parser, source) {
         return new ParserStream(parser, source);
     };
     
 }());