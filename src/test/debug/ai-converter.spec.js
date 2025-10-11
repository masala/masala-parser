import { describe, it, expect } from 'vitest'
import { aiConvert } from '../../lib/debug/ai-converter.js'
import smallLogs from './small-logs.json'

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
})
