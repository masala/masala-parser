/**
 * Created by Simon on 24/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';




function stop(){
    return P.eos.or(P.charIn('\n*`'));
}

function pureText(){
    return P.not(stop()).rep()
        .map(a=>a.join(''))
}

/* what follows is very redondant with text_parser.js
I cannot reuse this module directly as the stop() and blank() condition are diferent
I feel that making something such as formatedSequence(stop, blank) would be less readable. This may change
 */
function italic(){
    return P.char('*')
        .thenRight(pureText())
        .thenLeft(P.char('*'))
        .map(string => ({italic:string})  )
}

function bold(){
    return P.string('**')
        .thenRight(pureText())
        .thenLeft(P.string('**'))
        .map(string => ({bold:string})  )
}

function code(){
    return P.string('`')
        .thenRight(pureText())
        .thenLeft(P.string('`'))
        .map(string => ({code:string})  )
}

function text(){
    return pureText()
        .map(string => ({text:string}) )
}

function formatedSequence() {
   return  bold().or(italic()).or(text()).or(code()).rep()
    .thenLeft(stop())
}


function bulletLv1(){
    return P.char('\n').optrep()
        .then(P.charIn('*-'))  //first character of a bullet is  * or -
        .then(P.charIn(' \u00A0'))  // second character of a bullet is space or non-breakable space
        .thenRight(formatedSequence())
        .map(a => ({bullet:{level:1, content: a }}  ))
}

function bulletLv2(){
    return P.char('\n').optrep()
        .then (P.char('\t'))
        .or(P.string('    '))
        .then(P.char(' ').optrep())  //carfull. This will accept 8 space. therefore the code must have higher priority
        // minor (?) bug: "  \t  *" will not be recognised
        .then(P.charIn('*-'))  //first character of a bullet is  * or -
        .then(P.charIn(' \u00A0'))  // second character of a bullet is space or non-breakable space
        .thenRight(formatedSequence())
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
