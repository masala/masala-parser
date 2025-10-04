import { Streams, C, N } from '@masala/parser'
import { describe, it, expect } from 'vitest'

// Next char must be the double of the previous
function doubleNumber(param: number) {
    return C.string('' + param * 2)
}

describe('FlatMap Combinator', () => {
    it('should parse a digit, then parse the string representation of its double', () => {
        const combinator = N.digit().flatMap(doubleNumber)

        // Test case 1: Successful parse (1 followed by 2)
        let response1 = combinator.parse(Streams.ofChar('12'))
        expect(response1.isAccepted()).toBe(true)
        // flatMap typically combines results. Check how the library handles this.
        // Assuming it keeps the second parser's result: expect(response1.value.join('')).toBe('2');
        // Or if it combines: expect(response1.value.array()).toEqual([1, '2']);

        // Test case 2: Failed parse (1 followed by 3, expected 2)
        let response2 = combinator.parse(Streams.ofChar('13'))
        expect(response2.isAccepted()).toBe(false)

        // Test case 3: Successful parse (4 followed by 8)
        let response3 = combinator.parse(Streams.ofChar('48'))
        expect(response3.isAccepted()).toBe(true)
        // Assuming it keeps the second parser's result: expect(response3.value.join('')).toBe('8');
    })
})
