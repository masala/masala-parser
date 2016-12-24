/**
 * Created by Simon on 16/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';   
import TextParser from '../../lib/standard/text-parser';
import TitleParser from '../../lib/standard/title-parser';



function document(){
   /* return  T.blank().debug("blank")
      .or(TitleParser.title().debug("Title"))
      .or(TextParser.formattedParagraph().debug("Paragraphe"))  */
    return P.try(TitleParser.title().debug("Title"))
        .or(P.try(TextParser.formattedParagraph().debug("Paragraphe")))
        .or(T.blank().debug("blank"))

}

function parseDocument( line, offset=0){
    return document().parse(stream.ofString(line), offset)
}

                                                  
                                                  
export default {
    document,
    
    parse(line){
        return parseDocument(line,0);
    }
}