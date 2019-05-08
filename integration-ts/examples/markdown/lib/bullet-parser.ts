/**
 * Created by Simon on 24/12/2016.
 */

import {F, C, GenLex} from '@masala/parser'
import {formattedSequence as seq} from "./text-parser";

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
        .map(someText => ({type: 'bullet', level: 1, content: someText, children:[]}));
}

function bulletLv2() {
    return spacesBlock(2)
        .then(blank().opt())
        .then(C.charIn('*-')) //first character of a bullet is  * or -
        .then(blank()) // second character of a bullet is space or non-breakable space
        .then(formattedSequence())
        .last()
        .map(someText => ({type: 'bullet', level: 2, content: someText}));
}


export function bulletBlock() {

    let genlex = new GenLex();
    genlex.setSeparators('\n');
    const level1 = genlex.tokenize(bulletLv1(), 'bulletLevel1');
    const level2 = genlex.tokenize(bulletLv2(), 'bulletLevel2');

    const grammar = level1.flatMap(
        lvl1 => level2.optrep().map(children => ({...lvl1, children:children.array()}))
    ).rep();

    return genlex.use(grammar);

}

export function bullet() {
    return F.try(bulletLv2()).or(bulletLv1());
}
