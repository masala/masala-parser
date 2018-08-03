/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Stream from './stream';

/**
 * ParserStream stream class
 */
class ParserStream extends Stream {
    constructor(parser, source) {
        super();
        this.source = parser;
        this.input = source;
        this.offsets = {};
    }

    getOffset(index) {
        let that = this;
        if (this.offsets[index] === undefined){
            console.error('unknown offset', this.offsets, index);

        }
        // FIX ME: not safe; probably this.offsets[index] || 0
        return this.offsets[index] || index;
    }

    // Stream 'a => number -> number
    location(index) {
        return this.input.location(this.getOffset(index - 1) + 1);
    }

    // ParserStream 'a => unit -> boolean
    endOfStream(index) {
        return this.input.endOfStream(this.getOffset(index));
    }

    // ParserStream 'a => number -> 'a <+> error
    unsafeGet(index) {
        // the wrapped parser parses the StringStream
        var result = this.source.parse(this.input, this.getOffset(index));

        if (result.isAccepted()) {
            this.offsets[index + 1] = result.offset;
            return result.value;
        } else {
            throw new Error();
        }
    }
}

function factory(parser, source) {
    return new ParserStream(parser, source);
}

export default factory;
