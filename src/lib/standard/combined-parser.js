/**
 * Created by Simon on 16/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';



function document(){
    return title or paragraph or blank
    return T.blank()
}

function parseDocument( line, offset=0){
    // return formattedParagraph().parse(stream.ofString(line), offset)
    return document().parse(stream.ofString(line), offset)
}



export default {

    parse(line){
        return parseDocument(line,0);
    }
}
 
 
