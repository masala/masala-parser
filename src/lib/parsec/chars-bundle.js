/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
import F from './flow-bundle';
import Parser from './parser';
import response from './response';

const ASCII_LETTER = Symbol('ASCII');
const OCCIDENTAL_LETTER = Symbol('OCCIDENTAL');
const UTF8_LETTER = Symbol('UTF8');

function isUtf8Letter(char) {
    var firstLetter = char.toUpperCase();
    return firstLetter.toLowerCase() !== firstLetter;
}


function isExtendedOccidental(v) {
    return /(?![\u00F7\u00D7])[\u00C0-\u017F^\u00F7]/.test(v);
}

// unit -> Parser char char
function letter(symbol = null) {

    // For performance, we do not factorize mainstream letters in function
    if (symbol === null || symbol === OCCIDENTAL_LETTER) {
        return F.satisfy(c => ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || isExtendedOccidental(c));
    }

    if (symbol === ASCII_LETTER) {
        return F.satisfy(c => ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z'));
    }

    if (symbol === UTF8_LETTER) {
        return F.satisfy(c => ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || isUtf8Letter(c));
    }

    throw 'Parameter ' + symbol + ' has wrong type : Should be C.OCCIDENTAL_LETTER, C.ASCII_LETTER or C.UTF8_LETTER';
}


function utf8Letter() {
    return F.satisfy(v => isUtf8Letter(v));
}

function letters(symbolOrTestFunctionOrRegex) {
    return letter(symbolOrTestFunctionOrRegex).rep().map(values => values.join(''));
}

// char -> Parser char char
function char(c) {
    if (c.length !== 1) {
        throw new Error('Char parser must contains one character');
    }

    return F.satisfy(v => c === v);
}

// char -> Parser char char
function notChar(c) {
    if (c.length !== 1) {
        throw new Error('Char parser must contains one character');
    }

    return F.satisfy(v => c !== v);
}

// string -> Parser char char
function charIn(c) {
    return F.satisfy(v => c.indexOf(v) !== -1);
}

// string -> Parser char char
function charNotIn(c) {
    return F.satisfy(v => c.indexOf(v) === -1);
}

// int -> Parser string char
function subString(length) {
    return F.subStream(length).map(s => s.join(''));
}

// string -> Parser string char
// index is forwarded at the length of the string
function string(s) {
    return new Parser((input, index = 0) => {
        if (input.subStreamAt(s.split(''), index)) {
            return response.accept(s, input, index + s.length, true);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// string -> Parser string char
function notString(s) {
    return F.not(string(s));
}

// unit -> Parser string char
function stringLiteral() {
    var anyChar = string('\\"').or(notChar('"'));
    return char('"')
        .thenRight(anyChar.optrep())
        .thenLeft(char('"'))
        .map(r => r.join(''));
}

// unit -> Parser char char
function charLiteral() {
    var anyChar = string("\\'").or(notChar("'"));
    return char("'").thenRight(anyChar).thenLeft(char("'"));
}

// unit -> Parser char char
function lowerCase() {
    return F.satisfy(v => 'a' <= v && v <= 'z');
}

// unit -> Parser char char
function upperCase() {
    return F.satisfy(v => 'A' <= v && v <= 'Z');
}

export default {
    utf8Letter: utf8Letter(),
    letter: letter(),
    letterAs:letter,
    letters: letters(),
    lettersAs:letters,
    notChar: notChar,
    char: char,
    charIn: charIn,
    charNotIn: charNotIn,
    subString: subString,
    string: string,
    notString: notString,
    charLiteral: charLiteral(),
    stringLiteral: stringLiteral(),
    lowerCase: lowerCase(),
    upperCase: upperCase(),
    UTF8_LETTER,
    OCCIDENTAL_LETTER,
    ASCII_LETTER
};
