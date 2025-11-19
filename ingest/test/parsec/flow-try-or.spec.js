import { describe, it, expect } from 'vitest'
import { NEUTRAL } from '../../lib/index.js'
import Stream from '../../lib/stream/index'
import { C, F } from '../../lib/core/index'

describe('combining F.try() and p.or()', () => {
    it('works straightforward with a single or()', () => {
        const endLiner = C.char('\n').or(F.eos())
        const parser = F.moveUntil(endLiner.drop())

        const document = 'hello world\n'
        const stream = Stream.ofChars(document)
        const parsing = parser.parse(stream)
        expect(parsing.value).toBe('hello world')
        expect(parsing.offset).toBe(document.length - 1)
    })

    it('eats some chars with or', () => {
        const eater = C.char('a').then(C.char('a'))
        const parser = eater.or(C.char('b'))

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)

        // ✨ this is the point ! one 'a' is consumed when failing
        expect(parsing.offset).toBe(1)
    })

    it('avoids eating with F.try()', () => {
        const eater = C.char('a').then(C.char('a'))
        const parser = F.try(eater)

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)

        // not consumed as expected
        expect(parsing.consumed).toBe(false)
        // ✨ fixed: despite backtracking,  'a' is consumed when failing
        expect(parsing.offset).toBe(0)
    })

    it('F.try().or() can still eat because of or', () => {
        const eater = C.char('a').then(C.char('a'))
        const secondEater = C.char('a').then(C.char('b'))
        const parser = F.try(eater).or(secondEater)

        const stream = Stream.ofChars('ac')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)

        // ✨ despite backtracking for first parser, the second will eat 'a'
        expect(parsing.offset).toBe(1)
    })

    it('F.try(x).or(F.try(y)) will not eat ', () => {
        const eater = C.char('a').then(C.char('a'))
        const secondEater = C.char('a').then(C.char('b'))
        const parser = F.try(eater).or(F.try(secondEater))

        const stream = Stream.ofChars('ac')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)

        // ✨ With full backtracking, nothing is eaten
        expect(parsing.offset).toBe(0)
    })

    it('Full backtracking works at index !=0 ', () => {
        const start = C.string('====')
        const eater = C.char('a').then(C.char('a'))
        const parser = start.drop().then(F.try(eater))

        const stream = Stream.ofChars('====ac')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)

        // ✨ despite backtracking for the first parser, the second will eat 'a'
        expect(parsing.offset).toBe(4)
    })

    it('parses with backtrack using F.all()', () => {
        const eater = C.char('a').then(C.char('a'))
        const secondEater = C.char('a').then(C.char('b'))
        const thirdEater = C.char('a').then(C.char('c'))
        const parser = F.tryAll([eater, secondEater, thirdEater])

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.offset).toBe(2)
    })

    it('can fail with F.all(), not eating chars', () => {
        const eater = C.char('a').then(C.char('a'))
        const secondEater = C.char('a').then(C.char('c'))
        const thirdEater = C.char('a').then(C.char('d'))
        const parser = F.tryAll([eater, secondEater, thirdEater])

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.offset).toBe(0)
    })

    it('use tryAll with empty array, mapping empty tuple', () => {
        const parser = F.tryAll([])

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.offset).toBe(0)
        expect(parsing.value).toBe(NEUTRAL)
    })

    it('use tryAll with empty array in a series', () => {
        const parser = F.tryAll([])
            .then(C.char('a'))
            .then(F.tryAll([]))
            .then(C.char('b'))
            .join()

        const stream = Stream.ofChars('ab')
        const parsing = parser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.offset).toBe(2)
        expect(parsing.value).toBe('ab')
    })
})
