/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var stream = require('./stream.js'),
         bless = require('../data/bless.js');
      
     /**
      * Parser stream class
      */
     function ParserStream(parser, source) {
         bless(this, stream(parser));   
         this.input = source;
         this.offsets = { };
     }
     
     // ParserStream 'a => unit -> boolean
     ParserStream.prototype.endOfStream = function(index) {
         return this.input.endOfStream(this.offsets[index] || index);
     };
     
     // ParserStream 'a => number -> 'a <+> error
     ParserStream.prototype.unsafeGet = function(index) {
         var result = this.source.parse(this.input, this.offsets[index] || index);
         
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