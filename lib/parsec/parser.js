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
    
    var response = require('../data/response.js'),
        option = require('../data/option.js');
    
    // Stream 'a -> number -> Response 'a -> Parser 'a
    function Parser(parse) {
        this.parse = parse;
    }
    
    // Parser 'a => ('a -> Parser 'b) -> Parser 'b
    Parser.prototype.bind = function(f) {
        var self = this;

        return new Parser(function(input,index) {
           return self.parse(input,index).fold(
               function(accept) {
                   return f(accept.value).parse(accept.input,accept.index).fold(
                       function(accept_b) {
                           return response.accept(
                               accept_b.value, 
                               accept_b.input, 
                               accept_b.offset, 
                               accept.consumed || accept_b.consumed
                           ); 
                       },
                       function(reject) {
                           return response.reject(
                               reject.offset, 
                               accept.consumed || reject.consumed
                           );
                       }                       
                   );
               },
               function(reject) {
                   return reject;
               }
           ); 
        });
    };
    
    // Parser 'a => Parser[a,c] -> Parser[a,c]
    Parser.prototype.choice = function(q) {
        var self = this;

        return new Parser(function(input,index) {
            return self.parse(input, index).fold(
                function (accept) {
                    return accept;
                },
                function (reject) {
                    if (reject.consumed) {
                        return reject;
                    } else {                    
                        return q.parse(input,index);
                    }
                }
            );
        });
    };
    
    // Parser 'a => ('a -> Parser 'b) -> Parser 'b
    Parser.prototype.flatmap = function(f) {
      return this.bind(f);  
    };
    
    // Parser 'a => ('a -> 'b) -> Parser 'b
    Parser.prototype.map = function(f) {
        var self = this;
        
        return new Parser(function(input,index) {
           return self.parse(input,index).map(f); 
        });
    };
    
    // Parser 'a => ('a -> boolean) -> Parser 'a
    Parser.prototype.filter = function(p) {
        var self = this;
        
        return new Parser(function(input,index) {
           return self.parse(input,index).filter(p); 
        });
    };
    
    // Parser 'a => Comparable 'a -> Parser 'a
    Parser.prototype.match = function(v) {
        return this.filter(function(a) {
            return a === v;
        });
    };
    
    // Parser 'a => Parser 'b -> Parser ('a,'b)
    Parser.prototype.and = function(p) {
        return this.flatmap(function(a) {
            return p.map(function(b) {
                return [a,b];
            });
        });
    };
    
    // Parser 'a => Parser 'b -> Parser 'b
    Parser.prototype.consume_and = function(p) {
        return this.and(p)[1];
    };
    
    // Parser 'a => Parser 'b -> Parser 'a
    Parser.prototype.and_consume = function(p) {
        return this.and(p)[0];
    };
    
    // Parser 'a -> Parser 'a
    Parser.prototype.or = function(p) {
        return this.choice(p);
    };
    
    // Parser 'a => unit -> Parser (Option 'a)
    Parser.prototype.opt = function() {
        return this.map(option.some).or(returns(option.empty()));
    };
    
    // Parser 'a => unit -> Parser (List 'a)
    Parser.prototype.rep = function() {
        var self = this;
        
        return self.flatmap(function(a) {
            return self.optrep().map(function(b) {
                return [a].concat(b.orElse([]));
            });
        });
    };
    
    // Parser 'a => unit -> Parser (Option (List 'a))
    Parser.prototype.optrep = function() {
        return this.rep().opt();
    };
    
    // 'a -> Parser 'a
    function returns(v) {
        return new Parser(function(input,index) {
            return response.accept(v, input, index, false);
        });
    }
    
    return {
        parse: function(parse) { 
            return new Parser(parse); 
        },
        returns: returns
    };
    
}());