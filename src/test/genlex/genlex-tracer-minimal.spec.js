import { describe, it, expect } from 'vitest'
import { TracingGenLex } from '../../lib/genlex/tracing-genlex.js'

import { C, F, GenLex } from '../../lib/index.js'
import stream from '../../lib/stream/index.js'

function createClassicMinimalParser() {
    const genlex = new GenLex()
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        .debug('token')
        //.map((token) => token.value)
        .rep()
        .thenEos()
    return genlex.use(grammar)
}

function createTracedMinimalParser() {
    const genlex = new TracingGenLex()
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any().debug('token').rep().thenEos()
    return genlex.use(grammar)
}

describe('Classic GenLex Tokenizer Tests', () => {
    it('parser is valid', () => {
        let parser = createClassicMinimalParser()
        const response = parser.parse(stream.ofString('A B C A C B A A C'))
        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(9)
        expect(
            response.value
                .array()
                .map((t) => t.value)
                .join(''),
        ).toBe('ABCACBAAC')
    })
})

describe('Tracing GenLex Tokenizer Tests', () => {
    it('parser is valid', () => {
        let parser = createTracedMinimalParser()
        const response = parser.parse(stream.ofString('A B C A C B A A C'))
        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(9)
        expect(response.value.join('')).toBe('ABCACBAAC')
    })
})
