import { describe, it, expect } from 'vitest'
import { Streams, F, C, SingleParser, Tuple } from '@masala/parser'

describe('Lazy Combinator with Recursion', () => {
    it('should handle recursive parsing with F.lazy', () => {
        /**
         * A gives its VALUE to B using flatMap
         */
        function A(char: string): SingleParser<string> {
            // Parses repetition of char.toUpperCase(), then calls B
            return C.char(char.toUpperCase()).rep().flatMap(B)
        }

        /**
         * B tries to parse 'B', or lazily calls A
         * There is recursion, and we call A with lazy. We send PARAMETERS to A
         * within an array
         */
        function B(aVal: Tuple<string>): SingleParser<string> {
            // Parses 'B', maps result to include joined aVal
            const parseB = C.char('B').map((bVal) => aVal.join('') + '-' + bVal)
            // Lazily calls A with 'a' if parseB fails
            const recursiveA = F.lazy(A, ['a'])
            return parseB.or(recursiveA)
        }

        // Start the parser with A('a')
        const parser = A('a')

        // Input: AAA B
        const str = 'AAAB'
        const stream = Streams.ofChars(str)
        const parsing = parser.parse(stream)

        // A('a') -> C.char('A').rep() parses 'AAA'
        // flatMap(B) is called with aVal = ['A', 'A', 'A']
        // B(['A','A','A']) tries C.char('B').map(...)
        // Parses 'B', map returns 'AAA-B'
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('AAA-B') // Check the final assembled value
        expect(parsing.offset).toBe(str.length)
        expect(parsing.isEos()).toBe(true)
    })
})
