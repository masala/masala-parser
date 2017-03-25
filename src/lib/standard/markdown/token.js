import {F,C} from '../../parsec/index';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    return C.charIn(' \t').optrep().thenReturns('');
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid = false) {
    if (allowVoid) {
        return C.charNotIn(charList).optrep()
            .map(characters => characters.join(''))
    }
    else {
        return C.charNotIn(charList).rep()
            .map(characters => characters.join(''))
    }
}

function rawTextUntil(stop) {

        return F.not(stop).rep()
            .map(characters => characters.join(''))

}




function eol() {
    return C.char('\n').or(C.string('\r\n'));
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).thenReturns({
        linefeed:undefined
    });
}

//accept 1 tab or 4 spaces. Space may be unbreakable
function fourSpacesBlock() {
    return C.char('\t').or(C.charIn(' \u00A0').occurrence(4));
}






export default {
    blank,
    rawTextUntilChar,
    rawTextUntil,
    eol,
    lineFeed,
    fourSpacesBlock
}



