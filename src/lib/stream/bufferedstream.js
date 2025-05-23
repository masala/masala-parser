/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */
import Stream from "./stream.js";

/**
 * Buffered stream class
 */
class BufferedStream extends Stream {
    constructor(source) {
        super();
        this.source = source;
        this.cache = {};
    }

    location(index) {
        return this.source.location(index);
    }

    // BufferedStream 'a => unit -> boolean
    endOfStream(index) {
        return this.source.endOfStream(index);
    }

    // override, BufferedStream 'a => number -> Try 'a
    get(index) {
        var self = this;

        if (!self.cache[index]) {
            self.cache[index] = self.source.get(index);
        }

        return self.cache[index];
    }
}

function factory(source) {
    return new BufferedStream(source);
}

export default factory;
