/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2015-2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

export const MASALA_VOID = Symbol('__MASALA__VOID__');
export const MASALA_LIST = Symbol('__MASALA__LIST__');

class List {

    /**
     *  Treated as an internal private constructor
     *  @param value: array of values
     */
    constructor(value) {

        if (!Array.isArray(value)) {
            throw "Illegal state exception: List must have an array in its private constructor";
        }
        // internal token
        this.listType = MASALA_LIST;
        if (value && (value.listType === MASALA_LIST)) {
            // auto flattening
            this.value = value.value;
        } else {
            // nominal case

            this.value = value;
        }
    }

    size() {
        return this.value.length;
    }

    isEmpty() {
        return this.value.length === 0;
    }

    add(element) {
        const array = element!== MASALA_VOID? [element] : [];
        return new List(this.value.concat(array));
    }



    append(list) {
        if (!list || (list.listType !== MASALA_LIST) ) {
            throw 'Append must append a MasalaList'
        }

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

    flatMap(funcall) {
        let result = new List([]);
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



export default function (...args) {
    if (args.length === 0) {
        return new List([]);
    }
    /*if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return new List(arguments[0]);
    }*/
    let values = [];
    args.forEach(arg => {
        if (arg && (arg.listType === MASALA_LIST) ) {
            arg.value.forEach(v => values.push(v)); // flattening
        } else {
            if (arg !== MASALA_VOID) {
                values.push(arg);
            }
        }
    });

    return new List(values);
}

// asList is not exported in the masala lib. Only for internal use
export function asList(array) {
    if (!Array.isArray(array)) {
        throw 'asList expects an array';
    }
    return new List(array);

}

export function isList(list) {
    return list !== undefined
        && typeof list === 'object'
        && list.listType === true;
}