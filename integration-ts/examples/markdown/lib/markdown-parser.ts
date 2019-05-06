/**
 * Created by Simon on 16/12/2016.
 */

import {Streams, F, Stream} from '@masala/parser'
import T from './token';
import TextParser from './text-parser';
import {title} from './title-parser';
import BulletParser from './bullet-parser';
import codeBlockParser from './code-line-parser';

function mdLine() {
    return F.try(title())
        .or(F.try(codeBlockParser.codeLine()))
        .or(F.try(BulletParser.bullet()))
        .or(F.try(TextParser.formattedParagraph()))
        .or(T.lineFeed());
}

function document() {
    return mdLine().rep().map(item => item.array());
}

function parseLine(line:string) {
    return mdLine().parse(Streams.ofString(line), 0);
}

export default {
    mdLine,

    parseLine(line:string) {
        return parseLine(line);
    },

    parse(text:Stream<string>) {
        return document().parse(text);
    },
};
