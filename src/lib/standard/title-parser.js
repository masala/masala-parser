/**
 * Created by Simon on 14/12/2016.
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';

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
    return T.rawTextUntilChar('\n')
        .thenLeft(T.eol())
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