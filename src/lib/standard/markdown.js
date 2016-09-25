/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import P from '../parsec/parser';

//
// Facilities
//

const blocSeparation = P.char('\n').then(P.char('\n'));
var eol = P.char('\n');//.then(P.charNotIn('\n'));

function title(line, level) {
    return {title: line, level: level};
}

function italicText(text) {
    return {italic: text};
}

function boldText(text) {
    return {bold: text};
}

function strikeText(text) {
    return {strike: text};
}

function normalText(c) {
    console.log('==> FOUND a normal text: ', c);
    return {text: c.join('')};
}


function paragraphText(text) {
    console.log('==> FOUND a paragraph : ', text[0][1]);
    return {paragraph: text[0][1]};
}


function italic() {
    return P.try(P.string("*").thenRight(P.lazy(text, ["*"])).thenLeft(P.string("*")).
                 or(P.string("_").thenRight(P.lazy(text, ["_"])).thenLeft(P.string("_"))).map(italicText));
}

function bold() {
    return P.try(P.string("**").thenRight(P.lazy(text, ["**"])).thenLeft(P.string("**")).
                 or(P.string("__").thenRight(P.lazy(text, ["__"])).thenLeft(P.string("__"))).map(boldText));
}

function strike() {
    return P.try(P.string("~~").thenRight(P.lazy(text, ["~~"])).thenLeft(P.string("~~")).map(strikeText));
}

function text(separator) {
    if (separator) {
        console.log('==> text with separator :', separator);
        return P.not(eol.or(P.string(separator))).optrep().map(normalText);
    } else {
        console.log('==> text without separator :', separator);
        return P.not(eol).then(P.charNotIn('\n*_~').optrep()).
                map((c) => [c[0]].concat(c[1])).
                map(normalText);
    }
}


function paragraph() {
    console.log('in paragraph');
    return eol.then(text()).then(eol.optrep()).map(paragraphText);
}

function line() {
    return (bold().or(italic()).or(strike()).or(text())).optrep().thenLeft(eol.opt());
}


function titleSharp() {
    return P.char('#').rep().then(line()).map(function (c) {
        return [title(c[1], c[0].length)];
    });
}


function titleAlt() {
    return P.try(
        line().flatmap((l) =>
            P.char('=').rep().map(() => [title(l, 1)]).
            or(P.char('-').rep().map(() => [title(l, 2)])).
            thenLeft(eol.opt()))
    );
}

export default paragraph().or(titleSharp()).or(titleAlt()).or(line()).thenLeft(P.eos);
 