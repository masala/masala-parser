import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');

export default class LineParser {



    static titleValue(line, level) {
        return { title: line.text.trim(), level: level };
    }


    static italicValue(text) {
        return { italic: text };
    }

    static boldValue(text) {
        return { bold: text };
    }

    static strikeValue(text) {
        return { strike: text };
    }

    static textValue(chars) {
        return { text: chars.join('').trim() };
    }

    titleSharp() {
        return P.char('#').rep().then(this.notFormattedText())
            .map(c=> LineParser.titleValue(c[1], c[0].length));
    }

    italic() {
        return P.try(P.string("*").thenRight(P.lazy(this.text, ["*"])).thenLeft(P.string("*")).or(P.string("_")
            .thenRight(P.lazy(this.text, ["_"])).thenLeft(P.string("_"))).map(LineParser.italicValue.bind(this)));
    }

    bold() {
        return P.try(P.string("**").thenRight(P.lazy(this.text, ["**"])).thenLeft(P.string("**")).or(P.string("__")
            .thenRight(P.lazy(this.text, ["__"])).thenLeft(P.string("__"))).map(LineParser.boldValue.bind(this)));
    }

    strike() {
        return P.try(P.string("~~").thenRight(P.lazy(this.text, ["~~"])).thenLeft(P.string("~~")).map(LineParser.strikeValue.bind(this)));
    }

    notFormattedText() {
        return P.not(eol).then(P.charNotIn('\n').optrep()).map((c) => [c[0]].concat(c[1])).map(LineParser.textValue.bind(this));

    }


    text(separator) {
        if (separator) {
            return P.not(eol.or(P.string(separator))).optrep().map(LineParser.textValue.bind(this));
        } else {
            return P.not(eol).then(P.charNotIn('\n*_~').optrep()).map((c) => [c[0]].concat(c[1])).map(LineParser.textValue.bind(this));
        }
    }

    lineValue(line) {
        return { line };
    }

    line() {
        return (this.bold().or(this.italic()).or(this.strike()).or(this.text())).rep()
            .thenLeft(eol)
            .map(this.lineValue);
    }

    combinator(){
        return this.titleSharp().or(this.line());
    }

    parse(stream, offset = 0) {
        return this.combinator().parse(stream, offset);
    }

    /**
     * @string line
     */
    parseLine(line) {
        return this.parse(stream.ofString(line));
    }
}


function lineValue(line) {
    return { line };
}



function blankLine() {
    return P.charIn('\t ').rep()
        .map(val => ({ blankLine: val.join('') }))
        .thenLeft(eol);
}


/**
 *
 * !! this can be a block
 * These end of lines must have the last precedence
 * @returns {*|Array}
 */
function aloneEndOfLines() {
    return eol.map(() =>({ eol: 'eol' }))
        .rep().map(eols => ({ eol: eols.length }));
}

function indent() {
    return P.try(P.char(' ').occ(8).or(P.char('\t').occ(2)));
    return P.try(P.char(' ').occ(8).or(P.char('\t').occ(2)));
    //return P.char('\t').debug('some tab').then(P.char('\t'));
}

function indentedLine() {
    return P.try(indent().debug('found indent').then(strictLine()))
        .map(values=>({
            indent: values[1],
            spaces: values[0]
        }));
}