import { describe, it, expect } from 'vitest'
import { TracingGenLex } from '../../lib/genlex/tracing-genlex.js'

import { C, F, GenLex, tuple } from '../../lib/index.js'
import stream from '../../lib/stream/index.js'
import { EventTracer } from '../../lib/genlex/genlex-tracer.js'

function createClassicMinimalParser() {
    const genlex = new GenLex()
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        .map(token => token.value)
        .rep()
        .thenEos()
    return genlex.use(grammar)
}

function createTracedMinimalParser(tracer = null) {
    const genlex = new TracingGenLex(tracer)
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        .map(token => token.value)
        .rep()
        .thenEos()
    return { parser: genlex.use(grammar), tracer: genlex.tracer }
}

function createTracedSimpleParser(tracer = null) {
    const genlex = new TracingGenLex(tracer)
    const [a, b, c] = genlex.keywords(['A', 'B', 'C'])
    const grammar = a
        .then(b)
        .then(F.any().rep())
        .thenEos()
    return { parser: genlex.use(grammar), tracer: genlex.tracer }
}

function flushTypes(tracer, types) {
    return tracer.flush().filter(e => types.includes(e.type))
}

function pluck(e, fields) {
    const out = {}
    for (const k of fields) out[k] = e[k]
    return out
}

describe('Classic GenLex Tokenizer Tests', () => {
    it('parser is valid', () => {
        let parser = createClassicMinimalParser()

        const response = parser.parse(stream.ofString('A B C A C B A A C'))
        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(9)
        expect(response.value.join('')).toBe('ABCACBAAC')
    })
})

describe('Tracing GenLex Tokenizer Tests', () => {
    it('parser is valid', () => {
        const { parser } = createTracedMinimalParser()
        const response = parser.parse(stream.ofString('A B C A C B A A C'))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(9)
        expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('minimal grammar — emits lex events with metadata (no grammar-accept with F.any())', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedMinimalParser(
            tracer,
        )
        const input = 'A B C A C B A A C'
        const response = parser.parse(stream.ofString(input))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.join('')).toBe('ABCACBAAC')

        const events = boundTracer.flush()
        const commits = events.filter(e => e.type === 'lex-commit')
        const accepts = events.filter(e => e.type === 'grammar-accept')

        expect(commits.length).toBe(9)
        expect(accepts.length).toBe(0)

        const commitIdxs = commits.map(e => e.tokenIndex)
        expect(commitIdxs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])

        for (let i = 0; i < 9; i++) {
            expect(typeof commits[i].startChar).toBe('number')
            expect(typeof commits[i].endChar).toBe('number')
            expect(commits[i].startChar).toBeLessThanOrEqual(commits[i].endChar)
        }
        expect(commits[8].trailing).toBe(0)
    })

    it('parser is valid', () => {
        const { parser } = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A B CC'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(true)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('token is not valid', () => {
        const { parser } = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A B CDC'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        // expect tracer to ...
    })

    it('grammar is not valid', () => {
        const { parser } = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('A C B'))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('fails with empty string', () => {
        const { parser } = createTracedSimpleParser()
        const response = parser.parse(stream.ofString(''))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })

    it('fails with just spaces', () => {
        const { parser } = createTracedSimpleParser()
        const response = parser.parse(stream.ofString('   '))
        // TODO: to be continued
        expect(response.isAccepted()).toBe(false)
        //expect(response.value.size()).toBe(4)
        //expect(response.value.join('')).toBe('ABCACBAAC')
    })
})
