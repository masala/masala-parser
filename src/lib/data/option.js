/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

/**
 * Private class Option, accessible from someOrNone() or none()
 */
class Option {
    constructor(value) {
        this.value = value;
    }

    isPresent() {
        return this.value !== null && this.value !== undefined;
    }

    map(bindCall) {
        if (this.isPresent()) {
            return someOrNone(bindCall(this.value));
        } else {
            return this;
        }
    }

    flatMap(bindCall) {
        if (this.isPresent()) {
            return bindCall(this.value);
        } else {
            return this;
        }
    }

    filter(f) {
        if (this.isPresent() && f(this.value)) {
            return this;
        }

        // equivalent of return none() without cyclic creation
        // eslint : no-use-before-define
        return new Option();
    }

    get() {
        return this.value;
    }

    orElse(value) {
        if (this.isPresent()) {
            return this.value;
        } else {
            return value;
        }
    }

    orLazyElse(value) {
        if (this.isPresent()) {
            return this.value;
        } else {
            return value();
        }
    }
}

function someOrNone(value) {
    return new Option(value);
}

function none() {
    return new Option();
}

export default {
    some: someOrNone,
    none,
};
