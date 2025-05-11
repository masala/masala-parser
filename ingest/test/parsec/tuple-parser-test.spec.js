import { describe, it, expect } from 'vitest';
import {C} from '../../lib/parsec/index';

describe('Tuple Parser Tests', () => {
    it('expect p.first() to work', () => {
        let text = 'abc';
        let parser = C.letter().rep().first();

        expect(parser.val(text)).toBe('a');
    });

    it('expect p.last() to work', () => {
        let text = 'abc';
        let parser = C.letter().rep().last();

        expect(parser.val(text)).toBe('c');
    });

    it('expect p.at() to work', () => {
        let text = 'abc';
        let parser = C.letter().rep().map(t => t.at(2));

        expect(parser.val(text)).toBe('c');
    });

    it('expect p.array to fail if not a tupleParser', () => {
        let text = 'abc';
        let parser = C.letters().array();

        expect(() => parser.val(text)).toThrow();
    });
}); 