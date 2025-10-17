import { describe, it, expect } from 'vitest'
import Streams from '../../lib/stream/index'
import { F, C } from '../../lib/parsec'

describe('Stream Offset Tests', () => {
    it('response ok with a CharStream', () => {
        const stream = Streams.ofChars('The world is a vampire')

        const parser = C.string('The')
        const response = parser.parse(stream, 0)

        expect(response.isAccepted()).toBe(true)
        expect(response.isEos()).toBe(false)
        expect(response.offset).toBe(3)
    })

    it('response ok inside a CharStream', () => {
        const stream = Streams.ofChars('The world is a vampire')

        const parser = C.string('world')
        const response = parser.parse(stream, 4)

        expect(response.isAccepted()).toBe(true)
        expect(response.isEos()).toBe(false)
        expect(response.offset).toBe(9)
    })

    it('response ok completing a CharStream', () => {
        const stream = Streams.ofChars('The world is a vampire')

        const parser = C.letter().or(C.char(' ')).rep()
        const response = parser.parse(stream)

        expect(response.isAccepted()).toBe(true)
        expect(response.isEos()).toBe(true)
        expect(response.offset).toBe(22)
    })

    it('response fails at CharStream start', () => {
        const stream = Streams.ofChars('The world is a vampire')

        const parser = C.string('That')
        const response = parser.parse(stream)

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(0)
    })

    it('response fails inside a CharStream', () => {
        const stream = Streams.ofChars('abc de')

        const parser = C.string('abc').then(C.string('fails'))
        const response = parser.parse(stream)

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(3)
    })

    it('response passes the CharStream', () => {
        const stream = Streams.ofChars('abc de')

        const parser = C.letter().or(C.char(' ')).rep().then(C.string('!!!'))
        const response = parser.parse(stream)

        expect(response.isAccepted()).toBe(false)

        // because an error has NEVER stream consumed
        expect(response.isEos()).toBe(false)
        expect(response.offset).toBe(stream.source.length)
    })

    it('response with a failed try is rejected, and offset is 0', () => {
        const stream = Streams.ofChars('abc de')

        const parser = F.try(C.string('abc').then(C.char('x'))).or(
            C.string('x'),
        )
        const response = parser.parse(stream)

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(0)
    })
})
