import {F, C} from '../../parsec/index';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    // TODO: why not return C.charIn(' \t').rep().returns(' ');
    return C.charIn(' \t').optrep().returns('');
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid = false) {
    if (allowVoid) {
        return C.charNotIn(charList).optrep().map(chars => chars.join(''));
    } else {
        return C.charNotIn(charList).rep().map(chars => chars.join(''));
    }
}

function rawTextUntil(stop) {
    return F.not(stop).rep().map(chars => chars.join(''));
}

function eol() {
    return C.char('\n').or(C.string('\r\n'));
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).returns({
        linefeed: symbol('linefeed'),
    });
}

//accept 1 tab or 4 spaces. Space may be unbreakable
function fourSpacesBlock() {
    return tab().or(space().occurrence(4))
        .returns({type:'space-block', level:4})
}


function twoSpacesBlock(){
    return tab().or(space().occurrence(2))
        .returns({type:'space-block', level:2})
}



function space(){
    return C.charIn(' \u00A0');
}

function tab(){
    return C.char('\t');
}


export default {
    blank,
    rawTextUntilChar,
    rawTextUntil,
    eol,
    lineFeed,
    fourSpacesBlock,
    twoSpacesBlock,
    space,
    tab
};
