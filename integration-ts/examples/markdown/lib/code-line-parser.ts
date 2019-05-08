/**
 * Created by Simon on 03/01/2017.
 */

import {C, F, GenLex, TokenResult} from '@masala/parser'
import T, {spacesBlock} from './token';
import {CodeBlock, CodeLine} from "./types";





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