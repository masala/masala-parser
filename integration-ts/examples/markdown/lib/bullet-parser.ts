/**
 * Created by Simon on 24/12/2016.
 */

import {F, C} from '@masala/parser'
import {formattedSequence as seq}  from "./text-parser";

import {blank, spacesBlock} from './token';

function stop() {
    return F.eos().or(C.charIn('\r\n*`'));
}

function pureText() {
    return F.not(stop()).rep().map(chars => chars.join(''));
}

function formattedSequence() {
    return seq(pureText(), stop());
}

function bulletLv1() {
    return C.charIn('*-') //first character of a bullet is  * or -
        .then(blank()) // second character of a bullet is space or non-breakable space
        .then(formattedSequence())
        .last()
        .map(someText => ({type:'bullet', level: 1, content: someText}));
}

function bulletLv2() {
    return spacesBlock(2)
        .then (blank().opt())
        .then(C.charIn('*-')) //first character of a bullet is  * or -
        .then(blank()) // second character of a bullet is space or non-breakable space
        .then(formattedSequence())
        .last()
        .map(someText => ({type:'bullet',level: 2, content: someText}));
}


export function bullet() {
    return F.try(bulletLv2()).or(bulletLv1());
}
