/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import Stream from './stream.js'
import option from '../data/option.js'

/**
 * ParserStream stream class
 * Compared to CharStream, it is NOT a RandomAccess.
 * You must use a substream before making access to an unreached point.
 */
class ParserStream extends Stream {
    constructor(parser, lowerStream) {
        super()
        //TODO: why the parser is called source ?
        this.source = parser
        this.input = lowerStream
        this.offsets = [0]
    }

    getOffset(index) {
        if (index < this.offsets.length) {
            // TODO logger console.log('found offset', this.offsets[index]);
            return option.some(this.offsets[index])
        }
        return option.none()
    }

    // Stream 'a => number -> number
    location(index) {
        if (index === 0) {
            return 0
        }
        const option = this.getOffset(index)
        if (option.isPresent()) {
            // TODO: check the +1 ; the -1 has disappeared
            return this.input.location(option.get())
        } else {
            // TODO logger
            throw 'No location has been found yet for index ' + index
            // TODO: What is the use case ?
            // return this.input.location(this.getOffset(index - 1) + 1);
        }
    }

    // ParserStream 'a => unit -> boolean
    endOfStream(index) {
        const option = this.getOffset(index)
        if (option.isPresent()) {
            return this.input.endOfStream(option.get())
        } else {
            // If last was the last befor end of stream, then yes
            const last = this.offsets[this.offsets.length - 1]
            return this.input.endOfStream(last + 1)
        }
    }

    // ParserStream 'a => number -> 'a <+> error
    /**
     * index is the token index ; It uses getOffset(index) to retrieve the location
     * in the charStream
     * @param index  token index
     */
    unsafeGet(index) {
        // the wrapped parser parses the CharStream
        let sourceIndex
        let option = this.getOffset(index)
        if (option.isPresent()) {
            // we have already read it. Should be caught by the bufferedStream
            sourceIndex = option.get()
        } else {
            // TODO logger
            throw new Error()
        }
        const result = this.source.parse(this.input, sourceIndex)

        if (result.isAccepted()) {
            // Why index+1 ? Because we succeeded, and the source is at result.offset
            this.offsets.push(result.offset)
            return result.value
        } else {
            // TODO logger
            throw new Error()
        }
    }
}

function factory(parser, lowerStream) {
    return new ParserStream(parser, lowerStream)
}

export default factory
