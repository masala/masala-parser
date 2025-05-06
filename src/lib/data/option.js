/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

/**
 * Need a reference object in memory for uniqueness. Symbols causes troubles.
 */
const empty = {__MASALA_EMPTY__:'empty'};

/**
 * Private class Option, accessible from someOrNone() or none()
 */
class Option {
    constructor(value) {
        this.value = value;
    }

    isPresent() {
        return this.value !== empty;
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
        return new Option(empty);
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
    return new Option(empty);
}

export default {
    some: someOrNone,
    none,
};
