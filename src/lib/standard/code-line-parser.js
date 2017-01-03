/**
 * Created by Simon on 03/01/2017.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import textParser from './text-parser';
import T from '../../lib/standard/token';

/* TODO mix spaces &  tab bug  "  \t  " will not be accepted
 known issue: non-breakable spaces are not recognised
  */
function codeLine(){
    return P.char('\n').optrep()
        .thenRight(T.fourSpacesBlock())
        .thenRight(T.fourSpacesBlock()).debug("double bloc detected")
        .thenRight(T.rawTextUntilChar('\n', true)).debug("code line detected")
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