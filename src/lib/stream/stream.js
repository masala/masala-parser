/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import atry from '../data/try.js'

/**
 * Abstract methods:
 * - unsafeGet(index)
 */
class Stream {
    constructor() {}

    // Stream 'a => number -> number
    location(index) {
        return index
    }

    // Stream 'a => number -> Try 'a
    get(index) {
        try {
            if (this.endOfStream(index)) {
                return atry.failure(new Error('End of stream reached'))
            } else {
                return atry.success(this.unsafeGet(index))
            }
        } catch (e) {
            return atry.failure(e)
        }
    }

    // Stream 'a => [Comparable 'a] -> number -> boolean
    subStreamAt(s, index) {
        for (var i = 0; i < s.length; i++) {
            var value = this.get(i + index)
            if (!value.isSuccess() || value.success() !== s[i]) {
                return false
            }
        }

        return true
    }
}

export default Stream
