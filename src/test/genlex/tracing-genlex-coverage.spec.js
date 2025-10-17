import { describe, it, expect } from 'vitest'
import { TracingGenLex, getSnippet } from '../../lib/genlex/tracing-genlex.js'

import stream from '../../lib/stream/index.js'

describe('TracingGenLex coverage additions', () => {
    it("tokenize(string) — defaults token name to the string when name isn't provided", () => {
        const gl = new TracingGenLex()
        const tok = gl.tokenize('+')
        expect(tok.__token__name).toBe('+')

        const parser = gl.use(tok.thenEos())
        const res = parser.parse(stream.ofChars('+'))
        expect(res.isAccepted()).toBe(true)
        const tv = res.value.at(0)
        expect(tv.name).toBe('+')
        expect(tv.value).toBe('+')
    })

    it('getSnippet — returns undefined for non-string input', () => {
        const fakeInput = {}
        expect(getSnippet(fakeInput, 0)).toBeUndefined()
    })

    it('getSnippet — returns empty string when startChar is undefined', () => {
        const s = stream.ofChars('ABC')
        expect(getSnippet(s, undefined)).toBe('')
    })

    it('getSnippet — truncates when longer than maxLength', () => {
        const s = stream.ofChars('abcdefghijklmnopqr')
        expect(getSnippet(s, 0, 8)).toBe('abcdefgh...')
    })

    /*
    it('grammar-reject with missing token name — found is null', () => {
        const tracer = new EventTracer()
        const gl = new TracingGenLex(tracer)
        const a = gl.tokenize('A')

        // Provide an object without a name so foundName is undefined
        const res = a.parse(stream.ofArrays([{}]))
        expect(res.isAccepted()).toBe(false)

        const events = tracer.flush()
        const rejects = events.filter((e) => e.type === 'grammar-reject')
        expect(rejects.length).toBe(1)
        // Branch: foundName ?? null
        expect(rejects[0].found).toBeNull()
    })*/
})
