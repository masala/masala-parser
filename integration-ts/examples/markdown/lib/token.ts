import {F, C, IParser} from '@masala/parser';

// resolve meanningles characters as an empty string
// also accept an empty string
function blank() {
    // TODO: why not return C.charIn(' \t').rep().returns(' ');
    return C.charIn(' \t').optrep().returns('');
}


function eol() {
    return C.char('\n').or(C.string('\r\n'));
}

//A blank line in the code(that is 2 consecutive \n) is a single end of line (lineFeed) in the rendition
function lineFeed() {
    return eol().then(blank()).then(eol()).returns({
        linefeed: undefined,
    });
}



export default {
    blank,
    eol,
    lineFeed
};
