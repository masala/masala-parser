/**
 * Created by Simon on 15/12/2016.
 */

import Stream from '../../lib/stream/index';
import CombinedParser from '../../lib/standard/combined-parser';

import fs from 'fs'

function document(){
    return CombinedParser.validLine()
        .rep()
}

function parseDocument( string, offset=0){
    return document().parse(Stream.ofString(string), offset)
}



// get a file name, return a parser, synchronously
//TODO document() should be fed directly with a stream
function parseFile(fileName){
    let data = fs.readFileSync(fileName, 'utf8' );
    return parseDocument(data);
}



export default {
    document,
    parseFile,

    parse(stream){
        return parseDocument(stream,0);
    }
}