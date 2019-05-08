/**
 * Created by Simon on 16/12/2016.
 */

import {Streams, F, Stream} from '@masala/parser'

import {paragraph} from './text-parser';
import {title} from './title-parser';
import {codeBlock} from "./code-line-parser";
import {bullet} from "./bullet-parser";
import {lineFeed} from "./token";


function mdLine() {
    return F.try(title())
        .or(F.try(codeBlock(2)))
        .or(F.try(bullet()))
        .or(F.try(paragraph()))
        .or(lineFeed());
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
