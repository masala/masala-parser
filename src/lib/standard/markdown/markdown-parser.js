/**
 * Created by Simon on 16/12/2016.
 */

import {F} from '../../parsec/index';
import stream from '../../stream/index';
import T from './token';
import TextParser from './text-parser';
import TitleParser from './title-parser';
import BulletParser from './bullet-parser';
import codeBlockParser from './code-line-parser';


function mdLine() {
    return F.try(TitleParser.title())
        .or(F.try(codeBlockParser.codeLine()))
        .or(F.try(BulletParser.bullet()))
        .or(F.try(TextParser.formattedParagraph()))
        .or(T.lineFeed())
}

function document(){
    return mdLine().rep();
}

function parseLine(line) {
    return mdLine().parse(stream.ofString(line), 0);
}


export default {
    mdLine,

    parseLine(line){
        return parseLine(line, 0);
    },

    parse(stream, offset){
        return document().parse(stream, offset)
    }
}








