import { describe, it, expect } from 'vitest'
import { Streams, F, C } from '@masala/parser'

/**
 * Created by Nicolas Zozol on 05/11/2017.
 */
describe('Character parsers', () => {
    it('should parse sequential characters followed by EOS', () => {
        const stream = Streams.ofChar('abc')
        const charsParser = C.char('a')
            .then(C.char('b'))
            .then(C.char('c'))
            .then(F.eos().drop()) // End Of Stream ; dropping its value, just checking it's here
        let charsParsing = charsParser.parse(stream)
        expect(charsParsing.value.join('')).toBe('abc')
    })
})
