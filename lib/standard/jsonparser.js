/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var parser = require('../parsec/parser.js'),
         genlex = require('../genlex/genlex.js'), 
         token = require('../genlex/token.js');
     
     //
     // Facilities
     // 
     
     var tkNumber = token.parser.number,
         tkString = token.parser.string,
         tkKeyword = token.parser.keyword;
     
     function tkKey(s) {
         return tkKeyword.match(s);
     }

     // unit -> Parser ? Token
     function array() {
         return parser.lazy(expr).
                thenLeft(tkKey(',').then(parser.lazy(array)).opt());
     }

     // unit -> Parser ? Token
     function object() {
         return tkString.thenLeft(tkKey(':')).then(parser.lazy(expr)).
                thenLeft(tkKey(',').then(parser.lazy(object)).opt());
     }

     // unit -> Parser ? Token
     function expr() { 
         return tkNumber.
                or(tkString).
                or(tkKey("null")).
                or(tkKey("true")).
                or(tkKey("false")).
                or(tkKey('[').thenRight(parser.lazy(array).opt()).thenLeft(tkKey(']'))).
                or(tkKey('{').thenRight(parser.lazy(object).opt()).thenLeft(tkKey('}')));
     }
     
     function keywords() {
          return [ "null", "false", "true", "{", "}", "[", "]", ":", "," ];
     }

     return {
         parse : function (source) {
             var tokenizer = genlex.generator(keywords()).tokenBetweenSpaces(token.builder);

             return tokenizer.chain(expr().thenLeft(parser.eos)).parse(source, 0);
         },
         tokenize: function (source) {
             var tokenizer = genlex.generator(keywords()).tokens(token.builder);

             return tokenizer.parse(source, 0);
         }
     };

}());