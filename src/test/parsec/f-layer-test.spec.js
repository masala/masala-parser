import { describe, it, expect } from 'vitest'
import Streams from '../../lib/stream/index'
import { F, C } from '../../lib/parsec/index'

describe('F Layer Tests', () => {
    it('expect F.layer(parser) to work as parser with backtrak on success', () => {
        const parser = C.char('a').thenEos()
        const successInput = 'a'
        const failInput = 'b'

        const layer = F.layer(parser)

        let response = layer.parse(Streams.ofChar(successInput))

        expect(response.isAccepted()).toBe(true)
        expect(response.offset).toBe(0)

        response = layer.parse(Streams.ofChar(failInput))

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(0)
    })

    it('expect F.layer(parser).and(other) to succeed', () => {
        const first = C.char('a')
            .then(C.char('a'))
            .thenEos()
            .array()
            .map((r) => r.length)
        const second = C.string('aa').thenEos()
        const successInput = 'aa'
        const layer = F.layer(first).and(second).and(second).array()
        let response = layer.parse(Streams.ofChar(successInput))

        expect(response.isAccepted()).toBe(true)
        expect(response.value).toEqual([2, 'aa', 'aa'])
        expect(response.offset).toBe(2)
    })

    it('expect F.layer(first).and(second).and(third) to be associative', () => {
        const first = C.char('a')
            .then(C.char('a'))
            .thenEos()
            .array()
            .map((r) => r.length)
        const second = C.char('a')
            .then(C.char('a'))
            .thenEos()
            .array()
            .map((r) => r.join('-'))
        const third = C.string('aa').thenEos()
        const input = 'aa'
        const layer = F.layer(first).and(second).and(third).array()
        let response = layer.parse(Streams.ofChar(input))

        expect(response.isAccepted()).toBe(true)
        expect(response.value).toEqual([2, 'a-a', 'aa'])
        expect(response.offset).toBe(2)
    })

    it('expect F.layer(parser).and(other) to fail with second', () => {
        const first = C.char('a')
            .then(C.char('a'))
            .array()
            .thenEos()
            .map((r) => r.length)
        const second = C.string('aaFAIL').thenEos()
        const successInput = 'aa'
        const layer = F.layer(first).and(second).array()
        let response = layer.parse(Streams.ofChar(successInput))

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(0)
        expect(response.value).toBeUndefined()
    })

    it('expect F.layer(parser).and(other) to fail with first', () => {
        const first = C.char('a')
            .then(C.char('a'))
            .thenEos()
            .map((r) => r.length)
        const second = C.string('aaSUCCESS').thenEos()
        const successInput = 'aaSUCCESS'
        const layer = F.layer(first).and(second)
        let response = layer.parse(Streams.ofChar(successInput))

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(2)
        expect(response.value).toBeUndefined()
    })

    it('expect F.layer(parser).and(other) to not move on the second after first fails', () => {
        const first = C.char('a')
            .then(C.char('a'))
            .thenEos()
            .map((r) => r.length)
        let found = false
        const second = C.string('aaSUCCESS')
            .thenEos()
            .map((x) => {
                found = true
                return x
            })
        const successInput = 'aaSUCCESS'
        const layer = F.layer(first).and(second)
        let response = layer.parse(Streams.ofChar(successInput))

        expect(response.isAccepted()).toBe(false)
        expect(response.offset).toBe(2)
        expect(found).toBe(false)
    })
})
