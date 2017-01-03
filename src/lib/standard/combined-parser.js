/**
 * Created by Simon on 16/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from './token';
import TextParser from '../../lib/standard/text-parser';
import TitleParser from '../../lib/standard/title-parser';
import BulletParser from '../../lib/standard/bullet-parser';
import codeBlockParser from './code-line-parser';


function validLine() {
    return P.try(TitleParser.title()).debug("title")
        .or(P.try(codeBlockParser.codeLine().debug("code")))
        .or(P.try(BulletParser.bullet().debug("bullet")))
        .or(P.try(TextParser.formattedParagraph().debug("test")))
        .or(T.lineFeed().debug("line feed"))
}

function parseLine(line, offset = 0) {
    return validLine().parse(stream.ofString(line), offset)
}


export default {
    validLine,

    parse(line){
        return parseLine(line, 0);
    }
}