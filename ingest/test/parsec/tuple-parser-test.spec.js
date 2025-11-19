import { describe, it, expect } from 'vitest'
import { Stream } from '../../lib/index.js'
import { F, C } from '../../lib/core/index'

describe('Tuple Parser Tests', () => {
    it('expect p.first() to work', () => {
        let text = 'abc'
        let parser = C.letter().rep().first()

        expect(parser.val(text)).toBe('a')
    })

    it('expect p.last() to work', () => {
        let text = 'abc'
        let parser = C.letter().rep().last()

        expect(parser.val(text)).toBe('c')
    })

    it('expect p.at() to work', () => {
        let text = 'abc'
        let parser = C.letter()
            .rep()
            .map((t) => t.at(2))

        expect(parser.val(text)).toBe('c')
    })

    it('expect p.array to fail if not a tupleParser', () => {
        let text = 'abc'
        let parser = C.letters().array()

        expect(() => parser.val(text)).toThrow()
    })

    it('expect F.nop to be like a empty tuple', () => {
        let text = 'ab'
        const stream = Stream.ofChars(text)
        let parser = C.char('a').then(F.nop()).then(C.char('b')).join()
        let parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual('ab')

        parser = F.nop()
            .then(C.char('a'))
            .then(F.nop())
            .then(C.char('b'))
            .then(F.nop())
            .join()
        parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual('ab')
    })
})
