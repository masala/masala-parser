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
     
     var eol = parser.char('\n').opt();
     
     function title(line, level) {
         return { title: line, level: level };
     }
     
     function italicText(text) {
         return { italic: text };
     }

     function boldText(text) {
         return { bold: text };
     }

     function strikeText(text) {
         return { strike: text };
     }

     function normalText(c) {
         return { text: [c[0]].concat(c[1]).join('') };
     }

     function italic() {
         return parser.try(parser.string("*").thenRight(parser.lazy(text)).thenLeft(parser.string("*")).
                        or(parser.string("_").thenRight(parser.lazy(text)).thenLeft(parser.string("_"))).
                        map(italicText));
     }

     function bold() {
         return parser.try(parser.string("**").thenRight(parser.lazy(text)).thenLeft(parser.string("**")).
                        or(parser.string("__").thenRight(parser.lazy(text)).thenLeft(parser.string("__"))).
                        map(boldText));
     }
     
     function strike() {
         return parser.try(parser.string("~~").thenRight(parser.lazy(text)).thenLeft(parser.string("~~")).
                        map(strikeText));
     }
     
     function text() {
         return parser.notChar('\n').then(parser.charNotIn('\n*_~').optrep()).map(normalText);
     }
     
     function line() {
         return (bold().
                 or(italic()).
                 or(strike()).
                 or(text())).
                then(parser.lazy(line)).map(function(c) {
                    return [c[0]].concat(c[1]);
                }).
                or(eol.map(function() { return []; }));
     }
     
     function titleSharp() {
         return parser.char('#').rep().then(line()).map(function(c) {
             return [ title(c[1], c[0].length) ];    
         });
     }

     function titleAlt() {
         return parser.try(
             line().flatmap(function(l) {
                 return parser.char('=').rep().map(function () {
                     return [ title(l,1) ];
                }).or(parser.char('-').rep().map(function () {
                     return [ title(l,2) ];
                }));
             }).thenLeft(eol)
         );
     }
     
     return titleSharp().or(titleAlt()).or(line()).thenLeft(parser.eos);
 }());