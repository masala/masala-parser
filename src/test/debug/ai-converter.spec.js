import { describe, it, expect } from 'vitest'
import { aiConvert } from '../../lib/debug/ai-converter.js'
import smallLogs from './small-logs.json'
import manyTriesLogs from './many-tries.json'

describe('AI log converter', () => {
    it('converts full logs to AI format', () => {
        const converted = aiConvert(smallLogs)

        const expected = [
            { lexTried: ['NEQ', 'GTE', 'LTE', 'NOT'] },
            { type: 'lex-taken', name: '-' },
            { grammarRejected: ['NOT', '+'] },
            { type: 'grammar-accept', name: '-' },
            { lexTried: ['NEQ', 'GTE'] },
        ]
        expect(converted).toEqual(expected)
    })

    it('should shorten long lexTried arrays', () => {
        const converted = aiConvert(manyTriesLogs)

        const expected = [{ lexTried: ['A', 'B', 'C', '...', 'X', 'Y', 'Z'] }]
        expect(converted).toEqual(expected)
    })

    it('should keep order ', () => {
        const converted = aiConvert(smallLogs)
        console.log(converted)
        /*
[
  { lexTried: [ 'NEQ', 'GTE', 'LTE', 'NOT' ] },
  { type: 'lex-taken', name: '-' },
  { grammarRejected: [ 'NOT', '+' ] },
  { type: 'grammar-accept', name: '-' },
  { lexTried: [ 'NEQ', 'GTE' ] }
]
 */
        expect(converted[0]).toEqual({ lexTried: ['NEQ', 'GTE', 'LTE', 'NOT'] })
        expect(converted[1]).toEqual({ type: 'lex-taken', name: '-' })
        expect(converted[2]).toEqual({ grammarRejected: ['NOT', '+'] })
        expect(converted[3]).toEqual({ type: 'grammar-accept', name: '-' })
        expect(converted[4]).toEqual({ lexTried: ['NEQ', 'GTE'] })
    })
})
