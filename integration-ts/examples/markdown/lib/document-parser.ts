/**
 * Created by Simon on 16/12/2016.
 */

import {Streams, F, Stream, GenLex} from '@masala/parser'

import {paragraph} from './text-parser';
import {title} from './title-parser';
import {codeBlock} from "./code-line-parser";
import {bullet, bulletBlock} from "./bullet-parser";
import {eol, lineFeed} from "./token";


function mdLine() {
    return F.try(title())
        .or(F.try(bullet()))
        .or(F.try(codeBlock(2)))
        .or(F.try(paragraph()))
        .or(lineFeed());
}


export function markdown(){

    let genlex = new GenLex();
    genlex.setSeparatorsParser(eol().then(eol().rep()));
    const tkBullets = genlex.tokenize(bulletBlock(), 'bulletBlock',500);
    const tkCode = genlex.tokenize(codeBlock(2), 'codeBlock',2000);
    const tkText= genlex.tokenize(paragraph(), 'paragraph', 100);
    const tkTitle = genlex.tokenize(title(), 'title', 8000);

    const grammar = F.any().debug('any found====>', true).rep();

    return genlex.use(grammar);

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
