/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL2 license.
 */

import stringStreamFactory from "./stringstream.js";
import arrayStreamFactory from "./arraystream.js";
import parserStreamFactory from "./parserstream.js";
import bufferedStreamFactory from "./bufferedstream.js";

export default {
    ofString: stringStreamFactory,
    ofArray: arrayStreamFactory,
    ofParser: parserStreamFactory,
    buffered: bufferedStreamFactory,
};
