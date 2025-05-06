import { describe, it, expect } from 'vitest';
import { Tuple, NEUTRAL, tuple } from '../../lib/data/tuple.js'; // Added .js extension

describe('Tuple Data Type Tests', () => {

    // Original test: 'empty tuple'
    it('empty tuple', () => {
        expect(tuple().isEmpty()).toBe(true);
    });

    // Original test: 'non empty tuple'
    it('non empty tuple', () => {
        expect(tuple().append(1).isEmpty()).toBe(false);
    });

    // Original test: 'initiated tuple'
    it('initiated tuple', () => {
        expect(tuple([2, 4, 6]).value).toEqual([2, 4, 6]);
    });

    // Original test: 'retrieve non empty array'
    it('retrieve non empty array', () => {
        expect(new Tuple([1, 2]).array()).toEqual([1, 2]);
    });

    // Original test: 'retrieve joined characters array'
    it('retrieve joined characters array', () => {
        expect(new Tuple(['1', '2']).join('')).toBe('12');
    });

    // Original test: 'tuple size'
    it('tuple size', () => {
        const myTuple = new Tuple([1, 2, 3, 4]);
        expect(myTuple.size()).toBe(4);
    });

    // Original test: 'undefined tuple is empty'
    it('undefined tuple is empty', () => {
        let t = new Tuple();
        expect(t.size()).toBe(0);
        t = t.append(2);
        expect(t.value).toEqual([2]);
    });

    // Original test: 'single is returning the first element of the tuple'
    it('single is returning the first element of the tuple', () => {
        const l = new Tuple([1, 2]);
        expect(l.single()).toBe(1);
    });

    // Original test: 'NEUTRAL is not added to the tuple'
    it('NEUTRAL is not added to the tuple', () => {
        let v = NEUTRAL;
        let vTuple = tuple().append(NEUTRAL);
        expect(vTuple.size()).toBe(0);
        vTuple = vTuple.append(v).append(3).append(v).append(5);
        expect(vTuple.size()).toBe(2);
        expect(vTuple.array()).toEqual([3, 5]);
    });

    // Original test: 'tuple and NEUTRAL can be added in a Tuple'
    it('tuple and NEUTRAL can be added in a Tuple', () => {
        const flat = new Tuple([2, 4, 5]);
        const result = tuple().append(NEUTRAL).append(flat).append(1).append(NEUTRAL);
        expect(result).toEqual(new Tuple([2, 4, 5, 1]));
    });

    // Original test: 'empty tuple append to empty tuple is an empty tuple'
    it('empty tuple append to empty tuple is an empty tuple', () => {
        const result = tuple().append(tuple());
        expect(result).toEqual(tuple());
    });

    // Original test: 'last() returns the last element'
    it('last() returns the last element', () => {
        const result = new Tuple([2, 4, 6]).last();
        expect(result).toBe(6);
    });

    // Original test: 'first() returns the first element'
    it('first() returns the first element', () => {
        const result = new Tuple([2, 4, 6]).first();
        expect(result).toBe(2);
    });

    // Original test: 'at returns the value at index'
    it('at returns the value at index', () => {
        const result = new Tuple([2, 4, 6]);
        expect(result.at(1)).toBe(4);
    });
}); 