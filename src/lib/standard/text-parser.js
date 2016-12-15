/**
 * Created by Simon on 14/12/2016.
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';

 
function pureText(){
    return T.rawTextUntilChar('*\n')
}

function italic(){
    return P.char('*')
        .thenRight(pureText())
        .thenLeft(P.char('*'))
        .map(string => ({italic:string})  )
}

function bold(){
    return P.string('**')
        .thenRight(pureText())
        .thenLeft(P.string('**'))
        .map(string => ({bold:string})  )
}

function text(){
    return pureText()
        .map(string => ({text:string}) )
}

function eol(){
    return T.eol().map((a=> ({eol:'\n'})))
}

function formattedParagraph(){
    return T.blank()
        .thenRight(bold().or(italic()).or(text()).rep() )
        .thenLeft(eol())
        .map(array =>({paragraph:array}))
}

function parseText( line, offset=0){
    return formattedParagraph().parse(stream.ofString(line), offset)
}


export default {
    formattedParagraph,

    parse(line){
        return parseText(line,0);
    }
}