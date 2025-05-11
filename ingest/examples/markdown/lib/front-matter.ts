import {F, C, Streams, Tuple, TupleParser} from '@masala/parser'
import { SingleParser } from '@masala/parser'

interface FrontMatterLine{
    name:string,
    value:string
}
export type FrontMatterParser =TupleParser<FrontMatterLine>

function identifier():SingleParser<string> {
    return F.regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
}

function stopper(){
    return C.char(':')
}

function endLiner(){
    return C.char('\n').or(F.eos())
}

function lineSeparator(){
    return C.char('\n')
}

function leftText():SingleParser<string> {
    return identifier().rep().then(stopper().drop()).map(
        s=>(s.join(''))
    )
}


function rightText():SingleParser<string> {
    return F.moveUntil(endLiner().drop(), true)
}

function frontMatterLine():SingleParser<FrontMatterLine> {
    return leftText().then(rightText()).array().map(
        ([name, value])=>({
            name,
            value
        })
    )
}


export const frontMatterParser:FrontMatterParser = frontMatterLine()
    .then(lineSeparator().optrep().drop()).single()
    .rep()