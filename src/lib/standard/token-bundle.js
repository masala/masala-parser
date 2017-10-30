import {C, N} from '../parsec/index';

function _inQuote() {
    return C.char('"')
        .then(C.notChar('"').rep().map(item => item.array()))
        .then(C.char('"'));
}

// accept simon@gmail.com, but also  simon"le gr@nd"@gmail.com
function email() {
    let illegalCharSet1 = ' @\u00A0\n\t';
    let illegalCharSet2 = ' @\u00A0\n\t.';

    return _inQuote()
        .or(C.charNotIn(illegalCharSet1))
        .rep()
        .map(item => item.array()) // this mean:   repeat(inQuote or anyCharacter)
        .then(C.char('@'))
        .then(C.charNotIn(illegalCharSet2).rep().map(item => item.array()))
        .then(C.char('.'))
        .then(C.charNotIn(illegalCharSet2).rep().map(item => item.array()))
        .map(characters => ({email: characters.join('')}));
}

function date() {
    return N.digits
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits)
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits)
        .map(
            dateValues =>
                dateValues[4] > 2000 ? dateValues.reverse() : dateValues
        )
        .map(dateArray => dateArray.join(''));
}

function blank(charsOrParser = ' \t') {
    if (typeof charsOrParser === 'string') {
        return C.charIn(charsOrParser).optrep().thenReturns('');
    } else {
        return charsOrParser.optrep().thenReturns('');
    }
}

function eol() {
    return C.char('\n').or(C.string('\r\n'));
}

export default {
    email,
    date,
    blank,
    eol: eol(),
};
