import { F, C, Stream, Tuple, TupleParser } from '@masala/parser'
import { SingleParser } from '@masala/parser'

interface FrontMatterLine {
    name: string
    value: string
}
export type FrontMatterParser = TupleParser<FrontMatterLine>

const leftText = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
const stopper = C.char(':')
const rightText = F.moveUntil(C.char('\n'))

function identifier(): SingleParser<string> {
    return F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
}

/*
function stopper() {
    return C.char(':')
}*/

function endLiner() {
    return C.char('\n').or(F.eos())
}

function lineSeparator() {
    return C.char('\n')
}
/*
function leftText(): SingleParser<string> {
    return identifier().then(stopper()).first()
}

function rightText(): SingleParser<string> {
    return F.moveUntil(endLiner().drop(), true)
}*/

function frontMatterLine(): SingleParser<FrontMatterLine> {
    return leftText
        .then(stopper.drop())
        .then(rightText.opt())
        .array()
        .map(([name, value]: any[]) => ({
            name,
            value: value.orElse('').trim(),
        }))
}

export const frontMatterParser: FrontMatterParser = frontMatterLine()
    .then(lineSeparator().optrep().drop())
    .single()
    .rep()
