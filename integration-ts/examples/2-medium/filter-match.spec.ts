import { Stream, N } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Filter and Match Combinators', () => {
    it('should filter digits greater than or equal to 5', () => {
        let combinator = N.digit()
            .filter((m) => m >= 5)
            .rep()
        // The parser will accept the first 3 numbers (5, 6, 7)
        let response = combinator.parse(Stream.ofChars('5672'))
        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(3)
        // Check the actual values if needed
        // expect(response.value.array()).toEqual([5, 6, 7]);
    })

    it('should match the exact number 55', () => {
        /**
         * Match allow to find the right number
         */
        let parser = N.number().match(55)

        // Test case 1: exact match
        let res1 = parser.parse(Stream.ofChars('55'))
        expect(res1.isAccepted()).toBe(true)
        expect(res1.value).toBe(55)

        // Test case 2: non-match (extra digit)
        let res2 = parser.parse(Stream.ofChars('555'))
        expect(res2.isAccepted()).toBe(false)

        // Test case 3: non-match (different number)
        let res3 = parser.parse(Stream.ofChars('56'))
        expect(res3.isAccepted()).toBe(false)
    })
})
