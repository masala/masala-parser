/**
 * Created by Simon on 03/01/2017.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import textParser from './text-parser';
import T from '../../lib/standard/token';

function fourSpaceBlock(){
    return P.char('\t')
        .or(P.string('    '))
}

/* In the markdown source, a line of code is a line starting with 2 blocks of 4 spaces and terminated with \n or end of stream.
 a 4 space block can be replace by a tab ( \t )
 So, this will accept "        " or "\t\t" or "    \t"
 but will not accept "  \t  "
 This should be fixed latter with a 2 stages parser
 non-breakable spaces are not recognised yet
  */

function codeBlock(){
    return fourSpaceBlock()
        .thenRight(fourSpaceBlock())
        .thenRight(T.blank())   // additional spaces ans tabs are ignored
        .thenRight(T.rawTextUntilChar('\n'))
        .map(text => ({code: text }  ))
}


function parseCodeBlock( line, offset=0){
    return codeBlock().parse(stream.ofString(line), offset)
}

export default {
    codeBlock,

    parse(line){
        return parseCodeBlock(line,0);
    }
}