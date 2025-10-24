import { describe, it, expect } from 'vitest'
import Streams from '../../lib/stream/index'
import { F, C } from '../../lib/core/index'

describe('Failed Try', () => {
    it('separate the problem of F.try only', () => {
        function emptyTry() {
            return F.try(C.string('a'))
        }

        const inputString = 'b' // Simplified input for clarity
        let stream = Streams.ofChars(inputString)
        let parsing = emptyTry().parse(stream)

        expect(parsing.isAccepted()).toBe(false) // Should be accepted
        expect(parsing.offset).toBe(0) // Should be at the start of the string
        expect(parsing.value).toEqual(undefined) // Should not have a value

        /**
         * RESOLUTION: It works accordingly: after a failed try, the parsing is NOT
         * accepted. However, the offset is not moved, and the value is undefined,
         * which give us the opportunity to use `F.try(x).or(anotherParser)`.
         */
    })
})
