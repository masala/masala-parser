/**
 * Created by Simon on 14/12/2016.
 */
import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';

function hashes(){
    return P.char('#').rep().map(string => string.length)
}

function title(){
    return hashes()
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

function parseTitle( line, offset=0){
    return title().parse(stream.ofString(line), offset)
}


export default {
    title,

    parse(line){
        return parseTitle(line,0);
    }
}
