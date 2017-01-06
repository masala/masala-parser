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
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from './token';

function sharps(){
    return P.char('#').rep().map(string => string.length)
}

// a white is a sequence of at least one space, tab or non-breakable space
function white() {
    return P.charIn(" \t\u00A0").rep()
}

function equals(){
    return P.string('===')
        .then(T.rawTextUntilChar('\n'))
        .then(T.eol())
        .map(whatever=>1);  // this mean a level 1 title
}

function minuses(){
    return P.string('---')
        .then(T.rawTextUntilChar('\n'))
        .then(T.eol())
        .map(whatever=>2); // this mean a level 2 title
}

function titleStyle1(){
    return sharps()
        .thenLeft(white())
        .then(T.rawTextUntilChar('\n'))
        .thenLeft(T.eol().or(P.eos))
        .map(array => ({
                        title:{
                            level:array[0],
                            text:array[1]
                        }
        }))
}

function titleAlt(){
    return T.blank()
        .thenRight( T.rawTextUntilChar('\n')
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
    return titleStyle1().or(titleAlt())
}

function parseTitle( line, offset=0){
    return title().parse(stream.ofString(line), offset)
}


export default {
    title,

    parse(line){
        return parseTitle(line,0);
    }
}

/*  SHORTCOMINGS :
* Can not have formatted text in a title.  "##2*3*4 = 24\n" will display "2*3*4 = 24"
 */