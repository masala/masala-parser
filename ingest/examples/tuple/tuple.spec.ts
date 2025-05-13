import { tuple } from '@masala/parser'
import { describe, expect, it } from 'vitest'

describe('Tuple typescript integration', () => {
    it('should create mixed tuple that handle first and last object', () => {
        const empty = tuple()
        const nTuple = empty.append(2)
        const mixedTuple = nTuple.append('a')
        const first = mixedTuple.first()
        const last = mixedTuple.last()
        expect(first).toBe(2)
        expect(last).toBe('a')

        const stillMixedTuple = nTuple.append('a').append('b')
        expect(stillMixedTuple.last()).toBe('b')
    })

    it('should create a same Tuple with append', () => {
        const empty = tuple()
        const nTuple = empty.append(2)
        const bigger = nTuple.append(3).append(4)
        const first = bigger.first()
        const last = bigger.last()
        expect(first).toBe(2)
        expect(last).toBe(4)
    })

    it('merges tuples', () => {
        const tuple1 = tuple([1, 2, 3])
        const tuple2 = tuple([4, 5, 6])
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(1)
        expect(merged.last()).toBe(6)
        expect(merged.at(3)).toBe(4)
    })

    it('merges tuples still mixing', () => {
        const tuple1 = tuple([1, 2, 3])
        const tuple2 = tuple(['a', 'b', 'c'])
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(1)
        expect(merged.last()).toBe('c')
    })

    it('merges empty tuples correctly', () => {
        const tuple1 = tuple()
        const tuple2 = tuple()
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(undefined)
        expect(merged.last()).toBe(undefined)
        expect(merged.isEmpty()).toBe(true)
    })

    it('merges empty tuple with different types', () => {
        const tuple1 = tuple()
        const tuple2 = tuple([4, 5, 6])
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(4)
    })

    it('merges empty tuple with different types, other order', () => {
        const tuple1 = tuple([4, 5, 6])
        const tuple2 = tuple()
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(4)
    })

    it('merges mixed tuples correctly', () => {
        type T1 = 'T1'
        type T2 = 'T2'
        const t1: T1 = 'T1'
        const t2: T2 = 'T2'

        const tuple1 = tuple().append(1).append('b')
        const tuple2 = tuple().append(t1).append(t2)
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(1)
        expect(merged.last()).toBe('T2')
    })

    it('merges empty tuple with mixed tuple', () => {
        const tuple1 = tuple()
        const tuple2 = tuple().append(1).append('b')
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(1)
        expect(merged.last()).toBe('b')
    })

    it('merges mixed tuple with empty tuple, other side', () => {
        const tuple1 = tuple().append(1).append('b')
        const tuple2 = tuple()
        const merged = tuple1.append(tuple2)
        expect(merged.first()).toBe(1)
        expect(merged.last()).toBe('b')
    })
})
