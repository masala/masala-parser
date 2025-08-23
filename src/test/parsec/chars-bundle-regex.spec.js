import { describe, it, expect } from 'vitest'
import Streams from '../../lib/stream/index'
import { N, C } from '../../lib/parsec/index'

describe('Chars Bundle Tests', () => {
    it('accepts a character inside the range', () => {
        const parsing = C.inRegexRange('a-z').parse(Streams.ofString('c'))
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('c')
        expect(parsing.offset).toBe(1) // consumed one char
    })

    it('rejects a character outside the range', () => {
        const parsing = C.inRegexRange('a-z').parse(Streams.ofString('Z'))
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.offset).toBe(0) // cursor untouched on failure
    })

    it('accepts a digit with /[0-9]/', () => {
        const parsing = C.inRegexRange('0-9').parse(Streams.ofString('7'))
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('7')
    })

    it('rejects a letter with /[0-9]/', () => {
        const parsing = C.inRegexRange('0-9').parse(Streams.ofString('a'))
        expect(parsing.isAccepted()).toBe(false)
    })
})

describe('C.inRegexRange – identifier “first char” rule', () => {
    const identStart = C.inRegexRange('a-zA-Z_')

    it('accepts a letter', () => {
        expect(identStart.parse(Streams.ofString('B')).isAccepted()).toBe(true)
    })

    it('accepts an underscore', () => {
        expect(identStart.parse(Streams.ofString('_')).isAccepted()).toBe(true)
    })

    it('rejects a digit', () => {
        expect(identStart.parse(Streams.ofString('3')).isAccepted()).toBe(false)
    })
})

describe('C.inRegexRange in a more complex stream', () => {
    it('accepts the string', () => {
        const stream = Streams.ofString('0a1')
        const parser = N.digit()
            .then(C.inRegexRange('a-c'))
            .then(N.digit())
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.offset).toBe(3)
    })

    it('reject the range', () => {
        const stream = Streams.ofString('0d1')
        const parser = N.digit()
            .then(C.inRegexRange('a-c'))
            .then(N.digit())
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.offset).toBe(1)
    })
})
