/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import atry from '../data/try.js'

/**
 * ParserResponse basic type
 * fold() is an abstract method implemented in Accept and Reject
 * A Response has two markers: offset and location().
 * Offset is the token count from the start of the input stream, where
 * location() is the character count of the input stream.
 *
 *
 * consumed is a boolean describing if the offset has moved forward. It doesn't mean
 * that the stream is fully consumed. See parser.eos() for that.
 */
class ParserResponse {
    constructor(input, offset, consumed) {
        this.input = input
        this.offset = offset
        this.consumed = consumed
    }

    // Response 'a 'c => unit -> bool
    isAccepted() {
        return this.fold(
            function() {
                return true
            },
            function() {
                return false
            },
        )
    }

    // Response 'a 'c => unit -> bool
    toTry() {
        return this.fold(
            accept => atry.success(accept.value),
            reject =>
                atry.failure(new Error('parser error at ' + reject.offset)),
        )
    }

    isEos() {
        return false //overridden by Accept
    }

    getOffset() {
        return this.offset
    }

    location() {
        return this.input.location(this.getOffset())
    }

    /**
     * fold takes a function to map the value depending on result
     * Abstract function fold(accept, reject)
     *
     * flatMap is a specialization of fold
     */
}

/**
 * Reject response class
 */
class Reject extends ParserResponse {
    constructor(input, offset, consumed) {
        super(input, offset, consumed)
    }

    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a
    fold(_, reject) {
        return reject(this)
    }

    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    map() {
        return this
    }

    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    flatMap() {
        return this
    }

    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    filter() {
        return new Reject(this.input, this.offset, false)
    }
}

/**
 * Accept response class
 */
class Accept extends ParserResponse {
    constructor(value, input, offset, consumed) {
        super(input, offset, consumed)
        this.value = value
    }

    isEos() {
        return this.input.endOfStream(this.offset)
    }

    // Response 'a 'c => (Accept 'a 'c -> 'a) -> (Reject 'a 'c -> 'a) -> 'a
    fold(accept) {
        return accept(this)
    }

    // Response 'a 'c => ('a -> 'b) -> Response 'b 'c
    map(callback) {
        return new Accept(
            callback(this.value, this),
            this.input,
            this.offset,
            this.consumed,
        )
    }

    // Response 'a 'c => ('a -> Response 'b 'c) -> Response 'b 'c
    flatMap(callback) {
        return callback(this.value, this)
    }

    // Response 'a 'c => ('a -> bool) -> Response 'b 'c
    filter(predicate) {
        if (predicate(this.value)) {
            return this
        } else {
            return new Reject(this.input, this.offset, false)
        }
    }
}

/**
 * Constructors
 */
const accept = (value, input, offset, consumed) =>
    new Accept(value, input, offset, consumed)
const reject = (input, offset, consumed) => new Reject(input, offset, consumed)
const response = { accept, reject }

export default response

export { accept, reject }
