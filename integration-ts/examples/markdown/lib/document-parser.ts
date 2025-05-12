/**
 * Created by Simon on 16/12/2016.
 */

import { Streams, F, Stream, GenLex, TupleParser } from '@masala/parser'

import { paragraph } from './text-parser'
import { title } from './title-parser'
import { codeBlock } from './code-line-parser'
import { bullet, bulletBlock } from './bullet-parser'
import { eol, lineFeed } from './token'
import { MdElement } from './types'

export function markdown(): TupleParser<MdElement> {
    let genlex = new GenLex()
    genlex.setSeparatorsParser(eol().then(eol().rep()))
    const tkBullets = genlex.tokenize(bulletBlock(), 'bulletBlock', 500)
    const tkCode = genlex.tokenize(codeBlock(2), 'codeBlock', 600)
    const tkText = genlex.tokenize(paragraph(), 'paragraph', 800)
    const tkTitle = genlex.tokenize(title(), 'title', 50)

    const grammar = F.any()
        .map((t) => t.value)
        .rep()

    return genlex.use(grammar) as TupleParser<MdElement>
}
