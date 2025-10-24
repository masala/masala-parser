import { describe, it, expect } from 'vitest'

import { GenLex } from '../../lib/index.js'
import stream from '../../lib/stream/index.js'

describe('GenLex priorities', () => {
    it('give bad result if no priorities', () => {
        const genlex = new GenLex()
        const [one, two] = genlex.keywords(['<', '<='])
        let grammar = one.or(two).rep().thenEos()
        const parser = genlex.use(grammar)

        /**
         * '<' has priority on '<='
         * The problem here is that '<' will be picked first,
         * giving no chance to '<=' token
         **/
        const text = '<='

        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(false) // stopping at '<', not reaching '='
        expect(parsing.offset).toBe(1)
        // raw text index
        expect(parsing.input.location(parsing.offset)).toBe(1)
    })

    it('keywords respects priorities', () => {
        const genlex = new GenLex()
        const [one, two] = genlex.keywords(['<=', '<'])
        let grammar = one.or(two).rep().thenEos()
        const parser = genlex.use(grammar)

        /**
         * '<=' has priority on '<'
         * Now we start by trying  '<=' before '<'
         **/
        const text = '<='

        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(true) //  reaching '='
        expect(parsing.offset).toBe(1)
        // raw text index
        expect(parsing.input.location(parsing.offset)).toBe(2)
    })

    it('tokenize respects priorities with bad result', () => {
        const genlex = new GenLex()
        const one = genlex.tokenize('<', 'LT')
        const two = genlex.tokenize('<=', 'LTE')
        let grammar = one.or(two).rep().thenEos()
        const parser = genlex.use(grammar)

        const text = '<='

        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(false) //  reaching '='
        expect(parsing.offset).toBe(1)
        // raw text index
        expect(parsing.input.location(parsing.offset)).toBe(1)
    })

    it('tokenize respects priorities with expected result', () => {
        const genlex = new GenLex()
        const one = genlex.tokenize('<=', 'LTE')
        const two = genlex.tokenize('<', 'LT')
        let grammar = one.or(two).rep().thenEos()
        const parser = genlex.use(grammar)

        const text = '<='

        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(true) //  reaching '='
        expect(parsing.offset).toBe(1)
        // raw text index
        expect(parsing.input.location(parsing.offset)).toBe(2)
    })
})
