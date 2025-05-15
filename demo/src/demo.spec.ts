import { describe, it, expect } from 'vitest'
import { Streams, F, C, SingleParser, Tuple, TupleParser } from '@masala/parser'

interface FrontMatterLine {
    name: string
    value: string
}
type FrontMatterLineParser = SingleParser<FrontMatterLine>
type FrontMatterParser = TupleParser<FrontMatterLine>

const document = `
author: Nicolas
purpose: Demo of Masala Parser
year: 2023
---

# Masala Parser rocks!
`.trim()

const leftText = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
const separator = C.char(':')
const rightText = F.moveUntil(C.char('\n'))

const line = leftText
    .then(separator.drop())
    .then(rightText)
    .array()
    .map(([name, value]) => ({
        name,
        value: value.trim(),
    }))

describe('Parser Combinator demonstration', () => {
    it('should parse a line', () => {
        const stream = Streams.ofString(document)
        const parsing = line.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual({
            name: 'author',
            value: 'Nicolas',
        })
        expect(parsing.isEos()).toBe(false)
    })
})
