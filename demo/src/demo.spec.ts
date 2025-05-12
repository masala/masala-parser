import { describe, it, expect } from 'vitest'
import { Streams, F, C, SingleParser, Tuple, TupleParser } from '@masala/parser'

const document = `
author: Nicolas
purpose: Demo of Masala Parser
year: 2023
---
`.trim()

interface FrontMatterLine {
    name: string
    value: string
}
type FrontMatterLineParser = SingleParser<FrontMatterLine>
type FrontMatterParser = TupleParser<FrontMatterLine>

const parser = C.char('a')

describe('Parser Combinator demonstration', () => {
    it('should parse a line', () => {
        const stream = Streams.ofString(document)
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('a')
        expect(parsing.isEos()).toBe(false)
    })
})
