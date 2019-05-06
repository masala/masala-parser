/**
 * Created by Simon on 03/01/2017.
 */

import {Streams, C} from '@masala/parser'
import T from './token';

/* TODO mix spaces &  tab bug  "  \t  " will not be accepted
 known issue: non-breakable spaces are not recognised
  */
function codeLine() {
    return C.char('\n')
        .optrep()
        .then(T.fourSpacesBlock())
        .then(T.fourSpacesBlock())
        .drop()
        .then(T.rawTextUntilChar('\n', true))
        .single()
        .map(text => ({code: text}));
}

function parseCodeLine(line:string, offset = 0) {
    return codeLine().parse(Streams.ofString(line), offset);
}

export default {
    codeLine,

    parse(line:string) {
        return parseCodeLine(line, 0);
    },
};
