/**
 * Created by Simon on 15/12/2016.
 */

import Stream from '../../lib/stream/index';
import CombinedParser from '../../lib/standard/combined-parser';


function document(){
    return CombinedParser.validLine()
        .rep()
}

function parseDocument( string, offset=0){
    return document().parse(Stream.ofString(string), offset)
}


export default {
    document,

    parse(stream){
        return parseDocument(stream,0);
    }
}