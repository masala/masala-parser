import {F,C,N} from '../parsec/index';


function _inQuote(){
    return C.char('"')
        .then(C.notChar('"').rep())
        .then(C.char('"'))
}

// TODO move to a ExtractorBundle or EmailBundle
// accept simon@gmail.com, but also  simon"le gr@nd"@gmail.com
function email(){



    let illegalCharSet1=' @\u00A0\n\t'
    let illegalCharSet2=' @\u00A0\n\t.'

    return _inQuote()
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
    email,
    date
}

