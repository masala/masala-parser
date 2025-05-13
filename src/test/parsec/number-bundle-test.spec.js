import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index'
import { N } from '../../lib/parsec/index'

function testParser(parser, string) {
    let myStream = stream.ofString(string)
    let parsing = parser.parse(myStream)
    return parsing
}

describe('Number Bundle Tests', () => {
    it('expect N.integer() to be ok', () => {
        const string = '007'
        const parser = N.integer()
        const parsing = testParser(parser, string)
        expect(parsing.value).toBe(7)
    })

    it('expect N.integer() with sign to be ok', () => {
        const string = '-007'
        const parser = N.integer()
        const parsing = testParser(parser, string)
        expect(parsing.value).toBe(-7)
    })

    it('expect number without sign to be ok', () => {
        const string = '007.12'
        const parser = N.number()
        const parsing = testParser(parser, string)
        expect(parsing.value).toBe(7.12)
    })

    it('expect many digits to be joined and to be a number', () => {
        const string = '007'
        const parser = N.digits()
        const parsing = testParser(parser, string)
        expect(typeof parsing.value).toBe('number')
        expect(parsing.value).toBe(7)
    })
})
