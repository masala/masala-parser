/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2015-2016 Didier Plaindoux
 * Licensed under the LGPL3 license.
 */



export const NEUTRAL = Symbol('MASALA_NEUTRAL');


export class Tuple {

    constructor(array) {
        if (array === undefined){
            array = [];
        }
        this.value = array;
    }

    at(index){
        return this.value[index];
    }

    array() {
        return [...this.value];
    }

    single() {
        return this.value[0];
    }

    first() {
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
    return object instanceof Tuple;
}

export function tuple(array){
    if (array===undefined){
        return new Tuple([]);
    }else{
        return new Tuple(array);
    }
}
