/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

module.exports = (function () {
    
    'use strict';

    function Option(value) {
        this.value = value;
    }    
    
    function someOrNone(value) {
        return new Option(value);
    }
    
    function none() {
        return new Option();
    }
    
    Option.prototype.isPresent = function () {
        return (this.value !== null && this.value !== undefined);
    };
    
    Option.prototype.map = function (bindCall) {
        if (this.isPresent()) {
            return someOrNone(bindCall(this.value));
        } else {
            return this;
        }
    };

    Option.prototype.flatmap = function (bindCall) {
        if (this.isPresent()) {
            return bindCall(this.value);
        } else {
            return this;
        }
    };

    Option.prototype.filter = function (f) {
        if (this.isPresent() && f(this.value)) {
            return this;
        }
        
        return none();
    };
    
    Option.prototype.get = function () {
        return this.value;
    };
    
    Option.prototype.orElse = function (value) {
        if (this.isPresent()) {
            return this.value;
        } else {
            return value;
        }
    };
    
    Option.prototype.orLazyElse = function (value) {
        if (this.isPresent()) {
            return this.value;
        } else {
            return value();
        }
    };
    
    return {
        some  : someOrNone,
        none  : none
    };
}());