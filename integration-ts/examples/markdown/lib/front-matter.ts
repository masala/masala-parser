import {F,C,Streams} from '@masala/parser'
import { SingleParser } from '@masala/parser/typings/tuple-parser.js'

interface FrontMatterLine{
    name:string,
    value:string
}
type FrontMatter =FrontMatterLine[]

function identifier():SingleParser<string> {
    return F.regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
}

function stopper(){
    return C.char(':')
}

function endLiner(){
    return C.char('\n').or(F.eos())
}

function leftText():SingleParser<string> {
    return identifier().rep().then(stopper().drop()).map(
        s=>(s.join(''))
    )
}


function rightText():SingleParser<string> {
    return F.moveUntil(endLiner().drop(), true)
}

function frontMatterLine(){
    return leftText().then(F.not(endLiner()).rep().).then(endLiner().drop())
}


