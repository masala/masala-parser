/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

 /*
  * Parsec: Direct Style Monadic Parser Combinators For The Real World
  * 
  * http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf
  */

module.exports = (function () {
    
    'use strict';
    
    var bless = require('../data/bless.js');
    
    /**
     * Response basic type
     */
    function Response(offset, consumed) {
        this.offset = offset;
        this.consumed = consumed;
    }
        
    // Response 'a 'c => unit -> bool
    Response.prototype.isAccepted = function () {
        return this.fold(
            function() { return true;  }, 
            function() { return false; }
        );
    };
    
    /**
     * Accept response class
     */
    function Accept(value,input,offset,consumed) {
        bless(this, new Response(offset, consumed));
        
        this.value = value; 
        this.input = input;
    }
       
    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a        
    Accept.prototype.fold = function (accept) {
        return accept(this);  
    };
        
    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    Accept.prototype.map = function (callback) {
        return new Accept(callback(this), this.sequence, this.offset, this.consumed);  
    };
       
    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    Accept.prototype.flatmap = function (callback) {
        return callback(this);  
    };
       
    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    Accept.prototype.filter = function (predicate) {
        if (predicate(this)) {
            return this;
        } else {
            return new Reject(this.offset, false);
        }
    };
       
    /**
     * Reject response class
     */
    function Reject(offset,consumed) {
        bless(this, new Response(offset, consumed));
    }
    
    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a        
    Reject.prototype.fold = function (_,reject) {
        return reject(this);  
    };

    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    Reject.prototype.map = function () {
        return this;
    };
    
    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    Reject.prototype.flatmap = function () {
        return this;
    };
        
    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    Reject.prototype.filter = function () {
        return new Reject(this.offset, false);
    };
    
     /** 
      * Constructors
      */    
    return {
        accept: function(value,sequence,offset,consumed) {
            return new Accept(value,sequence,offset,consumed);
        },
        reject: function(offset,consumed) {
            return new Reject(offset,consumed);
        }
    };
    
}());