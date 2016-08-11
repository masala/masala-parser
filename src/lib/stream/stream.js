
/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var atry  = require('../data/try.js');
     
     /**
      * Stream basic type
      */
     function Stream() {
     }
     
     // Stream 'a => number -> number
     Stream.prototype.location = function(index) {
         return index;
     };
     
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

     return function() {
         return new Stream();
     };
     
 }());