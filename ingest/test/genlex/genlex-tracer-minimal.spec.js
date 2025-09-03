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
        .map((token) => token.value)
        .rep()
        .thenEos()
    return genlex.use(grammar)
}

function createTracedMinimalParser(tracer = null) {
    const genlex = new TracingGenLex(tracer)
    genlex.keywords(['A', 'B', 'C'])
    // The grammar will collect all recognized tokens
    const grammar = F.any()
        .map((token) => token.value)
        .rep()
        .thenEos()
    return { parser: genlex.use(grammar), tracer: genlex.tracer }
}

function createTracedSimpleParser(tracer = null) {
    const genlex = new TracingGenLex(tracer)
    const [a, b, c] = genlex.keywords(['A', 'B', 'C'])
    const grammar = a.then(b).then(F.any().rep()).thenEos()
    return { parser: genlex.use(grammar), tracer: genlex.tracer }
}

function flushTypes(tracer, types) {
    return tracer.flush().filter((e) => types.includes(e.type))
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
        const { parser, tracer: boundTracer } =
            createTracedMinimalParser(tracer)
        const input = 'A B C A C B A A C'
        const response = parser.parse(stream.ofString(input))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.join('')).toBe('ABCACBAAC')

        const events = boundTracer.flush()
        const commits = events.filter((e) => e.type === 'lex-commit')
        const accepts = events.filter((e) => e.type === 'grammar-accept')

        expect(commits.length).toBe(9)
        expect(accepts.length).toBe(0)

        const commitIdxs = commits.map((e) => e.tokenIndex)
        expect(commitIdxs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])

        for (let i = 0; i < 9; i++) {
            expect(typeof commits[i].startChar).toBe('number')
            expect(typeof commits[i].endChar).toBe('number')
            expect(commits[i].startChar).toBeLessThanOrEqual(commits[i].endChar)
        }
        expect(commits[8].trailing).toBe(0)
    })

    it('simple grammar — accept: emits grammar-accept for A,B and lex-commit for all tokens', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedSimpleParser(tracer)
        const response = parser.parse(stream.ofString('A B CC'))
        expect(response.isAccepted()).toBe(true)

        const events = boundTracer.flush()
        const commits = events.filter((e) => e.type === 'lex-commit')
        const accepts = events.filter((e) => e.type === 'grammar-accept')

        expect(commits.length).toBe(4)
        expect(accepts.length).toBe(2)
        expect(accepts.map((e) => e.name)).toEqual(['A', 'B'])
        expect(accepts.map((e) => e.tokenIndex)).toEqual([0, 1])
        expect(commits.map((e) => e.tokenIndex)).toEqual([0, 1, 2, 3])
    })

    it('simple grammar — grammar-reject when next token mismatches (A C B)', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedSimpleParser(tracer)
        const response = parser.parse(stream.ofString('A C B'))
        expect(response.isAccepted()).toBe(false)

        const events = boundTracer.flush()
        const accepts = events.filter((e) => e.type === 'grammar-accept')
        const rejects = events.filter((e) => e.type === 'grammar-reject')
        const commits = events.filter((e) => e.type === 'lex-commit')

        expect(accepts.map((e) => e.name)).toEqual(['A'])
        expect(commits.length).toBe(2)
        expect(rejects.length).toBe(1)
        expect(RejectsFields(rejects[0])).toEqual({ expected: 'B', found: 'C' })
        expect(rejects[0].tokenIndex).toBe(1)
    })

    it('simple grammar — lex-fail when an unknown token is encountered (A B CDC)', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedSimpleParser(tracer)
        const response = parser.parse(stream.ofString('A B CDC'))
        expect(response.isAccepted()).toBe(false)

        const events = boundTracer.flush()
        const fails = events.filter((e) => e.type === 'lex-fail')
        const commits = events.filter((e) => e.type === 'lex-commit')
        const accepts = events.filter((e) => e.type === 'grammar-accept')

        expect(accepts.map((e) => e.name)).toEqual(['A', 'B'])
        expect(commits.length).toBe(3)
        expect(fails.length).toBe(1)
    })

    it('simple grammar — grammar-eos on empty input', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedSimpleParser(tracer)
        const response = parser.parse(stream.ofString(''))
        expect(response.isAccepted()).toBe(false)

        const events = boundTracer.flush()
        const eos = events.filter((e) => e.type === 'grammar-eos')
        const lex = events.filter((e) => e.type.startsWith('lex-'))

        expect(eos.length).toBe(1)
        expect(eos[0].expected).toBe('A')
        expect(lex.length).toBe(0)
    })

    it('simple grammar — spaces-only: emits lex-fail and grammar-eos', () => {
        const tracer = new EventTracer()
        const { parser, tracer: boundTracer } = createTracedSimpleParser(tracer)
        const response = parser.parse(stream.ofString('   '))
        expect(response.isAccepted()).toBe(false)

        const events = boundTracer.flush()
        const starts = events.filter((e) => e.type === 'lex-start')
        const fails = events.filter((e) => e.type === 'lex-fail')
        const eos = events.filter((e) => e.type === 'grammar-eos')

        expect(starts.length).toBe(1)
        expect(fails.length).toBe(1)
        expect(eos.length).toBe(1)
        expect(eos[0].expected).toBe('A')
    })

    it('keywords() in TracingGenLex yields TokenValue in token stream', () => {
        const genlex = new TracingGenLex()
        const [a] = genlex.keywords(['A'])
        const parser = genlex.use(a.thenEos())
        const res = parser.parse(stream.ofString('A'))
        expect(res.isAccepted()).toBe(true)
        const tok = res.value.at(0)
        expect(typeof tok).toBe('object')
        expect(tok.name).toBe('A')
        expect(tok.value).toBe('A')
    })

    it('tokenize() in TracingGenLex yields TokenValue in token stream', () => {
        const genlex = new TracingGenLex()
        const plus = genlex.tokenize('+', 'plus')
        const parser = genlex.use(plus.thenEos())
        const res = parser.parse(stream.ofString('+'))
        expect(res.isAccepted()).toBe(true)
        const tok = res.value.at(0)
        expect(typeof tok).toBe('object')
        expect(tok.name).toBe('plus')
        expect(tok.value).toBe('+')
    })

    it('F.any() sees TokenValue with tracing and can map to raw values', () => {
        const genlex = new TracingGenLex()
        genlex.keywords(['A', 'B'])
        const parser = genlex.use(
            F.any()
                .map((tv) => tv.value)
                .rep()
                .thenEos(),
        )
        const res = parser.parse(stream.ofString('A B'))
        expect(res.isAccepted()).toBe(true)
        expect(res.value.array()).toEqual(['A', 'B'])
    })
})

function RejectsFields(e) {
    return { expected: e.expected, found: e.found }
}
