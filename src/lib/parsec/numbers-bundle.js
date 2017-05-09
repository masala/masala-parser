/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import C from './chars-bundle';
import F from './flow-bundle';

// unit -> Parser number char
function numberLiteral() {
    // [-+]?\d+([.]\d+)?([eE][+-]?\d+)?
    var join = r => r.join(''),
        joinOrEmpty = r => r.map(join).orElse(''),
        digits = digit().rep().map(join),
        integer = C.charIn('+-')
            .opt()
            .then(digits)
            .map(r => r[0].orElse('') + r[1]),
        float = integer
            .then(C.char('.').then(digits).opt().map(joinOrEmpty))
            .then(C.charIn('eE').then(integer).opt().map(joinOrEmpty))
            .map(r => r[0] + r[1] + r[2]);

    return float.map(r => parseFloat(r, 10));
}

// unit -> Parser char char
function digit() {
    return F.satisfy(v => '0' <= v && v <= '9');
}

function digits() {
    return digit().rep().map(v => v.join(''));
}

function integer() {
    // [-+]?\d+([.]\d+)?([eE][+-]?\d+)?
    var join = r => r.join(''),
        digits = digit().rep().map(join),
        integer = C.charIn('+-')
            .opt()
            .then(digits)
            .map(r => r[0].orElse('') + r[1]);

    return integer.map(i => parseInt(i, 10));
}

export default {
    numberLiteral: numberLiteral(),
    digit: digit(),
    digits: digits(),
    integer: integer(),
};
