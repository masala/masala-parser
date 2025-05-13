import { Streams, F, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Flow Combinators (try, opt)', () => {
    it('should handle backtracking with try and optional parsing', () => {
        function day() {
            return C.stringIn([
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY',
            ])
        }

        function blank() {
            return C.char(' ').rep().returns(' ') // returns a single space regardless of how many matched
        }

        const separator = () => C.string('---')

        // Tries to parse 'xyz', backtracks if fails
        function emptyTry() {
            return F.try(C.string('xyz')).debug('goback')
        }

        // Parses optional 'xyz'
        function optAlternative() {
            return C.string('xyz').opt().debug('opt')
        }

        function combinator() {
            return day()
                .debug('day') // Parses TUESDAY
                .then(blank().rep()) // Parses spaces

                .then(separator().debug('sep')) // Parses '---'
                .then(optAlternative().map((x) => x.orElse('42')))
                .debug('afterOPt') // Parses optional 'xyz', fails, returns '12'
                .then(emptyTry().or(day()).debug('emptyTry')) // Tries 'xyz', fails, backtracks (consumes nothing)
        }

        const inputString = 'TUESDAY      ---FRIDAY' // Simplified input for clarity
        // Original: 'TUESDAY      THURSDAY  TUESDAY  ---FRIDAY'; causes issues with rep()

        let stream = Streams.ofString(inputString)
        let parsing = combinator().parse(stream)

        // Based on the original assertFalse(parsing.isAccepted());
        // The final day() tries to parse FRIDAY after emptyTry failed and backtracked.
        // emptyTry failed at offset after '---' (index 15 in simplified string).
        // The final day() starts at offset 15 and parses FRIDAY.
        expect(parsing.isAccepted()).toBe(true) // Should be accepted if it parses TUESDAY --- [12] FRIDAY
        expect(parsing.value.array()).toEqual([
            'TUESDAY',
            ' ',
            '---',
            '42',
            'FRIDAY',
        ])
        expect(parsing.offset).toBe(inputString.length)

        // Let's test the original failure case logic - why did it fail?
        const originalString = 'TUESDAY      THURSDAY  TUESDAY  ---FRIDAY'
        let originalStream = Streams.ofString(originalString)
        let originalParsing = combinator().parse(originalStream)
        // Perhaps the blank().rep() was too greedy?
        expect(originalParsing.isAccepted()).toBe(false) // Confirming original behavior
    })
})
