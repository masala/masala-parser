/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */
import Stream from './stream.js'

/**
 * String stream class
 */
class CharStream extends Stream {
    constructor(source) {
        super()
        this.source = source
        this.__is__char__stream = true
    }

    // CharStream 'a => unit -> boolean
    endOfStream(index) {
        return this.source.length <= index
    }

    // CharStream 'a => number -> 'a <+> error
    unsafeGet(index) {
        return this.source.charAt(index)
    }
}

function factory(source) {
    return new CharStream(source)
}

export default factory
