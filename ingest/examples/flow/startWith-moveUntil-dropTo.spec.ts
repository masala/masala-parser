import { Streams, F, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

const string = 'The quick brown fox jumps over the lazy dog'

describe('Flow Combinators (startWith, moveUntil, dropTo)', () => {
    it('should manipulate the stream and build a string', () => {
        const inputString = 'The quick brown fox jumps over the lazy dog'

        function combinator() {
            return F.startWith('hello: ')
                .then(F.moveUntil('brown'))
                .then(C.string('brown'))
                .then(F.dropTo('dog'))
        }

        let stream = Streams.ofString(inputString)
        let parsing = combinator().parse(stream)

        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value.join('')).toBe('hello: The quick brown')
        expect(parsing.offset).toBe(inputString.length)
    })
})
