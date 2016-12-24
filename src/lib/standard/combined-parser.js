/**
 * Created by Simon on 16/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';   
import TextParser from '../../lib/standard/text-parser';
import TitleParser from '../../lib/standard/title-parser';



function validLine(){
    return P.try(TitleParser.title().debug("Title"))
        .or(P.try(TextParser.formattedParagraph().debug("Paragraphe")))
        .or(T.lineFeed().debug("lineFeed"))
}

function parseLine( line, offset=0){
    return validLine().parse(stream.ofString(line), offset)
}

                                                  
                                                  
export default {
    validLine,
    
    parse(line){
        return parseLine(line,0);
    }
}