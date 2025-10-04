import { Streams, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Hello Something Parser', () => {
    it("should parse 'Hello 'World''", () => {
        const helloParser = C.string('Hello')
            .then(C.char(' ').rep())
            .then(C.char("'"))
            .drop()
            .then(C.letter().rep()) // keeping repeated ascii letters
            .then(C.char("'").drop()) // keeping previous letters

        const parsing = helloParser.parse(Streams.ofChar("Hello 'World'"))
        // C.letter.rep() will giv a array of letters
        expect(parsing.value.array()).toEqual(['W', 'o', 'r', 'l', 'd'])
    })

    it("should parse 'Hello 'People' in 2017' but stop after People", () => {
        const helloParser = C.string('Hello')
            .then(C.char(' ').rep())
            .then(C.char("'"))
            .drop()
            .then(C.letter().rep()) // keeping repeated ascii letters
            .then(C.char("'").drop()) // keeping previous letters

        // Note that helloParser will not reach the end of the stream; it will stop at the space after People
        const peopleParsing = helloParser.parse(
            Streams.ofChar("Hello 'People' in 2017"),
        )

        expect(peopleParsing.value.join('')).toBe('People')
        expect(peopleParsing.offset).toBeLessThan(
            "Hello 'People' in 2017".length,
        )
    })
})
