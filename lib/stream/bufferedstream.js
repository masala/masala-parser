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
      * Buffered stream class
      */
     function BufferedStream(source) {
         bless(this, stream(source));   
         this.cache = {};
     }
     
     // BufferedStream 'a => unit -> boolean
     BufferedStream.prototype.endOfStream = function(index) {
         return this.source.endOfStream(index);
     };
     
     // override, BufferedStream 'a => number -> Try 'a
     BufferedStream.prototype.get = function(index) {
         var self = this;

         if (!self.cache[index]) {
             self.cache[index] = self.source.get(index);
         }
         
         return self.cache[index];
     };
     
     return function(source) {
         return new BufferedStream(source);
     };
     
 }());