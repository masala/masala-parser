import {F, C, IParser} from '@masala/parser';

// resolve meanningles characters as an empty string
// also accept an empty string

export function white(){
    return C.charIn('\u00A0 \t');
}
export function blank() {
    return C.charIn('\u00A0 \t').rep().returns(' ');
}


export function eol() {
    return C.char('\n').or(C.string('\r\n'));
}

//A blank line in the code(that is at least 2 consecutive \n) is a single end of line (lineFeed) in the rendition
export function lineFeed() {
    return eol().then(blank().opt()).then(eol()).returns({
        type: 'linefeed'
    });
}

//accept 1 tab or x spaces. Space may be unbreakable
export function spacesBlock(spaces: number) {
    return C.char('\t').or(white().occurrence(spaces));
}


