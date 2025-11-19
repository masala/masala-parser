import { Stream, C, N, F, SingleParser, TupleParser } from '@masala/parser'
import { describe, it, expect } from 'vitest'

interface FirstLine {
    name: string
    value: string[]
}

const document = `
authors: Nicolas, John
Nicolas: 5/10
---

# Masala Parser rocks!
`.trim()

const leftText = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
const separator = C.char(':')

const rightText = F.moveUntil(C.char('\n'), true).map((s) =>
    s.split(',').flatMap((x) => x.trim()),
)

const lineParser = leftText
    .then(separator.drop())
    .then(rightText)

    //.array()
    .map((tuple) => {
        const name = tuple.first()
        const values = tuple.last()
        return {
            name,
            value: values,
        }
    })

const secondLineParser = (firstLine: FirstLine) => {
    return lineParser.filter((val: FirstLine) =>
        firstLine.value.includes(val.name),
    )
}

const verifiedParser = lineParser.flatMap(secondLineParser)

describe('Flatmap real life case', () => {
    it('should parse a line', () => {
        const stream = Stream.ofChars(document)
        const parsing = verifiedParser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual({
            name: 'Nicolas',
            value: ['5/10'],
        })
        expect(parsing.isEos()).toBe(false)
    })
})
