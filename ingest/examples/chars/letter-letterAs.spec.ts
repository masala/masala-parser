import { Streams, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Character Combinators (letters, lowerCase, notString)', () => {
    it('should parse sequences of letters and characters', () => {
        const inputString = 'The quick brown fox jumps over the lazy dog.'

        function combinator() {
            return C.letters() // Parses 'The'
                .then(C.char(' ')) // Parses space
                .then(C.lowerCase().rep()) // Parses 'quick'
                .then(C.char(' ')) // Parses space
                .then(C.notChar('.').rep()) // Parses until the end
        }

        let stream = Streams.ofString(inputString)
        let parsing = combinator().parse(stream)

        expect(parsing.isAccepted()).toBe(true)
        const structure = parsing.value.array() as string[]
        expect(structure[0]).toBe('The') // Check the number of parsed elements
        console.log(parsing.value)
        expect(parsing.value.join('')).toBe(
            'The quick brown fox jumps over the lazy dog',
        ) // Check the collected value
        expect(parsing.isEos()).toBe(false) // Did not reach the '.' at EOS
    })
})
