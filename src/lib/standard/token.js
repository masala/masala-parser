import C from '../../lib/parsec/chars-bundle';


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

function eol() {
    return C.char('\n');
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

function inQuote(){
    return C.char('"')
        .then(C.notChar('"').rep())
        .then(C.char('"'))
}

// accept simon@gmail.com, but also  simon"le gr@nd"@gmail.com
function email(){
    let illegalCharSet1=' @\u00A0\n\t'
    let illegalCharSet2=' @\u00A0\n\t.'

    return inQuote().debug("inQuote")
        .or(C.charNotIn(illegalCharSet1).debug("normalChar")).rep()  // this mean:   repeat(inQuote or anyCharacter)
        .then(C.char('@'))
        .then(C.charNotIn(illegalCharSet2).rep() )
        .then(C.char('.'))
        .then(C.charNotIn(illegalCharSet2).rep())
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



