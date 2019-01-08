/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2015-2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */



export const NEUTRAL = Symbol('MASALA_NEUTRAL');


export class Tuple {

    constructor(array) {
        this.value = array;
    }

    array() {
        return [...this.value];
    }

    single() {
        return this.value[0];
    }

    last() {
        return this.value[this.size()-1];
    }

    join(j='') {
        return this.value.join(j);
    }

    append(element) {
        if (element === NEUTRAL) {
            return new Tuple([...this.value]);
        }
        if (isTuple(element)) {
            return new Tuple([...this.value, ...element.value]);
        }
        // single element
        return new Tuple([...this.value, element]);
    }

    isEmpty(){
        return this.size() === 0;
    }

    size(){
        return this.value.length;
    }

}


export function isTuple(object) {
    return object && object.constructor && object.constructor.name === 'Tuple';
}

export function tuple(){
    return new Tuple([]);
}