import P from '../parsec/parser';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    return P.charIn(' \t').optrep().thenReturns('');
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid = false) {
    if (allowVoid) {
        return P.charNotIn(charList).optrep()
            .map(characters => characters.join(''))
    }
    else {
        return P.charNotIn(charList).rep()
            .map(characters => characters.join(''))
    }
}

function eol() {
    return P.char('\n');
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).thenReturns({
        linefeed:undefined
    });
}

//accept 1 tab or 4 spaces. Space may be unbreakable
function fourSpacesBlock() {
    return P.char('\t').or(P.charIn(' \u00A0').occurrence(4));
}

function inQuote(){
    return P.char('"')
        .then(P.notChar('"').rep())
        .then(P.char('"'))
}

// accept simon@gmail.com, but also  simon"le gr@nd"@gmail.com
function email(){
    let illegalCharSet1=' @\u00A0\n\t'
    let illegalCharSet2=' @\u00A0\n\t.'

    return inQuote().debug("inQuote")
        .or(P.charNotIn(illegalCharSet1).debug("normalChar")).rep()  // this mean:   repeat(inQuote or anyCharacter)
        .then(P.char('@'))
        .then(P.charNotIn(illegalCharSet2).rep() )
        .then(P.char('.'))
        .then(P.charNotIn(illegalCharSet2).rep())
        .flattenDeep().map(characters => ({email:characters.join('') }) )
}


export default {
    blank,
    rawTextUntilChar,
    eol,
    lineFeed,
    fourSpacesBlock,
    email
}



