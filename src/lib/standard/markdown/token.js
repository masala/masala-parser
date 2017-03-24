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

function inQuote(){
    return C.char('"')
        .then(C.notChar('"').rep())
        .then(C.char('"'))
}


// TODO move to a ExtractorBundle or EmailBundle
// accept simon@gmail.com, but also  simon"le gr@nd"@gmail.com
function email(){
    let illegalCharSet1=' @\u00A0\n\t'
    let illegalCharSet2=' @\u00A0\n\t.'

    return inQuote()
        .or(C.charNotIn(illegalCharSet1)).rep()  // this mean:   repeat(inQuote or anyCharacter)
        .then(C.char('@'))
        .then(C.charNotIn(illegalCharSet2).rep() )
        .then(C.char('.'))
        .then(C.charNotIn(illegalCharSet2).rep())
        .flattenDeep().map(characters => ({email:characters.join('') }) )
}

function dateDigits() {
    return N.digit.rep().map(v=>v.join(''));
}

function date() {
    return dateDigits()
        .then(C.charIn('-/').thenReturns('-'))
        .then(dateDigits())
        .then(C.charIn('-/').thenReturns('-'))
        .then(dateDigits())
        .map(F.flattenDeep)
        // TODO: test with 4 chars ?
        .map(dateValues=>dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray=>dateArray.join(''));
}



export default {
    blank,
    rawTextUntilChar,
    rawTextUntil,
    eol,
    lineFeed,
    fourSpacesBlock,
    email,
    date
}



