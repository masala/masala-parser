/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import jsonParser from './json/jsonparser';
import markdownDocument from './markdown/markdown-parser';
import markdownBundle from './markdown/markdown-bundle';
import extractorBundle from './extractor/extractor-bundle';
import tokenBundle from './token-bundle';

export default {
    jsonParser,
    markdownDocument,
    markdownBundle,
    extractorBundle,
    tokenBundle,
};
