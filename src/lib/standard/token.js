import P from '../parsec/parser';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    return P.charIn(" \t").optrep().map(blank => '')
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid = false) {
    if (allowVoid) {
        return P.charNotIn(charList).optrep()
            .map(a => a.join(''))
    }
    else {
        return P.charNotIn(charList).rep()
            .map(a => a.join(''))
    }
}

function eol() {
    return P.char('\n');
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).map(whatever => {
        linefeed:undefined
    });
}

function fourSpacesBlock() {
    return P.char('\t').or(P.try(P.charIn(' \u00A0').then(P.charIn(' \u00A0'))
        .then(P.charIn(' \u00A0')).then(P.charIn(' \u00A0'))));
}


export default {
    blank,
    rawTextUntilChar,
    eol,
    lineFeed,
    fourSpacesBlock
}



