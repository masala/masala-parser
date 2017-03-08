/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */


import {F,C} from '../../lib/parsec/index';
//
// Facilities
//

var eol = C.char('\n');//.then(C.charNotIn('\n'));

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
    return {text: c.join('')};
}


function paragraphText(text) {
    return {paragraph: text[0][1]};
}


function italic() {
    return F.try(C.string("*").thenRight(F.lazy(text, ["*"])).thenLeft(C.string("*")).
                 or(C.string("_").thenRight(F.lazy(text, ["_"])).thenLeft(C.string("_"))).map(italicText));
}

function bold() {
    return F.try(C.string("**").thenRight(F.lazy(text, ["**"])).thenLeft(C.string("**")).
                 or(C.string("__").thenRight(F.lazy(text, ["__"])).thenLeft(C.string("__"))).map(boldText));
}

function strike() {
    return F.try(C.string("~~").thenRight(F.lazy(text, ["~~"])).thenLeft(C.string("~~")).map(strikeText));
}

function text(separator) {
    if (separator) {
        return F.not(eol.or(C.string(separator))).optrep().map(normalText);
    } else {
        return F.not(eol).then(C.charNotIn('\n*_~').optrep()).
                map((c) => [c[0]].concat(c[1])).
                map(normalText);
    }
}


function paragraph() {
    return eol.then(text()).then(eol.optrep()).map(paragraphText);
}

function line() {
    return (bold().or(italic()).or(strike()).or(text())).optrep().thenLeft(eol.opt());
}


function titleSharp() {
    return C.char('#').rep().then(line()).map(function (c) {
        return [title(c[1], c[0].length)];
    });
}


function titleAlt() {
    return F.try(
        line().flatmap((l) =>
            C.char('=').rep().map(() => [title(l, 1)]).
            or(C.char('-').rep().map(() => [title(l, 2)])).
            thenLeft(eol.opt()))
    );
}

export default paragraph().or(titleSharp()).or(titleAlt()).or(line()).thenLeft(F.eos);
 