/**
 * Created by Simon on 24/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import textParser from './text-parser';
import T from '../../lib/standard/token';




function stop(){
    return P.eos.or(P.charIn('\n*`'));
}

function pureText(){
    return P.not(stop()).rep()
        .map(a=>a.join(''))
}

function formattedSequence(){
    return textParser.formattedSequence(pureText(), stop());
}

function bulletLv1(){
    return P.char('\n').optrep()
        .then(P.charIn('*-'))  //first character of a bullet is  * or -
        .then(P.charIn(' \u00A0'))  // second character of a bullet is space or non-breakable space
        .thenRight(formattedSequence())
        .map(a => ({bullet:{level:1, content: a }}  ))
}

function bulletLv2(){
    return P.char('\n').optrep()
        .then (P.char('\t'))
        .or(P.string('    '))
        .then(P.char(' ').optrep())  //carfull. This will accept 8 space. therefore the code must have higher priority
        .then(P.charIn('*-'))  //first character of a bullet is  * or -
        .then(P.charIn(' \u00A0'))  // second character of a bullet is space or non-breakable space
        .thenRight(formattedSequence())
        .map(a => ({bullet:{level:2, content: a }}  ))
}

function bullet(){
    return P.try(bulletLv2())
        .or(bulletLv1())
}

function parseBullet( line, offset=0){
    return bullet().parse(stream.ofString(line), offset)
}

export default {
    bullet,

    parse(line){
        return parseBullet(line,0);
    }
}
