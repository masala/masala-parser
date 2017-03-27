import {F,C,N} from '../parsec/index';


function _inQuote(){
    return C.char('"')
        .then(C.notChar('"').rep())
        .then(C.char('"'))
}

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



function date() {
    return N.digits
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits)
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits)
        .map(F.flattenDeep)
        .map(dateValues=>dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray=>dateArray.join(''));
}

function blank(charsOrParser) {

    if (charsOrParser){
        if (typeof  charsOrParser === 'string'){
            return C.charIn(charsOrParser).optrep().thenReturns('');
        }else{
            return charsOrParser.optrep().thenReturns('');
        }
    }
    return C.charIn(' \t').optrep().thenReturns('');
}



function eol() {
    return C.char('\n').or(C.string('\r\n'));
}



export default {
    email,
    date,
    blank,
    eol:eol()
}

