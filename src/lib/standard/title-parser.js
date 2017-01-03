/**
 * Created by Simon on 14/12/2016.
 */
 /*
 * This module try parse a title. The folowing will be recognised as titles:
 * "#foo\n"  "##foo\n"  "foo\n==="  "foo\n---"  "##########     foo     \n"
 * 
 * Limits and axiomes
 * A lineFeed in the code ends the parsing of a title.  #foo\nbar  -> {title:foo},{text:bar} 
 * The parsing NEEDS a "\n" to end. No detection for end of stream
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from './token';

function sharps(){
    return P.char('#').rep().map(string => string.length)
}

function equals(){
    return P.string('===')
        .then(T.rawTextUntilChar('\n'))
        .then(T.eol())
        .map(a=>1);  // this mean a level 1 title
}

function minuses(){
    return P.string('---')
        .then(T.rawTextUntilChar('\n'))
        .then(T.eol())
        .map(a=>2); // this mean a level 2 title
}

function titleStyle1(){
    return sharps()
        .then(T.rawTextUntilChar('\n'))
        .thenLeft(T.eol())
        .map(array => ({
                        title:{
                            level:array[0],
                            text:array[1]
                        }
        }))
        .debug('title:');
}

function titleAlt(){
    return T.blank().debug("blank")
        .thenRight( T.rawTextUntilChar('\n').debug("titleAlt.mark1"))
        .thenLeft(T.eol()).debug("titleAlt.mark2")
        .then(equals().or(minuses())).debug('titleAlt avant Map')
        .map(array => ({
            title:{
                level:array[1],
                text:array[0]
            }
        }))
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
    
* End Of Line (\n) is compulsary. You have to type  "###title" or "title\n===\n"    
 */