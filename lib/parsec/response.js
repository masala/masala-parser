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
        
    /**
     * unit -> bool
     */
    Response.prototype.isAccepted = function () {
        return this.fold(
            function() { return true;  }, 
            function() { return false; }
        );
    };
    
    /**
     * Accept response class
     */
    function Accept(value,sequence,offset,consumed) {
        bless(this, new Response(offset, consumed));
        
        this.value = value; 
        this.input = sequence;
    }
       
    /**
     * (accept -> 'a) -> (reject -> 'a) -> 'a        
     */
    Accept.prototype.fold = function (accept) {
        return accept(this);  
    };
        
    /**
     * ('a -> 'b) -> Response 'b
     */
    Accept.prototype.map = function (callback) {
        return new Accept(callback(this), this.sequence, this.offset, this.consumed);  
    };
       
    /**
     * ('a -> Response 'b) -> Response 'b
     */
    Accept.prototype.flatmap = function (callback) {
        return callback(this);  
    };
       
    /**
     * ('a -> bool) -> Response 'b
     */
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
    
    /**
     * (accept -> 'a) -> (reject -> 'a) -> 'a        
     */
    Reject.prototype.fold = function (_,reject) {
        return reject(this);  
    };

    /**
     * ('a -> 'b) -> Response 'b
     */
    Reject.prototype.map = function () {
        return this;
    };
    
    /**
     * ('a -> Response 'b) -> Response 'b
     */
    Reject.prototype.flatmap = function () {
        return this;
    };
        
    /**
     * ('a -> bool) -> Response 'b
     */
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