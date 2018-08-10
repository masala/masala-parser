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
    constructor(parser, lowerStream) {
        super();
        this.source = parser;
        this.input = lowerStream;
        this.offsets = {0:0};
    }

    getOffset(index) {
        let higherOffset = 0; // FIXME: take last offset < index
        if (this.offsets[index] === undefined){
            this.iterateTo(index,0, 0);
        }

        if (this.offsets[index] === undefined){
            // We must have advanced to an error
            //FIXME: hack ; if we go further, it's because of a reject
            // and the rejet calls the location, so further in the input
            return index;
            //throw `ParserStream cannot iterate from ${higherOffset} to ${index}`;
        }
        return this.offsets[index];
    }

    iterateTo(sourceIndex, currentIndex=0, start=0){
        if (start >= sourceIndex){
            return; // FIXME: might be a gotcha with semi ambigous separation of tokens
        }

        var response = this.source.parse(this.input, start);
        if (response.isAccepted()){
            // just building offsets map
            this.offsets[currentIndex+1]=response.offset;
            return this.iterateTo(sourceIndex, currentIndex+1, response.offset)
        }else {
            throw response;
        }
    }

    // Stream 'a => number -> number
    location(index) {
        if (index ===0){
            return 0;
        }
        return index;
        return this.input.location(this.getOffset(index - 1) + 1);
    }

    // ParserStream 'a => unit -> boolean
    endOfStream(index) {
        return this.input.endOfStream(this.getOffset(index));
    }

    // ParserStream 'a => number -> 'a <+> error
    /**
     * index is the token index ; It uses getOffset(index) to retrieve the location
     * in the stringStream
     * @param index  token index
     */
    unsafeGet(index) {
        // the wrapped parser parses the StringStream
        var result = this.source.parse(this.input, this.getOffset(index));

        if (result.isAccepted()) {
            // Why index+1 ? Because we succeeded, and the source is at result.offset
            this.offsets[index + 1] = result.offset;
            return result.value;
        } else {
            throw new Error();
        }
    }
}

function factory(parser, lowerStream) {
    return new ParserStream(parser, lowerStream);
}

export default factory;
