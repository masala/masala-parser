/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import data from './data/index';
import genlex from './genlex/index';
import parsec from './parsec/index';
import parser from './parsec/parser';
import {F, C, N} from './parsec/index';
import standard from './standard/index';
import stream from './stream/index';

const JSON = standard.jsonParser;
const MD = standard.markdownBundle;
const X = standard.extractorBundle;
const T = standard.tokenBundle;

export {
    data,
    genlex,
    parsec,
    standard,
    stream,
    parser,
    F,
    C,
    N,
    JSON,
    MD,
    X,
    T,
};
