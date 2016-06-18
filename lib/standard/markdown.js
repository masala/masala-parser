/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
 
 module.exports = (function() {
     
     'use strict';
     
     var parser = require('../parsec/parser.js');        
     
     //
     // Facilities
     // 
     
     var CR = '\n',
         eol = parser.char(CR).opt(),
         line = parser.notChar(CR).optrep().thenLeft(eol).map(function(c) {
             return [ c.join('') ];
         });
     
     function title(line, level) {
         return { title: line, level: level };
     }
/*
     function line() {
         return parser.try(parser.char("*").thenRight(parser.lazy(line)).thenLeft(parser.char("*"))).
                or(parser.not)
     }
*/         
     function titleSharp() {
         return parser.char('#').rep().then(line).map(function(c) {
             return title(c[1], c[0].length);    
         });
     }

     function titleAlt() {
         return parser.try(
             line.flatmap(function(l) {
                 return parser.char('=').rep().map(function () {
                     return title(l,1);
                }).or(parser.char('-').rep().map(function () {
                     return title(l,2);
                }));
             }).thenLeft(eol)
         );
     }
     
     return titleSharp().or(titleAlt()).or(line).thenLeft(parser.eos);
 }());