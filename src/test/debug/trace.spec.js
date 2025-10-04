import { describe, it, expect } from 'vitest'
import { C, F, Streams, createTracer } from '../../lib/index.js'
import {
    registerTrace,
    TRACE_REGISTRY,
    TRACE_META,
    TRACE_NAME_SYM,
} from '../../lib/debug/trace.js'

describe('createTracer / Parser.trace integration', () => {
    const input = `author: Nicolas\npurpose: Demo of Masala Parser\nyear: 2023\n---\n# Masala Parser rocks!`
    const eol = C.char('\n').drop()

    // Grammar (mirrors trace-test.js)
    const leftText = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
    const separator = C.char(':').trace('sep')
    const rightText = F.moveUntil(eol, true)
        .map((s) => s.split(',').flatMap((x) => x.trim()))
        .trace('rightText')

    const lineParser = leftText
        .then(separator.drop())
        .then(rightText)
        .map((tuple) => {
            const name = tuple.first()
            const values = tuple.last()
            return { name, value: values }
        })
        .trace('lineParser')

    const endParser = C.string('---').drop().then(eol).trace('end')
    const fullParser = lineParser.rep().then(endParser)

    it('logs enter/exit events for traced parsers within the window', () => {
        const start = 0
        const end = input.indexOf('---', start)
        const tracer = createTracer({
            window: [start, end],
            includeValues: true,
        })

        const options = {
            showValue: false,
            byName: {
                rightText: { showValue: true },
                sep: { showValue: false },
            },
        }

        const traced = tracer.traceAll(options)(fullParser)
        const stream = Streams.ofChar(input)
        traced.parse(stream)

        const logs = tracer.flush()

        const names = new Set(logs.map((e) => e.name).filter(Boolean))
        expect(names.has('lineParser')).toBe(true)
        expect(names.has('rightText')).toBe(true)
        // Window excludes `end` parser which starts exactly at `end`
        expect(names.has('end')).toBe(false)

        // Ensure we have exit events recorded
        expect(logs.some((e) => e.phase === 'exit')).toBe(true)
    })

    it('respects per-parser showValue overrides and includes snippets when consumed', () => {
        const start = 0
        const end = input.indexOf('---', start)
        const tracer = createTracer({
            window: [start, end],
            includeValues: true,
        })
        const options = {
            showValue: false,
            byName: {
                rightText: { showValue: true },
                sep: { showValue: false },
            },
        }
        const traced = tracer.traceAll(options)(fullParser)
        traced.parse(Streams.ofChar(input))
        const logs = tracer.flush()

        const rightTextExit = logs.find(
            (e) => e.name === 'rightText' && e.phase === 'exit' && e.accepted,
        )
        expect(rightTextExit).toBeTruthy()
        expect('value' in rightTextExit).toBe(true)
        expect(Array.isArray(rightTextExit.value)).toBe(true)

        const sepExit = logs.find(
            (e) => e.name === 'sep' && e.phase === 'exit' && e.accepted,
        )
        expect(sepExit).toBeTruthy()
        expect('value' in sepExit).toBe(false)

        // When there is consumption (end > start), snippet is present
        const withSnippet = logs.find(
            (e) => e.phase === 'exit' && e.accepted && e.end > e.start,
        )
        expect(withSnippet && typeof withSnippet.snippet === 'string').toBe(
            true,
        )
    })
})

describe('trace() and registerTrace() edge cases', () => {
    it('registerTrace: catch path is non-fatal when defineProperty throws', () => {
        const p = C.char('y')
        // preventExtensions causes defineProperty to throw on adding new prop
        Object.preventExtensions(p)
        expect(() => registerTrace(p, 'py')).not.toThrow()
        // meta is still recorded
        const meta = TRACE_META.get(p)
        expect(meta && meta.name).toBe('py')
        // property not defined due to failure
        expect(p[TRACE_NAME_SYM]).toBeUndefined()
    })
    it('registerTrace throws on invalid name and registers on valid one', () => {
        const p = C.char('x')
        expect(() => registerTrace(p, '')).toThrow(
            /name must be a non-empty string/i,
        )

        registerTrace(p, 'px')
        expect(TRACE_REGISTRY.has(p)).toBe(true)
        const meta = TRACE_META.get(p)
        expect(meta && meta.name).toBe('px')
        // decorated property present (best effort)
        expect(p[TRACE_NAME_SYM]).toBe('px')
    })

    it('trace(target) throws if target is not a Parser', () => {
        const tracer = createTracer()
        expect(() => tracer.trace({}, 'bad')).toThrow(/target is not a Parser/i)
    })

    it('trace is idempotent on same parser, returns pass-through function', () => {
        const tracer = createTracer()
        const p = C.string('ok')
        const f = tracer.trace(p, 'p')
        // pass-through: returns its argument
        expect(f(p)).toBe(p)
        // idempotent: second call should not throw
        tracer.trace(p, 'p')

        // Run once and ensure we have logs
        p.parse(Streams.ofChar('ok'))
        const logs = tracer.flush()
        expect(logs.length > 0).toBe(true)
    })

    it('includeRejects=false logs enter but not exit on rejection', () => {
        const tracer = createTracer({ window: [0, 100], includeRejects: false })
        const rejecter = C.string('Z')
        const traced = tracer.trace(rejecter, 'rej')(rejecter)
        traced.parse(Streams.ofChar('abc'))
        const logs = tracer.flush()
        const enters = logs.filter(
            (e) => e.name === 'rej' && e.phase === 'enter',
        )
        const exits = logs.filter((e) => e.name === 'rej' && e.phase === 'exit')
        expect(enters.length).toBe(1)
        expect(exits.length).toBe(0)
    })

    it('snippet=false omits snippet even when consumption occurs', () => {
        const tracer = createTracer({ window: [0, 100], snippet: false })
        const p = C.string('abc')
        const traced = tracer.trace(p, 'cons')(p)
        traced.parse(Streams.ofChar('abc'))
        const logs = tracer.flush()
        const exit = logs.find((e) => e.name === 'cons' && e.phase === 'exit')
        expect(exit).toBeTruthy()
        expect('snippet' in exit).toBe(false)
    })

    it('restore() removes wrappers and stops logging', () => {
        const tracer = createTracer({ window: [0, 100] })
        const p = C.string('x')
        tracer.trace(p, 'p')(p)
        p.parse(Streams.ofChar('x'))
        tracer.flush()

        tracer.restore()
        p.parse(Streams.ofChar('x'))
        expect(tracer.flush()).toEqual([])
    })

    it('takeSubstring: breaks early when input.get is missing (no-get path)', () => {
        const tracer = createTracer({ window: [0, 100], snippet: true })
        const p = C.string('abc')
        const traced = tracer.trace(p, 's')(p)
        // Fake input: supports location and subStreamAt for acceptance, but no get()
        const fakeInput = {
            location: (i) => i,
            subStreamAt: (arr, index) => true,
        }
        traced.parse(fakeInput, 0)
        const logs = tracer.flush()
        const exit = logs.find((e) => e.name === 's' && e.phase === 'exit')
        expect(exit).toBeTruthy()
        // snippet computed to empty string due to early break
        expect(typeof exit.snippet).toBe('string')
    })

    it('takeSubstring: pushes ellipsis when exceeding snippetMax', () => {
        const tracer = createTracer({
            window: [0, 100],
            snippet: true,
            snippetMax: 3,
        })
        const p = C.string('abcdef')
        const traced = tracer.trace(p, 'ell')(p)
        traced.parse(Streams.ofChar('abcdef'), 0)
        const logs = tracer.flush()
        const exit = logs.find((e) => e.name === 'ell' && e.phase === 'exit')
        expect(exit).toBeTruthy()
        expect(typeof exit.snippet).toBe('string')
        expect(exit.snippet.endsWith('…')).toBe(true)
    })

    it('resolvePerParserOpts: returns base when options is undefined; traceAll continues on missing meta', () => {
        const tracer = createTracer({ window: [0, 100], includeValues: true })
        const p = C.string('v').trace('pv', { showValue: false })
        // Add a dummy parser without meta to cover the continue branch
        const dummy = { parse() {} }
        TRACE_REGISTRY.add(dummy)

        // options undefined => should use base meta opts
        const traced = tracer.traceAll()(p)
        traced.parse(Streams.ofChar('v'))
        const logs = tracer.flush()
        const exit = logs.find((e) => e.name === 'pv' && e.phase === 'exit')
        expect(exit).toBeTruthy()
        // showValue: false from base meta => no value field
        expect('value' in exit).toBe(false)

        // cleanup the dummy from registry
        TRACE_REGISTRY.delete(dummy)
    })
})
