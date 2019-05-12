/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (F.eos())
 *
 * Another solution is to use Genlex with stops on spaces and \n, then to reduce the text tokens
 * in bigger text.
 */
import {F, C, SingleParser, IParser} from '@masala/parser'

import {FormattedSequence, MdText, Paragraph} from "./types";
import {blank, lineFeed} from "./token";


function stop() {
    return F.eos().or(lineFeed()).or(C.charIn('*`'));
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
            .map(text => text.trim())
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



export function formattedLine(pureTextParser:SingleParser<string>, stopParser:IParser<any>):SingleParser<MdText[]>{
    return bold(pureTextParser)
        .or(italic(pureTextParser))
        .or(text(pureTextParser))
        .or(code(pureTextParser))
        .rep().array();
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
        .then(stopParser.drop()) // could reuse formattedLine
        .array();
}

// So last eaten character could be a '\n'
export function paragraph():SingleParser<Paragraph> {
    return formattedSequence(pureText(), stop())
        .map( (array :MdText[]) => {

           const content = array.filter(mdText => mdText.text.length>0);

            return {type: 'paragraph', content};
        });
}

