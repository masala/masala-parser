import stream from '../../lib/stream/index';
import P from '../parsec/parser';
const eol = P.char('\n');

// TODO : Maybe rename this with LineFunctions
export default class LineParser {
    


    titleValue(line, level) {
        return { title: line.text.trim(), level: level };
    }


    italicValue(text) {
        return { italic: text };
    }

    boldValue(text) {
        return { bold: text };
    }

    strikeValue(text) {
        return { strike: text };
    }

    textValue(chars) {
        return { text: chars.join('').trim() };
    }

    titleSharp() {
        return P.char('#').rep().then(this.notFormattedText())
            .map(c=> this.titleValue(c[1], c[0].length));
    }

    italic() {
        return P.try(P.string("*").thenRight(P.lazy(this.text.bind(this), ["*"])).thenLeft(P.string("*")).or(P.string("_")
            .thenRight(P.lazy(this.text.bind(this), ["_"])).thenLeft(P.string("_"))).map(this.italicValue.bind(this)));
    }

    bold() {
        return P.try(P.string("**").thenRight(P.lazy(this.text.bind(this), ["**"])).thenLeft(P.string("**")).or(P.string("__")
            .thenRight(P.lazy(this.text.bind(this), ["__"])).thenLeft(P.string("__"))).map(this.boldValue.bind(this)));
    }

    strike() {
        return P.try(P.string("~~").thenRight(P.lazy(this.text.bind(this), ["~~"])).thenLeft(P.string("~~")).map(this.strikeValue.bind(this)));
    }

    notFormattedText() {
        return P.not(eol).then(P.charNotIn('\n').optrep()).map((c) => [c[0]].concat(c[1])).map(this.textValue.bind(this));

    }

    white() {
        return P.charIn(' \t').rep().map(repetition => ' ');
    }

    text(separator) {
        if (separator) {
            return P.not(eol.or(P.string(separator))).optrep().map(this.textValue.bind(this));
        } else {
            return P.not(eol).then((this.white().or(P.charNotIn('\n*_~')).optrep()))
                .map((c) => [c[0]].concat(c[1])).map(this.textValue.bind(this));
        }
    }

    lineValue(line) {
        return { line };
    }

    line() {
        return (this.bold().or(this.italic()).or(this.strike()).or(this.text())).rep()
            .thenLeft(eol)
            .map(this.lineValue.bind(this));
    }

    blankLine() {
        return P.try(P.charIn('\t ').rep().thenLeft(eol))
            .map(val => ({ blankLine: val.join('') }));
    }


    /**
     * !! this can be a block
     * These end of lines must have the last precedence
     * @returns {*|Array}
     */
    aloneEndOfLines() {
        return eol.rep().map(eols => ({ eol: eols.length }));
    }

    indent() {
        return P.try(P.char(' ').occurrence(8).or(P.char('\t').occurrence(2)));
    }

    indentedLine() {
        return P.try(this.indent().then(this.line()))
            .map(values=>({
                indent: values[1],
                spaces: values[0].join('')
            }));
    }

    bullet() {
        //TODO : test without try
        return P.try(P.char('*').then(P.char(' ').rep()).then(this.line()))
    }


    // TODO: Maybe change line with textualLine
    combinator() {
        return this.titleSharp().or(this.indentedLine()).or(this.blankLine()).or(this.line()).or(this.aloneEndOfLines());
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