/**
 * Created by Simon on 03/01/2017.
 */

import {C} from '../../parsec/index';
import stream from '../../stream/index';
import T from './token';

/* TODO mix spaces &  tab bug  "  \t  " will not be accepted
 known issue: non-breakable spaces are not recognised
  */
function codeLine(){
    return C.char('\n').optrep()
        .thenRight(T.fourSpacesBlock())
        .thenRight(T.fourSpacesBlock())
        .thenRight(T.rawTextUntilChar('\n', true))
        .map(text => ({code: text }  ))
}


function parseCodeLine( line, offset=0){
    return codeLine().parse(stream.ofString(line), offset)
}

export default {
    codeLine,

    parse(line){
        return parseCodeLine(line,0);
    }
}