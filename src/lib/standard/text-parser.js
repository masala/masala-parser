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
        .debug('Italic ->')
}

function bold(){
    return P.string('**')
        .thenRight(pureText())
        .thenLeft(P.string('**'))
        .map(string => ({bold:string})  )
        .debug('bold ->')
}

function text(){
    return pureText()
        .map(string => ({text:string}) )
        .debug('text->')
}

function eol(){
    return T.eol().map((a=> ({eol:'\n'})))
}

function formattedText(){
    return T.blank()
        .thenRight(bold().or(italic()).or(text()).rep() )
        .then(eol())
        .flattenDeep()    
}

function parseText( line, offset=0){
    return formattedText().parse(stream.ofString(line), offset)
}


export default {
    formattedText,

    parse(line){
        return parseText(line,0);
    }
}