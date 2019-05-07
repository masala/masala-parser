/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (F.eos())
 */
import {F, C, SingleParser, IParser} from '@masala/parser'
import T from './token';
import {FormattedSequence, MdText} from "./types";

function trimStartingLineFeed(str:string):string {
    return str.replace(/^[\s]*/, '');
}

function trimEndingLineFeed(str:string):string {
    return str.replace(/[\s]*$/, '');
}

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

function italic(pureTextParser:SingleParser<string>):SingleParser<MdText> {
    return C.char('*').drop()
        .then(pureTextParser)
        .then(C.char('*').drop())
        .single()
        .map((s:string) => ({type:'italic', text: s}));
}

function bold(pureTextParser:SingleParser<string>):SingleParser<MdText> {
    return C.string('**').drop()
        .then(pureTextParser)
        .then(C.string('**').drop())
        .single()
        .map((s:string) => ({type:'bold', text: s}));
}

function code(pureTextParser:SingleParser<string>) :SingleParser<MdText>{
    return C.char('`').drop()
        .then(pureTextParser)
        .then(C.char('`').drop())
        .single()
        .map((s:string) => ({type:'code', text: s}));
}

function text(pureTextParser:SingleParser<string>):SingleParser<MdText> {
    return pureTextParser.map(s => ({type:'text', text: s}));
}



/**
 * @param pureTextParser :SingleParser<string>  defines if a text accept some chars or not
 * @param stopParser :IParser<any> defines if text stops at the end of line
 * @returns Parser
 */
export function formattedSequence(pureTextParser:SingleParser<string>, stopParser:IParser<any>):SingleParser<FormattedSequence> {
    return bold(pureTextParser)
        .or(italic(pureTextParser))
        .or(text(pureTextParser))
        .or(code(pureTextParser))
        .rep()
        .then(stopParser.drop())
        .array();
}

export function paragraph() {
    return T.blank().drop()
        .then(formattedSequence(pureText(), stop()))
        .single()
        .map( (array :MdText[]) => {

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

            return {type: 'paragraph', content: (array as FormattedSequence)};
        });
}

