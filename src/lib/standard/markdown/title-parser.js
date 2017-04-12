/**
 * Created by Simon on 14/12/2016.
 */
 /*
 * This module try parse a title. The folowing will be recognised as titles:
 * "#foo\n"  "##foo\n"  "foo\n==="  "foo\n---"  "##########     foo     \n"
 *
 * Limits and axiomes
 * A \n in the markdown source ends the parsing of a title.  #foo\nbar  -> {title:foo},{text:bar}
 */
import {F,C} from '../../parsec/index';
import stream from '../../stream/index';
import T from './token';

function sharps(){
    return C.char('#').rep().map(string => string.array().length)
}

// a white is a sequence of at least one space, tab or non-breakable space
function white() {
    return C.charIn(" \t\u00A0").rep()
}

function equals(){
    return C.string('===')
        .then(T.rawTextUntil(T.eol()))
        .then(T.eol())
        .thenReturns(1);  // this mean a level 1 title
}

function minuses(){
    return C.string('---')
        .then(T.rawTextUntil(T.eol()))
        .then(T.eol())
        .thenReturns(2); // this mean a level 2 title
}

function titleSharp(){
    return sharps()
        .thenLeft(white())
        .then(T.rawTextUntil(T.eol()))
        .thenLeft(T.eol().or(F.eos))
        .map(array => ({
                        title:{
                            level:array[0],
                            text:array[1]
                        }
        }))
}

function titleLine(){
    return T.blank()
        .thenRight( T.rawTextUntilChar('\r\n')
        .thenLeft(T.eol())
        .then(equals().or(minuses()))
        .map(array => ({
            title:{
                level:array[1],
                text:array[0]
            }
        })))
}


function title(){
    return titleSharp().or(titleLine())
}

function parseTitle( line, offset=0){
    return title().parse(stream.ofString(line), offset)
}


export default {

    titleLine,
    titleSharp,
    title,
    parse(line){
        return parseTitle(line,0);
    }
}

/*  SHORTCOMINGS :
* Can not have formatted text in a title.  "##2*3*4 = 24\n" will display "2*3*4 = 24"
 */
