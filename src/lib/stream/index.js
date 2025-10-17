/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import charStreamFactory from './charstream.js'
import arrayStreamFactory from './arraystream.js'
import parserStreamFactory from './parserstream.js'
import bufferedStreamFactory from './bufferedstream.js'

export default {
    ofChars: charStreamFactory,
    ofArrays: arrayStreamFactory,
    ofParsers: parserStreamFactory,
    buffered: bufferedStreamFactory,
}
