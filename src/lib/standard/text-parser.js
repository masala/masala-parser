/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (P.eos())
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from './token';

function stop(){
    return P.eos.or(T.lineFeed()).or(P.charIn('*`'));
}

function pureText(){
    return P.not(stop()).rep()
        .map(characters=>characters.join('').replace(/\n/g, " "));//  ['a','\n','b'] -> 'a b'
}

function italic(pureTextParser){
    return P.char('*')
        .thenRight(pureTextParser)
        .thenLeft(P.char('*'))
        .map(string => ({italic:string})  )
}

function bold(pureTextParser){
    return P.string('**')
        .thenRight(pureTextParser)
        .thenLeft(P.string('**'))
        .map(string => ({bold:string})  )
}

function code(pureTextParser){
    return P.char('`')
        .thenRight(pureTextParser)
        .thenLeft(P.char('`'))
        .map(string => ({code:string})  )
}

function text(pureTextParser){
    return pureTextParser
        .map(string => ({text:string}) )
}

/**
 * @param pureTextParser : defines if a text accept some chars or not
 * @param stopParser : defines if text stops at the end of line
 * @returns Parser
 */
function formattedSequence(pureTextParser, stopParser) {
    return  bold(pureTextParser).or(italic(pureTextParser))
        .or(text(pureTextParser)).or(code(pureTextParser)).rep()
        .thenLeft(stopParser);
}


function formattedParagraph(){
    return T.blank()
        .thenRight(formattedSequence(pureText(), stop()))
        .map(array =>({paragraph:array}))
}

function parseText( line, offset=0){
    return formattedParagraph().parse(stream.ofString(line), offset)
}


export default {
    formattedSequence,
    formattedParagraph,
    parse(line){
        return parseText(line,0);
    }
}