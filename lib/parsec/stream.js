/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var bless = require('../data/bless.js'),
         atry  = require('../data/try.js');
     
     /**
      * Stream basic type
      */
     function Stream(source) {
         this.source = source;
     }
     
     /**
      * number -> Try 'a
      */
     Stream.prototype.get = function(index) {
         try {
            if (this.EOS(index)) {
                return atry.failure(new Error("End of stream reached")); 
            } else {
                return atry.success(this.unsafeGet(index));
            }
         } catch (e) {
             return atry.failure(e); 
         }
     };    
     
     /**
      * String stream class
      */
     function StringStream(source) {
         bless(this, new Stream(source));
     }
     
     /**
      * unit -> boolean
      */
     StringStream.prototype.EOS = function(index) {
         return this.source.length <= index;
     };
     
     /**
      * number -> 'a <+> error
      */
     StringStream.prototype.unsafeGet = function(index) {
         return this.source.charAt(index);
     };
     
     /**
      * number -> Stream 'a
      */
     StringStream.prototype.commit = function (/*index*/) {
         return this;
     };
     
     /** 
      * Constructors
      */
     return {
         ofCharacters : function(source) {
             return new StringStream(source);
         }
     };
     
 }());