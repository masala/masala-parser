import { describe, it, expect } from 'vitest'
import { Stream, C, N } from '@masala/parser'

describe('Absolute parser', () => {
    it('should parse a number between pipes and make it positive', () => {
        // We parse the mathematical absolute expression: |-4.6|
        let stream = Stream.ofChars('|-4.6|')
        const absoluteParser = C.char('|')
            .then(N.number())
            .last() // we had ['|',-4.6], we keep -4.6
            // we take and immediately drop '|'
            .then(C.char('|').drop()) // we now have [-4.6]
            .single()
            .map((x) => Math.abs(x)) // we map -4.6 to 4.6

        // Masala needs a stream of characters
        let parsing = absoluteParser.parse(stream)
        expect(parsing.value).toBe(4)
    })
})
