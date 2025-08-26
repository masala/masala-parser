import { describe, it, expect } from 'vitest';
import { Streams, C, N, F } from '../../lib/index.js';

describe('Parser tupleMap Tests', () => {
    
    it('tupleMap applies function to each element of tuple', () => {
        const parser = C.char('a').then(C.char('b')).then(C.char('c'))
            .tupleMap(char => char.toUpperCase());
        
        const result = parser.val('abc');
        expect(result.array()).toEqual(['A', 'B', 'C']);
    });

    it('tupleMap returns new Tuple instance', () => {
        const originalParser = C.char('a').then(C.char('b'));
        const mappedParser = originalParser.tupleMap(char => char);
        
        const original = originalParser.val('ab');
        const mapped = mappedParser.val('ab');
        
        expect(mapped).not.toBe(original);
        expect(mapped).toBeInstanceOf(original.constructor);
    });

    it('tupleMap on empty tuple returns empty tuple', () => {
        const parser = C.char('a').drop().then(C.char('b').drop()).tupleMap(x => x * 2);
        const result = parser.val('ab');
        
        expect(result.isEmpty()).toBe(true);
        expect(result.array()).toEqual([]);
    });

    it('tupleMap with number transformation', () => {
        const parser = N.digit().then(N.digit()).then(N.digit())
            .tupleMap(digit => digit * 2);
        
        const result = parser.val('123');
        expect(result.array()).toEqual([2, 4, 6]);
    });

    it('tupleMap with string transformation', () => {
        const parser = C.char('a').then(C.char('b')).then(C.char('c'))
            .tupleMap(char => `char_${char}`);
        
        const result = parser.val('abc');
        expect(result.array()).toEqual(['char_a', 'char_b', 'char_c']);
    });

    it('tupleMap with object transformation', () => {
        const parser = N.digit().then(N.digit())
            .tupleMap(digit => ({ value: digit, squared: digit * digit }));
        
        const result = parser.val('23');
        expect(result.array()).toEqual([
            { value: 2, squared: 4 },
            { value: 3, squared: 9 }
        ]);
    });

    it('tupleMap preserves original parser result unchanged', () => {
        const parser = C.char('a').then(C.char('b'));
        const originalResult = parser.val('ab');
        const originalArray = [...originalResult.value];
        
        parser.tupleMap(char => char.toUpperCase()).val('ab');
        
        expect(originalResult.value).toEqual(originalArray);
    });

    it('tupleMap with complex parser chain', () => {
        const parser = C.char('a').then(C.char('b').drop()).then(C.char('c'))
            .tupleMap(char => char.toUpperCase());
        
        const result = parser.val('abc');
        expect(result.array()).toEqual(['A', 'C']); // 'b' is dropped
    });

    it('tupleMap with repetition parser', () => {
        const parser = C.char('a').rep().tupleMap(char => char.toUpperCase());
        
        const result = parser.val('aaa');
        expect(result.array()).toEqual(['A', 'A', 'A']);
    });

    it('tupleMap with optional repetition parser', () => {
        const parser = C.char('a').optrep().tupleMap(char => char.toUpperCase());
        
        const result = parser.val('aa');
        expect(result.array()).toEqual(['A', 'A']);
    });

    it('tupleMap with empty optional repetition', () => {
        const parser = C.char('a').optrep().tupleMap(char => char.toUpperCase());
        
        const result = parser.val('b');
        expect(result.isEmpty()).toBe(true);
    });

    it('tupleMap throws error when called on non-tuple parser', () => {
        const parser = C.char('a').tupleMap(char => char.toUpperCase());
        
        expect(() => parser.val('a')).toThrow('Calling tupleMap on a non tuple object');
    });

    it('tupleMap with single element tuple', () => {
        const parser = C.char('a').tupleMap(char => char.toUpperCase());
        
        expect(() => parser.val('a')).toThrow('Calling tupleMap on a non tuple object');
    });

    it('tupleMap with mixed content tuple', () => {
        const parser = C.char('a').then(N.digit()).then(C.char('c'))
            .tupleMap(item => typeof item === 'string' ? item.toUpperCase() : item * 2);
        
        const result = parser.val('a2c');
        expect(result.array()).toEqual(['A', 4, 'C']);
    });

    it('tupleMap can be chained', () => {
        const parser = C.char('a').then(C.char('b')).then(C.char('c'))
            .tupleMap(char => char.toUpperCase())
            .tupleMap(char => char.toLowerCase());
        
        const result = parser.val('abc');
        expect(result.array()).toEqual(['a', 'b', 'c']);
    });

    it('tupleMap with filter-like behavior', () => {
        const parser = C.char('a').then(C.char('b')).then(C.char('c'))
            .tupleMap(char => char === 'b' ? 'B' : char);
        
        const result = parser.val('abc');
        expect(result.array()).toEqual(['a', 'B', 'c']);
    });

    it('tupleMap works with nested tuples', () => {
        const innerParser = C.char('x').then(C.char('y'));
        const parser = innerParser.then(innerParser)
            .tupleMap(item => {
                if (item.constructor.name === 'Tuple') {
                    return item.map(char => char.toUpperCase());
                }
                return item;
            });
        
        const result = parser.val('xyxy');
        // The result is a flat tuple: ['x', 'y', 'x', 'y']
        expect(result.array()).toEqual(['x', 'y', 'x', 'y']);
    });

    it('tupleMap preserves tuple methods', () => {
        const parser = C.char('a').then(C.char('b')).then(C.char('c'))
            .tupleMap(char => char.toUpperCase());
        
        const result = parser.val('abc');
        
        expect(result.single()).toBe('A');
        expect(result.first()).toBe('A');
        expect(result.last()).toBe('C');
        expect(result.at(1)).toBe('B');
        expect(result.join('-')).toBe('A-B-C');
    });
});
