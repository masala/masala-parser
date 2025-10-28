import { describe, it, expect } from 'vitest'
import Stream from '../../lib/stream/index'
import { F, C } from '../../lib/core/index'

describe('Chars Bundle Tests', () => {
    it('accepts a single character', () => {
        const stream = Stream.ofChars('a')
        const parsing = F.regex(/[a-z]/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('a')
        expect(parsing.offset).toBe(1)
    })

    it('consumes when accepting a single character', () => {
        const stream = Stream.ofChars('aa')
        const parsing = F.regex(/[a-z]/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('a')
        expect(parsing.offset).toBe(1)
    })

    it('do not consumes when rejecting a single character', () => {
        const stream = Stream.ofChars('0a')
        const parsing = F.regex(/[a-z]/).parse(stream)
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.value).toBeUndefined()
        expect(parsing.offset).toBe(0)
    })

    it('accepts multiple characters', () => {
        const stream = Stream.ofChars('abc')
        const parsing = F.regex(/[a-z]+/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('abc')
        expect(parsing.offset).toBe(3)
    })

    it('moves as long as possible eating multiple characters', () => {
        const stream = Stream.ofChars('abc0')
        const parsing = F.regex(/[a-z]+/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('abc')
        expect(parsing.offset).toBe(3)
    })

    it('star is accepted even rejects when no characters match', () => {
        const stream = Stream.ofChars('0')
        const parsing = F.regex(/[a-z]*/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).not.toBeUndefined() // empty but accepted!
        expect(parsing.value).toBe('')
        expect(parsing.offset).toBe(0)
    })

    it('accept a identifier building', () => {
        const stream = Stream.ofChars('myUser = "John";')
        const parsing = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/).parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('myUser')
        expect(parsing.offset).toBe(6)
    })

    it('rejects a identifier building', () => {
        const stream = Stream.ofChars('0myUser = "John";')
        const parsing = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/).parse(stream)
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.value).toBeUndefined()
        expect(parsing.offset).toBe(0)
    })

    it('goes in a then flow', () => {
        const expression = 'myUser :=otherUser'
        const stream = Stream.ofChars(expression)
        const parsing = assignParser().parse(stream)
        expect(parsing.isAccepted()).toBeTruthy()
        expect(parsing.offset).toBe(expression.length)
    })

    it('stops in a then flow', () => {
        const expression = 'myUser := 0otherUser'

        const stream = Stream.ofChars(expression)
        const parsing = assignParser().parse(stream)
        expect(parsing.isAccepted()).toBeFalsy()
        expect(parsing.value).toBeUndefined()
        expect(parsing.offset).toBe(expression.indexOf('0'))
    })

    it('consumes the number but not the unit using look-ahead', () => {
        const pixelRe = /\d+(?=px)/ // look-ahead keeps "px" in input
        const stream = Stream.ofChars('20px')
        const parsing = F.regex(pixelRe).parse(stream)

        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('20')
        expect(parsing.offset).toBe(2) // only “20” eaten
    })

    it('accepts a 3- or 6-digit CSS hex colour', () => {
        //   #RGB      |        #RRGGBB
        const colourRe = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?/

        const stream = Stream.ofChars('#abcDEF;')
        const parsing = F.regex(colourRe).parse(stream)

        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('#abcDEF')
        expect(parsing.offset).toBe(7) // consumed exactly the colour
    })

    it('accepts a quoted string whose end quote matches the start', () => {
        const quotedRe = /(['"])(.*?)\1/ // "Hello", 'Hello', etc.
        const stream = Stream.ofChars('"Hello World" rest')
        const parsing = F.regex(quotedRe).parse(stream)

        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('"Hello World"')
        expect(parsing.offset).toBe(13) // length of `"Hello World"`
    })

    it('rejects a quoted string with wrong back reference', () => {
        const quotedRe = /(['"])(.*?)\1/ // "Hello" ok, but not "Hello'
        const stream = Stream.ofChars(`"Hello World' rest`)
        const parsing = F.regex(quotedRe).parse(stream)

        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.value).toBeUndefined()
        expect(parsing.offset).toBe(0) // length of `"Hello World"`
    })
})

function assignParser() {
    const identifier = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
    const space = F.regex(/\s+/)
    const assign = C.string(':=')
    return identifier
        .then(space.optrep().drop())
        .then(assign)
        .then(space.optrep().drop())
        .then(identifier)
}
