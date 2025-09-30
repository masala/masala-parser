import { describe, it, expect } from 'vitest'

import { leanToken, leanTuple } from '../../lib/genlex/genlex.js'

describe('GenLex lean helpers coverage', () => {
    it('leanToken — returns undefined/null unchanged', () => {
        expect(leanToken(undefined)).toBeUndefined()
        expect(leanToken(null)).toBeNull()
    })

    it('leanToken — returns non-token values as-is', () => {
        expect(leanToken(42)).toBe(42)
        const obj = { a: 1 }
        expect(leanToken(obj)).toBe(obj)
    })

    it('leanTuple — returns undefined/null unchanged', () => {
        expect(leanTuple(undefined)).toBeUndefined()
        expect(leanTuple(null)).toBeNull()
    })

    it('leanTuple — returns non-tuple values as-is', () => {
        const arr = [1, 2]
        expect(leanTuple(arr)).toBe(arr)
        const obj = { x: 1 }
        expect(leanTuple(obj)).toBe(obj)
    })
})
