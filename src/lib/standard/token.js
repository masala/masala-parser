import P from '../parsec/parser';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank(){
    return P.charIn(" \t").optrep().map(blank=>'')
}

//todo: escape characters
function rawTextUntilChar(charList, allowVoid=false){
    if (allowVoid){
        return P.charNotIn(charList).optrep()
            .map(a =>a.join('') )
    }
    else{
        return P.charNotIn(charList).rep()
            .map(a =>a.join('') )
    }
}

function eol(){
    return P.char('\n');
}


export default {
    blank,
    rawTextUntilChar,
    eol
}

