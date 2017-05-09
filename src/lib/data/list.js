/*
 * Parsec
 * https://github.com/d-plaindoux/thicket
 *
 * Copyright (c) 2015-2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class List {
    constructor(value) {
        this.value = value;
    }

    size() {
        return this.value.length;
    }

    isEmpty() {
        return this.value.length === 0;
    }

    add(element) {
        return new List(this.value.concat([element]));
    }

    append(list) {
        return new List(this.value.concat(list.value));
    }

    filter(funcall) {
        var result = [];
        for (var i = 0; i < this.value.length; i++) {
            if (funcall(this.value[i])) {
                result.push(this.value[i]);
            }
        }
        return new List(result);
    }

    map(funcall) {
        return new List(this.value.map(funcall));
    }

    flatmap(funcall) {
        var result = new List([]);
        this.value.forEach(value => {
            result = result.append(funcall(value));
        });
        return result;
    }

    array() {
        return this.value.slice();
    }

    join(sep) {
        return this.value.join(sep);
    }
}

export default function() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return new List(arguments[0]);
    }

    return new List(Array.prototype.slice.call(arguments));
}
