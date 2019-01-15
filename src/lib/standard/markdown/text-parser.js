/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (F.eos())
 */
import {F, C} from '../../parsec/index';
import stream from '../../stream/index';
import T from './token';
import {GenLex} from "../../genlex/genlex";

function trimStartingLineFeed(str) {
    return str.replace(/^[\s]*/, '');
}

function trimEndingLineFeed(str) {
    return str.replace(/[\s]*$/, '');
}

// private for pureText & formattedParagraph()
function stop() {
    return F.eos().or(T.lineFeed()).or(C.charIn('*`'));
}

function pureText() {
    return (
        F.not(stop())
            .rep() //  ['a','\n','b'] -> 'a b'
            // But on Windows, we will ignore the \r
            // inside line break will be put as space, but we clear initial or final \n
            .map(chars => {
                let allChars = chars.join('');
                return allChars.replace(/\n/g, ' ').replace(/\r/g, '');
            })
    );
}

function basicText(stoppers) {

    return F.not(C.stringIn(stoppers))

}

function betweenDelimiter({delimiter, type}, endParser) {
    return C.string(delimiter).drop()
        .then(F.not(endParser.or(C.string(delimiter))).rep().join())
        .then(C.string(delimiter).drop())
        .single()
        .map(content => ({type, content}));
}

function rawText(delimiters, endParser) {
    const strings = delimiters.map(d => d.delimiter);
    return F.not(endParser.or(C.stringIn(strings)))
        .rep()
        .map(t => ({type: 'raw-text', content: t.join()}))
        .or(C.stringIn(strings).map(content => ({type: 'raw-text', content})))


}

/**
 * @param delimiters delimiter : {type: string, delimiter:string}  {type:'code', delimiter: '`'}
 * @returns {*}
 */
function betweenAnyDelimiters(delimiters, endParser) {

    return delimiters.reduce(function (combinator, next) {
        return F.try(betweenDelimiter(next, endParser)).or(combinator);
    }, F.error());

}


function formatter(delimiters, endParser) {

    return F.try(betweenAnyDelimiters(delimiters, endParser))
        .or(rawText(delimiters, endParser))
        .rep()
        //.then(endParser);


}

// tokens : betweenDelimiter('_'), text, stop
// priorité : between stopper, puis text ou stopper


// TODO: function textBetweenMarkers(marker, name)

function italic(pureTextParser) {
    return C.char('*')
        .thenRight(pureTextParser)
        .thenLeft(C.char('*'))
        .single()
        .map(string => ({italic: string}));
}

function bold(pureTextParser) {
    return C.string('**')
        .thenRight(pureTextParser)
        .thenLeft(C.string('**'))
        .single()
        .map(string => ({bold: string}));
}

function code(pureTextParser) {
    return C.char('`')
        .thenRight(pureTextParser)
        .thenLeft(C.char('`'))
        .single()
        .map(string => ({code: string}));
}

function text(pureTextParser) {
    return pureTextParser.map(string => ({text: string}));
}

/**
 * @param pureTextParser : defines if a text accept some chars or not
 * @param stopParser : defines if text stops at the end of line
 * @returns Parser
 */
function formattedSequence(pureTextParser, stopParser) {
    return bold(pureTextParser)
        .or(italic(pureTextParser))
        .or(text(pureTextParser))
        .or(code(pureTextParser))
        .rep()
        .thenLeft(stopParser)
        .array();
}

function formattedParagraph() {
    return T.blank()
        .thenRight(formattedSequence(pureText(), stop()))
        .single()
        .map(array => {

            // We trim the first and last element of the paragraph
            if (
                array.length > 0 &&
                typeof array[0] === 'object' &&
                array[0].text
            ) {
                array[0].text = trimStartingLineFeed(array[0].text);
                const last = array.length - 1;
                array[last].text = trimEndingLineFeed(array[last].text);
            }

            return {paragraph: array};
        });
}

function parseText(line, offset = 0) {
    return formattedParagraph().parse(stream.ofString(line), offset);
}

// For unit test
export const TextParserPrivate = {
    betweenDelimiter,
    betweenAnyDelimiters,
};

/**
 * Class wrapper for one time definition
 */
export class TextBundle{

    constructor(delimiters, endParser = C.char('\n').returns({type: 'eol'})){
        if (!Array.isArray(delimiters)){
            throw `delimiters should be an array like 
                 const delimiters = [
                {type: 'italic', delimiter: '__'},
                {type: 'bold', delimiter: '**'}
            ];
            `
        }
        this.delimiters=delimiters;
        this.endParser = endParser;
    }

    formatter() {

        return formatter(this.delimiters, this.endParser);


    }
    rawText(){
        return rawText(this.delimiters, this.endParser);
    }
}


export default {
    formatter,
    pureText,
    italic,
    bold,
    code,
    text,
    formattedSequence,
    formattedParagraph,
    parse(line) {
        return parseText(line, 0);
    },
};
