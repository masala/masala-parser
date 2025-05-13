import { Streams, C, N } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Occurrence parser', () => {
    it('should parse 5 occurrences of a digit', () => {
        let combinator = N.digit().occurrence(5)
        let response = combinator.parse(Streams.ofString('55555'))

        expect(response.value.size()).toBe(5)
    })

    it('should parse 3 occurrences of a digit followed by a number', () => {
        // we are looking for 5,5,5 then 55
        let combinator = N.digit().occurrence(3).then(N.number())
        let response = combinator.parse(Streams.ofString('55555'))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.last()).toBe(55)
    })

    it('should parse 3 occurrences of "ab"', () => {
        /**
         * Occurence with a Tuple parser
         */
        let parser = C.char('a').then(C.char('b')).occurrence(3)
        let resp = parser.parse(Streams.ofString('ababab'))

        // Expecting a structure like [['a','b'], ['a','b'], ['a','b']]
        expect(resp.isAccepted()).toBe(true)

        // Assuming the value structure holds the parsed sequence
        // This might need adjustment based on how occurrence bundles the results
        expect(resp.value.size()).toBe(6)
        expect(resp.value.at(0)).toEqual('a')
        expect(resp.value.at(1)).toEqual('b')
        expect(resp.value.at(2)).toEqual('a')
    })

    it('should fail until type resolved', () => {
        /**
         * Occurence with a Tuple parser
         */
        let parser = C.char('a').then(C.char('b')).occurrence(3)
        let resp = parser.parse(Streams.ofString('ababab'))

        // Expecting a structure like [['a','b'], ['a','b'], ['a','b']]
        expect(resp.isAccepted()).toBe(true)

        // Assuming the value structure holds the parsed sequence
        // This might need adjustment based on how occurrence bundles the results
        expect(resp.value.size()).toBe(6)

        // TODO: expected error due to dad typing #180
        // expect(resp.value.at(0).array()).toEqual('a');
    })
})
