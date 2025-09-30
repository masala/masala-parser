import { describe, it, expect } from 'vitest'
import { GenlexEventTracer } from '../../lib/genlex/genlex-event-tracer.js'

describe('GenlexEventTracer coverage', () => {
    it('filters events outside window bounds', () => {
        const tracer = new GenlexEventTracer({ window: [10, 20] })
        tracer.emit({ type: 'lex-start', startChar: 5 }) // out, dropped
        tracer.emit({ type: 'lex-start', startChar: 10 }) // in
        tracer.emit({ type: 'lex-start', startChar: 19 }) // in
        tracer.emit({ type: 'lex-start', startChar: 20 }) // out (>= b), dropped

        const events = tracer.flush()
        expect(events.map((e) => e.startChar)).toEqual([10, 19])
    })

    it('excludes reject/mismatch events when includeRejects is false', () => {
        const tracer = new GenlexEventTracer({ includeRejects: false })
        tracer.emit({ type: 'grammar-reject' })
        tracer.emit({ type: 'mismatch' })
        tracer.emit({ type: 'lex-commit' })

        const events = tracer.flush()
        expect(events.map((e) => e.type)).toEqual(['lex-commit'])
    })

    it('getLastTokenMeta returns value set by setLastTokenMeta', () => {
        const tracer = new GenlexEventTracer()
        expect(tracer.getLastTokenMeta()).toBeUndefined()
        const meta = { tokenIndex: 3, startChar: 10, endChar: 12 }
        tracer.setLastTokenMeta(meta)
        expect(tracer.getLastTokenMeta()).toEqual(meta)
    })
})
