/**
 * Created by Simon on 24/12/2016.
 */

import {F, C} from '../../parsec/index';
import stream from '../../stream/index';
import textParser from './text-parser';
import T from './token';

function stop() {
    return F.eos().or(C.charIn('\r\n*`'));
}

function pureText() {
    return F.not(stop()).rep().map(chars => chars.join(''));
}

function formattedSequence() {
    return textParser.formattedSequence(pureText(), stop());
}

function bulletLv1() {
    return C.char('\n')
        .optrep()
        .then(C.charIn('*-')) //first character of a bullet is  * or -
        .then(C.charIn(' \u00A0')) // second character of a bullet is space or non-breakable space
        .thenRight(formattedSequence())
        .map(someText => ({bullet: {level: 1, content: someText.array()}}));
}

function bulletLv2() {
    return C.char('\n')
        .optrep()
        .then(T.fourSpacesBlock())
        .then(C.char(' ').optrep()) //careful. This will accept 8 space. therefore the code-parser must have higher priority
        .then(C.charIn('*-')) //first character of a bullet is  * or -
        .then(C.charIn(' \u00A0')) // second character of a bullet is space or non-breakable space
        .thenRight(formattedSequence())
        .map(someText => ({bullet: {level: 2, content: someText.array()}}));
}

function bullet() {
    return F.try(bulletLv2()).or(bulletLv1());
}

function parseBullet(line, offset = 0) {
    return bullet().parse(stream.ofString(line), offset);
}

export default {
    bulletLv1,
    bulletLv2,
    bullet,

    parse(line) {
        return parseBullet(line, 0);
    },
};
