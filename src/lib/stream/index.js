/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import stringStreamFactory from './stringstream';
import arrayStreamFactory from './arraystream';
import parserStreamFactory from './parserstream';
import bufferedStreamFactory from './bufferedstream';

export default {
    ofString: stringStreamFactory,
    ofArray: arrayStreamFactory,
    ofParser: parserStreamFactory,
    buffered: bufferedStreamFactory,
};
