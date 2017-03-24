/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (F.eos())
 */
import {F,C} from '../../parsec/index';
import stream from '../../stream/index';
import T from './token';

function trimStartingLineFeed(str){
    return str.replace(/^[\s]*/,'');
}

function trimEndingLineFeed(str){
    return str.replace(/[\s]*$/,'');
}

function stop(){
    return F.eos.or(T.lineFeed()).or(C.charIn('*`'));
}

function pureText(){
    return F.not(stop()).rep()
        //  ['a','\n','b'] -> 'a b'
        // But on Windows, we will ignore the \r
        // inside line break will be put as space, but we clear initial or final \n
        .map(characters=>{
            let allChars = characters.join('');
            return allChars.replace(/\n/g, " ").replace(/\r/g, "");
        });
}

function italic(pureTextParser){
    return C.char('*')
        .thenRight(pureTextParser)
        .thenLeft(C.char('*'))
        .map(string => ({italic:string})  )
}

function bold(pureTextParser){
    return C.string('**')
        .thenRight(pureTextParser)
        .thenLeft(C.string('**'))
        .map(string => ({bold:string})  )
}

function code(pureTextParser){
    return C.char('`')
        .thenRight(pureTextParser)
        .thenLeft(C.char('`'))
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
        .map(array =>{
            // We trim the first and last element of the paragraph
            if (array.length>0 && typeof array[0]==='object'&& array[0].text){
                array[0].text = trimStartingLineFeed(array[0].text);
                const last = array.length-1;
                array[last].text = trimEndingLineFeed(array[last].text);
            }

            return {paragraph:array};
        })
}

function parseText( line, offset=0){
    return formattedParagraph().parse(stream.ofString(line), offset)
}


export default {
    stop,
    pureText,
    italic,
    bold,
    code,
    text,
    formattedSequence,
    formattedParagraph,
    parse(line){
        return parseText(line,0);
    }
}