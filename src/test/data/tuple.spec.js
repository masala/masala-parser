import { describe, it, expect } from 'vitest'
import { Tuple, NEUTRAL, tuple } from '../../lib/data/tuple.js' // Added .js extension

describe('Tuple Data Type Tests', () => {
    it('empty tuple', () => {
        expect(tuple().isEmpty()).toBe(true)
    })

    it('non empty tuple', () => {
        expect(tuple().append(1).isEmpty()).toBe(false)
    })

    it('initiated tuple', () => {
        expect(tuple([2, 4, 6]).value).toEqual([2, 4, 6])
    })

    it('retrieve non empty array', () => {
        expect(new Tuple([1, 2]).array()).toEqual([1, 2])
    })

    it('retrieve joined characters array', () => {
        expect(new Tuple(['1', '2']).join('')).toBe('12')
    })

    it('tuple size', () => {
        const myTuple = new Tuple([1, 2, 3, 4])
        expect(myTuple.size()).toBe(4)
    })

    it('undefined tuple is empty', () => {
        let t = new Tuple()
        expect(t.size()).toBe(0)
        t = t.append(2)
        expect(t.value).toEqual([2])
    })

    it('single is returning the first element of the tuple', () => {
        const l = new Tuple([1, 2])
        expect(l.single()).toBe(1)
    })

    it('NEUTRAL is not added to the tuple', () => {
        let v = NEUTRAL
        let vTuple = tuple().append(NEUTRAL)
        expect(vTuple.size()).toBe(0)
        vTuple = vTuple.append(v).append(3).append(v).append(5)
        expect(vTuple.size()).toBe(2)
        expect(vTuple.array()).toEqual([3, 5])
    })

    it('tuple and NEUTRAL can be added in a Tuple', () => {
        const flat = new Tuple([2, 4, 5])
        const result = tuple()
            .append(NEUTRAL)
            .append(flat)
            .append(1)
            .append(NEUTRAL)
        expect(result).toEqual(new Tuple([2, 4, 5, 1]))
    })

    it('empty tuple append to empty tuple is an empty tuple', () => {
        const result = tuple().append(tuple())
        expect(result).toEqual(tuple())
    })

    it('last() returns the last element', () => {
        const result = new Tuple([2, 4, 6]).last()
        expect(result).toBe(6)
    })

    it('first() returns the first element', () => {
        const result = new Tuple([2, 4, 6]).first()
        expect(result).toBe(2)
    })

    it('at returns the value at index', () => {
        const result = new Tuple([2, 4, 6])
        expect(result.at(1)).toBe(4)
    })

    // Tests for map function
    it('map applies function to each element', () => {
        const original = new Tuple([1, 2, 3])
        const doubled = original.map((x) => x * 2)
        expect(doubled.array()).toEqual([2, 4, 6])
        expect(doubled).toBeInstanceOf(Tuple)
    })

    it('map returns new Tuple instance', () => {
        const original = new Tuple([1, 2, 3])
        const mapped = original.map((x) => x)
        expect(mapped).not.toBe(original)
        expect(mapped).toBeInstanceOf(Tuple)
    })

    it('map on empty tuple returns empty tuple', () => {
        const empty = new Tuple([])
        const mapped = empty.map((x) => x * 2)
        expect(mapped.isEmpty()).toBe(true)
        expect(mapped.array()).toEqual([])
    })

    it('map with string transformation', () => {
        const numbers = new Tuple([1, 2, 3])
        const strings = numbers.map((x) => `num_${x}`)
        expect(strings.array()).toEqual(['num_1', 'num_2', 'num_3'])
    })

    it('map with object transformation', () => {
        const numbers = new Tuple([1, 2, 3])
        const objects = numbers.map((x) => ({ value: x, doubled: x * 2 }))
        expect(objects.array()).toEqual([
            { value: 1, doubled: 2 },
            { value: 2, doubled: 4 },
            { value: 3, doubled: 6 },
        ])
    })

    it('map preserves original tuple unchanged', () => {
        const original = new Tuple([1, 2, 3])
        const originalArray = [...original.value]
        original.map((x) => x * 2)
        expect(original.value).toEqual(originalArray)
    })

    it('map with index parameter', () => {
        const tuple = new Tuple(['a', 'b', 'c'])
        const withIndex = tuple.map((item, index) => `${index}:${item}`)
        expect(withIndex.array()).toEqual(['0:a', '1:b', '2:c'])
    })
})
