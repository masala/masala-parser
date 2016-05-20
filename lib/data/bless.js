/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';

    function bless(object, parent) {
        var objectPrototype = Object.getPrototypeOf(object),
            parentPrototype = Object.getPrototypeOf(parent),
            key;
        
        // Methods
        for(key in parentPrototype){
            if (objectPrototype.hasOwnProperty(key)) {
                continue;
            }         
            if (parentPrototype.hasOwnProperty(key)) {
                objectPrototype[key] = parentPrototype[key];
            }         
        }

        // Attributes
        for(key in parent){
            if (object.hasOwnProperty(key)) {
                continue;
            }         
            if (parent.hasOwnProperty(key)) {
                object[key] = parent[key];
            }         
        }
        
        // Super class
        objectPrototype.super = parentPrototype;
    }
    
    return bless;
    
}());
