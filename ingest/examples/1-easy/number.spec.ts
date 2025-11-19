import { Stream, F, N } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Number parser', () => {
    it('should parse a number followed by EOS', () => {
        // Parsec needs a stream of characters
        const document = '12'
        const s = Stream.ofChars(document)

        // numberLitteral defines any int or float number
        // We expect a number, then eos: End Of Stream
        // We use drop() because we don't need the value of F.eos, we only want 12
        const numberParser = N.number().then(F.eos().drop()).single()
        const parsing = numberParser.parse(s)

        // If the parser reached the end of stream (F.eos) without rejection, parsing is accepted
        expect(parsing.isAccepted()).toBe(true)
        // The parser has a 12 value inside the monoid
        expect(parsing.value).toBe(12)
    })
})
