import { describe, it, expect } from 'vitest'
import { Streams, C, N } from '@masala/parser'

describe('Floor combinator', () => {
    it('should parse a number between pipes and floor it', () => {
        let stream = Streams.ofChars('|4.6|')
        const floorCombinator = C.char('|')
            .drop()
            .then(N.number()) // we have ['|',4.6], we keep 4.6
            .then(C.char('|').drop()) // we have [4.6, '|'], we keep [4.6]
            .single()
            .map((x) => Math.floor(x))

        // Parsec needs a stream of characters
        let parsing = floorCombinator.parse(stream)
        expect(parsing.value).toBe(4)
    })
})
