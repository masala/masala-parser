/**
 * Created by Simon on 15/12/2016.
 */

import P from '../parsec/parser';
import Stream from '../../lib/stream/index';
import T from '../../lib/standard/token';
import CombinedParser from '../../lib/standard/combined-parser';


function document(){
 /*   return P.eos
        .or(CombinedParser.validLine())
        .rep()  */
    return CombinedParser.validLine()
        .rep()
}

function parseDocument( stream, offset=0){
    return document().parse(Stream.ofString(stream), offset)
}



export default {
    document,

    parse(stream){
        return parseDocument(stream,0);
    }
}