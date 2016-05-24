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
     
     // Stream 'a => number -> Try 'a
     Stream.prototype.get = function(index) {
         try {
            if (this.endOfStream(index)) {
                return atry.failure(new Error("End of stream reached")); 
            } else {
                return atry.success(this.unsafeGet(index));
            }
         } catch (e) {
             return atry.failure(e); 
         }
     };    
     
     // Stream 'a => [Comparable 'a] -> number -> boolean
     Stream.prototype.subStreamAt = function(s, index) {
         for (var i = 0; i < s.length; i++) {
             var value = this.get(i + index);
             if (!value.isSuccess() || value.success() !== s[i]) {
                 return false;
             }
         }
         
         return true;
     };
     
     /**
      * String stream class
      */
     function StringStream(source) {
         bless(this, new Stream(source));
     }
     
     // StringStream 'a => unit -> boolean
     StringStream.prototype.endOfStream = function(index) {
         return this.source.length <= index;
     };
     
     // StringStream 'a => number -> 'a <+> error
     StringStream.prototype.unsafeGet = function(index) {
         return this.source.charAt(index);
     };
          
     /**
      * String stream class
      */
     function ArrayStream(source) {
         bless(this, new Stream(source));
     }
     
     // StringStream 'a => unit -> boolean
     ArrayStream.prototype.endOfStream = function(index) {
         return this.source.length <= index;
     };
     
     // StringStream 'a => number -> 'a <+> error
     ArrayStream.prototype.unsafeGet = function(index) {
         return this.source[index];
     };
          
     /** 
      * Constructors
      */
     return {
         ofCharacters : function(source) {
             return new StringStream(source);
         },
         ofArray : function(source) {
             return new ArrayStream(source);
         }
     };
     
 }());