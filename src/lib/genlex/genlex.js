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
        unit = require('../data/unit.js');
    
    // (string -> 'a,string -> 'a,number -> 'a,string -> 'a,char -> 'a) -> GenlexFactory 'a
    function GenlexFactory(keyword, ident, number, string, char) {
        this.keyword = keyword;
        this.ident = ident;
        this.number = number;
        this.string = string;
        this.char = char;
    }
    
    // [String] -> Genlex
    function Genlex(keywords) {
        this.keywordParser = (keywords || []).reduce(
            function(p,s) { 
                return parser.string(s).or(p);
            }, 
            parser.error
        );
        
        var idletter = parser.letter.or(parser.char('_')).or(parser.digit);
        this.identParser = parser.letter.then(idletter.optrep());
    }
    
    // unit -> Parser char char
    Genlex.prototype.space = function() {
        return parser.charIn(" \r\n\f\t");
    };
    
    // unit -> Parser unit char
    Genlex.prototype.spaces = function() {
        return this.space().optrep().map(function() {           
            return unit;
        });
    };

    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.keyword = function (f) {        
        return this.keywordParser.map(function (s) {
            return f.keyword(s); 
        });
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.ident = function (f) {
        return this.identParser.map(function(r) {
            return f.ident([r[0]].concat(r[1]).join('')); 
        });
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.number = function (f) {
        return parser.numberLiteral.map(function(s) {
            return f.number(s); 
        });
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.string = function (f) {
        return parser.stringLiteral.map(function(s) {
            return f.string(s); 
        });
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.char = function (f) {
        return parser.charLiteral.map(function(s) {
            return f.char(s); 
        });
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.token = function (f) {
        return this.keyword(f).
                or(this.ident(f)).
                or(this.number(f)).
                or(this.string(f)).
                or(this.char(f));
    };
    
    // GenLexFactory 'a -> Parser 'a char
    Genlex.prototype.tokenBetweenSpaces = function (f) {
        return this.spaces().
                thenRight(this.token(f)).
                thenLeft(this.spaces());
    };
    
    // GenLexFactory 'a -> Parser ['a] char
    Genlex.prototype.tokens = function (f) {
        return this.tokenBetweenSpaces(f).optrep().thenLeft(parser.eos);
    };
    
    return {
        factory: function(keyword, ident, number, string, char) {
            return new GenlexFactory(keyword, ident, number, string, char);
        },
        generator: function(keywords) {
            return new Genlex(keywords);
        }
    };
    
}());
