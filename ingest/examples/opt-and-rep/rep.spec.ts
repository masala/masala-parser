import { C, N, Streams } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('rep parser', () => {
    it('should create a tuple', () => {
        const tp = C.char('a').rep()
        const n = N.number()
        const mixed = tp.then(n)

        const data = mixed.val('aaa0')
        const last = data.last()
        expect(data.size()).toEqual(4)
        expect(data.at(0)).toEqual('a')
        expect(data.at(3)).toEqual(0)
        expect(last).toEqual(0)
    })
    it('should create support emptyTupleParser', () => {
        const tp = C.char('a').drop().rep()
        const n = N.number()
        const parser = tp.then(n)

        const data = parser.val('aaa100')
        expect(data.first()).toBe(100)
    })

    it('should create support TupleParser', () => {
        const n = N.number().then(C.char('/')).rep()

        const string = '1/2/3/4/5/'
        const stream = Streams.ofString(string)
        const response = n.parse(stream)
        const data = response.value

        expect(response.isAccepted()).toBeTruthy()
        expect(data.size()).toEqual(string.length)
    })

    it('rep support structure', () => {
        type Struct = {
            value: number
            separator: string
        }
        const separator = C.charIn('#/')
        const n = N.number()
            .then(separator)
            .array()
            .map(([value, separator]) => ({ value, separator }) as Struct)
            .rep()

        const string = '1#2#3/4/5/'
        const stream = Streams.ofString(string)
        const response = n.parse(stream)
        const data = response.value

        expect(response.isAccepted()).toBeTruthy()
        expect(data.size()).toEqual(string.length / 2)
        expect(data.at(0).value).toEqual(1)
        expect(data.at(0).separator).toEqual('#')
    })

    it('should rep rep', () => {
        const n = N.number().then(C.char('/')).rep().rep()

        const string = '1/2/3/4/5/'
        const stream = Streams.ofString(string)
        const response = n.parse(stream)
        const data = response.value

        expect(response.isAccepted()).toBeTruthy()
        expect(data.size()).toEqual(string.length)
    })

    it('should rep singleParser cleanly', () => {
        const n = N.digit().rep()

        const string = '12345'
        const stream = Streams.ofString(string)
        const response = n.parse(stream)
        const data = response.value

        expect(response.isAccepted()).toBeTruthy()
        expect(data.size()).toEqual(string.length)
    })
})
