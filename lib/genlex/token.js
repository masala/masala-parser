/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';
    
    var parser = require('../parsec/parser.js'),
        response = require('../parsec/response.js'),
        option = require('../data/option.js');
    
    function Token() {
    }
    
    Token.prototype.keyword = function() {
        return option.none();
    };
      
    Token.prototype.ident =  function() {
        return option.none();
    };
        
    Token.prototype.number =  function() {
        return option.none();
    };
        
    Token.prototype.string =  function() {
        return option.none();
    };
        
    Token.prototype.char =  function() {
        return option.none();
    };
    
    function TKKeyword(value) {
        this.value = value;
    }
    
    TKKeyword.prototype = new Token();
    
    TKKeyword.prototype.keyword = function() {
        return option.some(this.value);
    };
    
    function TKIdent(value) {
        this.value = value;
    }
    
    TKIdent.prototype = new Token();
    
    TKIdent.prototype.ident = function() {
        return option.some(this.value);
    };
    
    function TKNumber(value) {
        this.value = value;
    }
    
    TKNumber.prototype = new Token();
    
    TKNumber.prototype.number = function() {
        return option.some(this.value);
    };
    
    function TKString(value) {
        this.value = value;
    }
    
    TKString.prototype = new Token();

    TKString.prototype.string = function() {
        return option.some(this.value);
    };
    
    function TKChar(value) {
        this.value = value;
    }
    
    TKChar.prototype = new Token();    
    
    TKChar.prototype.char = function() {
        return option.some(this.value);
    };
    
    // (Token -> Option 'a) -> Parser 'a Token
    function literal(tokenise) {
        return parser.parse(function(input, index) {
           return input.get(index).map(function(value) {
               return tokenise(value).map(function(token){
                   return response.accept(token, input, index+1, true);
               }).orLazyElse(function() {
                   return response.reject(input.location(index), false);     
               });
           }).lazyRecoverWith(function() {
               return response.reject(input.location(index), false); 
           });
        });
    }
    
    return {
        builder: {
            keyword: function (value) {
                return new TKKeyword(value);
            },        
            ident: function (value) {
                return new TKIdent(value);
            },        
            number: function (value) {
                return new TKNumber(value);
            },        
            string: function (value) {
                return new TKString(value);
            },        
            char: function (value) {
                return new TKChar(value);
            }
        },
        parser: {
            keyword : literal(function(token) {
                return token.keyword();
            }),
            ident : literal(function(token) {
                return token.ident();
            }),
            number : literal(function(token) {
                return token.number();
            }),
            string : literal(function(token) {
                return token.string();
            }),
            char : literal(function(token) {
                return token.char();
            })
        }
    };
        
}());