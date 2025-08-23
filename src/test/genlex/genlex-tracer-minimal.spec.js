import { describe, it, expect } from 'vitest'
import { TracingGenLex } from '../../lib/genlex/tracing-genlex.js'

import { C, F, GenLex, tuple } from '../../lib/index.js'
import stream from '../../lib/stream/index.js'

function createClassicMinimalParser() {
    const genlex = new GenLex()
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        //  .debug('token')
        .map(token => token.value)
        .rep()
        .thenEos()
    return genlex.use(grammar)
}

function createTracedMinimalParser() {
    const genlex = new TracingGenLex()
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        .map(token => token.value)
        .rep()
        .thenEos()
    return genlex.use(grammar)
}

function createTracedSimpleParser() {
    const genlex = new TracingGenLex()
    const [a, b, c] = genlex.keywords(['A', 'B', 'C'])
    const grammar = a
        .then(b)
        .then(F.any().rep())
        .thenEos()
    return genlex.use(grammar)
}

describe('Classic GenLex Tokenizer Tests', () => {
    it('parser is valid', () => {
        let parser = createClassicMinimalParser()

        const response = parser.parse(stream.ofString('A B C A C B A A C'))
        console.log('>response', {
            accepted: response.isAccepted(),
        })
        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(9)
        expect(response.value.join('')).toBe('ABCACBAAC')
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

    it('parser is valid', () => {
        let parser = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A B CC'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(true)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('token is not valid', () => {
        let parser = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A B CDC'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        // expect tracer to ...
    })

    it('grammar is not valid', () => {
        let parser = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A C B'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('fails with empty string', () => {
        let parser = createTracedSimpleParser()
        const response = parser.parse(stream.ofString(''))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('fails with just spaces', () => {
        let parser = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('   '))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })
})
