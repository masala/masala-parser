/**
 * Created by Simon on 03/01/2017.
 */

import {C, F, GenLex, SingleParser, TokenResult} from '@masala/parser'
import {eol, spacesBlock} from './token';
import {CodeBlock, CodeLine} from "./types";


/* TODO mix spaces &  tab bug  "  \t  " will not be accepted
 known issue: non-breakable spaces are not recognised
  */
export function codeLine(spaces=2) {
    return spacesBlock(spaces).drop()
        .then(F.not(eol()).rep())
        .array()
        .map((s: string[]) => s.join('').trim())
        .map(text => ({type: 'codeLine', content: text}));
}


export function codeBlock(spaces=2): SingleParser<CodeBlock> {


    let parser = codeLine(spaces).then(
        F.try(eol().drop().then(codeLine()).single().optrep().array())
    ).array()
        .map(([firstLine, otherLines]) => {

            let lines = (otherLines as CodeLine[])
                .reduce(function (acc, line) {
                    return acc.concat(line)
                }, [firstLine]) as CodeLine[];


            return {type: 'codeBlock', lines: lines
                    .map(line=>line.content)
                    .filter(line=>line.length >0)
            };
        });

    return parser;

}