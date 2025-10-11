import { describe, it, expect } from 'vitest'
import { TracingGenLex, getSnippet } from '../../lib/genlex/tracing-genlex.js'

import stream from '../../lib/stream/index.js'

let genLexInstance = null
function ifElseParser() {
    const genLex = new TracingGenLex()
    const [_if, _else, a, b] = genLex.keywords(['if', 'else', 'A', 'B'])

    const grammar = _if.then(a).then(_else.then(b).opt()).thenEos()
    genLexInstance = genLex
    return genLex.use(grammar)
}

describe('TracingGenLex flush', () => {
    it('flush returns and clears events', () => {
        const grammar = ifElseParser()
        const input = stream.ofChar('if A else B')
        const res = grammar.parse(input)
        //expect(res.isAccepted()).toBe(true)

        const logs = genLexInstance.flush()
        const json = JSON.stringify(logs, null, 2)
        expect(logs.length).toBeGreaterThan(0)

        expect(json.includes('"type": "lex-taken"')).toBe(true)
        expect(json.includes('"type": "lex-try"')).toBe(true)
    })

    it('flush simple events', () => {
        const grammar = ifElseParser()
        const input = stream.ofChar('if A else B')
        const res = grammar.parse(input)
        expect(res.isAccepted()).toBe(true)

        const logs = genLexInstance.flushForAi()
        const json = JSON.stringify(logs, null, 2)
        expect(logs.length).toBeGreaterThan(0)

        expect(json.includes('"type": "lex-taken"')).toBe(true)
        expect(json.includes('"type": "lex-try"')).toBe(false)
    })
})
