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
    return eol().then(blank()).then(eol()).map(whatever => {
        linefeed:undefined
    });
}

//accept 1 tab or 4 spaces. Space may be unbreakable
function fourSpacesBlock() {
    return P.char('\t').or(P.try(P.charIn(' \u00A0').then(P.charIn(' \u00A0'))
        .then(P.charIn(' \u00A0')).then(P.charIn(' \u00A0'))));
}


// todo: in theory,  simon"le grand@Viarmes"@gmail.com is valid
function email(){
    let illegalCharSet1=' @\u00A0\n\t'
    let illegalCharSet2=' @\u00A0\n\t.'

    return P.charNotIn(illegalCharSet2).debug("mark1")      // email address shall not begin with dot
        .then(P.charNotIn(illegalCharSet1).optrep().debug("mark2") )
        .then(P.char('@').debug("mark3"))
        .then(P.charNotIn(illegalCharSet2).rep().debug("mark4") )
        .then(P.char('.').debug("mark5"))
        .then(P.charNotIn(illegalCharSet2).rep().debug("mark6") )
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



