/**
 * Created by Simon on 03/01/2017.
 */

import {C, F, GenLex, TokenResult} from '@masala/parser'
import T from './token';
import {CodeBlock, CodeLine} from "./types";


//accept 1 tab or 4 spaces. Space may be unbreakable
function spacesBlock(spaces: number) {
    return C.char('\t').or(C.charIn(' \u00A0').occurrence(spaces));
}


/* TODO mix spaces &  tab bug  "  \t  " will not be accepted
 known issue: non-breakable spaces are not recognised
  */
export function codeLine(spaces: number) {
    return spacesBlock(spaces).drop()
        .then(F.not(T.eol()).rep())
        .array()
        .map((s: string[]) => s.join(''))
        .map(text => ({type: 'codeLine', content: text}));
}


export function codeBlock(spaces: number) {

    let genlex = new GenLex();
    genlex.setSeparators('\n');
    genlex.tokenize(codeLine(spaces), 'codeLine');
    return genlex.use(F.any().rep()).map(result => {
        let tokens = result.array();
        const lines = tokens
            .map(t => t.value as CodeLine)
            .map(line => line.content);
        return {type: 'codeBlock', lines};
    });

}