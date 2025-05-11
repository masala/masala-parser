import { describe, it, expect } from 'vitest';
import stream from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';

describe('Parser Core Default Tests', () => {
    it('expect (map) to be accepted', () => {
        expect(
            C.char('a')
                .map(function(a) {
                    return a + 'b';
                })
                .parse(stream.ofString('a'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (map) to be rejected', () => {
        expect(
            C.char('a')
                .map(function(a) {
                    return a + 'b';
                })
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (map) to be return ab', () => {
        expect(
            C.char('a')
                .map(function(a) {
                    return a + 'b';
                })
                .parse(stream.ofString('a')).value
        ).toBe('ab');
    });

    it('expect (flatMap) to be accepted', () => {
        expect(
            C.char('a')
                .flatMap(function() {
                    return F.returns('b');
                })
                .parse(stream.ofString('a'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (flatMap) to be rejected', () => {
        expect(
            C.char('a')
                .flatMap(function() {
                    return F.returns('b');
                })
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (flatMap) to be return ab', () => {
        expect(
            C.char('a')
                .flatMap(function() {
                    return C.char('b');
                })
                .parse(stream.ofString('ab')).value
        ).toBe('b');
    });

    it('expect (flatMap) to be return a-b-c', () => {
        expect(
            C.char('a')
                .flatMap(aVal =>
                    C.char('b')
                        .then(C.char('c'))
                        .map(bcVal => aVal + '-' + bcVal.join('-'))
                )
                .parse(stream.ofString('abc')).value
        ).toBe('a-b-c');
    });

    it('expect (filter) to be accepted', () => {
        expect(
            C.char('a')
                .filter(a => a === 'a')
                .parse(stream.ofString('a'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (filter) to be rejected', () => {
        expect(
            C.char('a')
                .filter(a => a === 'b')
                .parse(stream.ofString('a'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (match) to be accepted', () => {
        expect(
            C.char('a').match('a').parse(stream.ofString('a')).isAccepted()
        ).toBe(true);
    });

    it('expect (match) to be rejected', () => {
        expect(
            C.char('a').match('b').parse(stream.ofString('a')).isAccepted()
        ).toBe(false);
    });

    it('expect (then) to be accepted', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('ab'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (then) to be build [a,b]', () => {
        expect(
            C.char('a').then(C.char('b')).array().parse(stream.ofString('ab')).value
        ).toEqual(['a', 'b']);
    });

    it('expect (then) left to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('cb'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (then) right to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofString('ac'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (then) to return [a,b]', () => {
        expect(
            C.char('a').then(C.char('b')).array().parse(stream.ofString('ab')).value
        ).toEqual(['a', 'b']);
    });

    it('expect (thenLeft) to be accepted', () => {
        expect(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofString('ab'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (thenLeft) to return a', () => {
        expect(
            C.char('a').thenLeft(C.char('b')).single().parse(stream.ofString('ab')).value
        ).toBe('a');
    });

    it('expect (thenLeft) to be rejected', () => {
        expect(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (thenRight) to be accepted', () => {
        expect(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofString('ab'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (thenRight) to return a', () => {
        expect(
            C.char('a').thenRight(C.char('b')).single().parse(stream.ofString('ab')).value
        ).toBe('b');
    });

    it('expect (thenRight) to be rejected', () => {
        expect(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (returns) to be accepted', () => {
        expect(
            C.char('a')
                .returns('b')
                .parse(stream.ofString('ab'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (returns) to return b', () => {
        expect(
            C.char('a').returns('b').parse(stream.ofString('ab')).value
        ).toBe('b');
    });

    it('expect (returns) to be rejected', () => {
        expect(
            C.char('a')
                .returns('b')
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (or) to be accepted', () => {
        expect(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofString('a'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (or) bis to be accepted', () => {
        expect(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofString('b'))
                .isAccepted()
        ).toBe(true);
    });

    it('expect (or) to be rejected', () => {
        expect(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofString('c'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (or) LL(1) to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .or(C.char('a'))
                .parse(stream.ofString('ac'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (or) to return a', () => {
        expect(
            C.char('a').or(C.char('b')).parse(stream.ofString('a')).value
        ).toBe('a');
    });

    it('expect (or) to return b', () => {
        expect(
            C.char('a').or(C.char('b')).parse(stream.ofString('b')).value
        ).toBe('b');
    });

    it('expect (then.or) left to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofString('ad'))
                .isAccepted()
        ).toBe(false);
    });

    it('expect (then.or) left to be consumed', () => {
        expect(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofString('ad')).consumed
        ).toBe(true);
    });

    it('expect (opt) some to accepted', () => {
        expect(
            C.char('a').opt().parse(stream.ofString('a')).isAccepted()
        ).toBe(true);
    });

    it('expect (opt) some to return some a', () => {
        expect(
            C.char('a').opt().parse(stream.ofString('a')).value.get()
        ).toBe('a');
    });

    it('expect (opt) none to accepted', () => {
        expect(
            C.char('a').opt().parse(stream.ofString('b')).isAccepted()
        ).toBe(true);
    });

    it('expect (opt) none to return none', () => {
        expect(
            C.char('a').opt().parse(stream.ofString('b')).value.isPresent()
        ).toBe(false);
    });

    it('expect (opt) to come back if fail', () => {
        expect(
            C.char('b')
                .then(C.string('aaFAIL').opt().drop())
                .then(C.string('aaab'))
                .parse(stream.ofString('baaab'))
                .value.join('')
        ).toBe('baaab');
    });

    it('expect (rep) to accepted', () => {
        expect(
            C.char('a').rep().parse(stream.ofString('a')).isAccepted()
        ).toBe(true);
    });

    it('expect (rep) to rejected', () => {
        expect(
            C.char('a').rep().parse(stream.ofString('b')).isAccepted()
        ).toBe(false);
    });

    it('expect (rep) mutiple to accepted', () => {
        expect(
            C.char('a').rep().parse(stream.ofString('aaaabbb')).isAccepted()
        ).toBe(true);
    });

    it('expect (rep) mutiple to return [a,a,a,a]', () => {
        expect(
            C.char('a').rep().parse(stream.ofString('aaaabbb')).value.array()
        ).toEqual(['a', 'a', 'a', 'a']);
    });

    it('expect (optrep) to accepted', () => {
        expect(
            C.char('a').optrep().parse(stream.ofString('a')).isAccepted()
        ).toBe(true);
    });

    it('expect (optrep) none to accepted', () => {
        expect(
            C.char('a').optrep().parse(stream.ofString('b')).isAccepted()
        ).toBe(true);
    });

    it('expect (optrep) multiple to accepted', () => {
        expect(
            C.char('a').optrep().parse(stream.ofString('aaaabbb')).isAccepted()
        ).toBe(true);
    });

    it('expect (optrep) multiple to return some [a,a,a,a]', () => {
        expect(
            C.char('a')
                .optrep()
                .parse(stream.ofString('aaaabbb'))
                .value.array()
        ).toEqual(['a', 'a', 'a', 'a']);
    });

    it('expect (optrep) to return none', () => {
        expect(
            C.char('a').optrep().parse(stream.ofString('bbb')).value.array()
        ).toEqual([]);
    });

    it('expect (optrep) to return [b,b,b]', () => {
        expect(
            C.notChar('a')
                .optrep()
                .parse(stream.ofString('bbba'))
                .value.array()
        ).toEqual(['b', 'b', 'b']);
    });
}); 