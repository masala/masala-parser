/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import atry from '../data/try.js';

/**
 * Response basic type
 * fold() is an abstract method implemented in Accept and Reject
 */
class Response {
    // Response 'a 'c => unit -> bool
    isAccepted() {
        return this.fold(
            function() {
                return true;
            },
            function() {
                return false;
            }
        );
    }

    // Response 'a 'c => unit -> bool
    toTry() {
        return this.fold(
            accept => atry.success(accept.value),
            reject =>
                atry.failure(new Error('parser error at ' + reject.offset))
        );
    }

    isConsumed(){
        return false; //overridden by Accept
    }
}

/**
 * Reject response class
 */
class Reject extends Response {
    constructor(offset, consumed) {
        super();
        this.offset = offset;
        this.consumed = consumed;
    }

    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a
    fold(_, reject) {
        return reject(this);
    }

    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    map() {
        return this;
    }



    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    flatMap() {
        return this;
    }

    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    filter() {
        return new Reject(this.offset, false);
    }
}

/**
 * Accept response class
 */
class Accept extends Response {
    constructor(value, input, offset, consumed) {
        super();
        this.offset = offset;
        this.consumed = consumed;
        this.value = value;
        this.input = input;
    }

    isConsumed(){
        return this.input.endOfStream(this.offset);
    }

    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a
    fold(accept) {
        return accept(this);
    }

    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    map(callback) {
        return new Accept(
            callback(this.value),
            this.input,
            this.offset,
            this.consumed
        );
    }

    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    flatMap(callback) {
        return callback(this.value);
    }

    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    filter(predicate) {
        if (predicate(this.value)) {
            return this;
        } else {
            return new Reject(this.offset, false);
        }
    }
}

/**
 * Constructors
 */
const accept = (value, stream, offset, consumed) =>
    new Accept(value, stream, offset, consumed);
const reject = (offset, consumed) => new Reject(offset, consumed);
const response = {accept, reject};

export default response;
