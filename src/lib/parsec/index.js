/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

import parser from "./parser.js";
import response from "./response.js";
import flow from "./flow-bundle.js";
import chars from "./chars-bundle.js";
import numbers from "./numbers-bundle.js";

export const C = chars;
export const F = flow;
export const N = numbers;

export default {parser, response};
