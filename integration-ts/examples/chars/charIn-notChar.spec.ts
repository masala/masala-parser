import { Streams, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Character Combinators (charIn, charNotIn)', () => {
    it('charNotIn should parse characters not in the specified set', () => {
        let combinator = C.charNotIn('abc').rep()
        // will accept x, y, and z but will stop at 'b'
        let response = combinator.parse(Streams.ofChars('xyzb'))

        expect(response.isAccepted()).toBe(true)
        expect(response.offset).toBe(3)
        expect(response.value.join('')).toBe('xyz')
    })

    it('charIn should parse characters within the specified set until EOS', () => {
        let combinator = C.charIn('abc').rep().thenEos()
        let response = combinator.parse(Streams.ofChars('acbaba'))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.join('')).toBe('acbaba')
        expect(response.isEos()).toBe(true)
    })
})
