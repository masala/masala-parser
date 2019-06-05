/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import data from './data/index';
import {GenLex,getMathGenLex} from './genlex/genlex';
import parsec from './parsec/index';
import Parser from './parsec/parser';
import {F, C, N} from './parsec/index';
import standard from './standard/index';
import Streams from './stream/index';

import {accept, reject} from "./parsec/response";
import {Tuple, isTuple, NEUTRAL, tuple} from "./data/tuple";


const JSON = standard.jsonParser;
const MD = standard.markdownBundle;


export {
    data,
    accept,reject,
    GenLex,
    getMathGenLex,
    parsec,
    standard,
    Streams,
    Parser,
    F,
    C,
    N,
    JSON,
    MD,
    tuple, Tuple, isTuple, NEUTRAL
};
