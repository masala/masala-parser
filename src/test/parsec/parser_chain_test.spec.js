import { describe, it, expect } from 'vitest';
import stream from '../../lib/stream/index';
import {F, C, N} from '../../lib/parsec/index';
import unit from "../../lib/data/unit";

function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}

describe('Parser Chain Tests', () => {
    it('expect (chain) to be accepted', () => {
        const lower = C.char('x');
        const upper = F.satisfy(val => val === 'x');
        const parser = lower.chain(upper);
        const response = parser.parse(stream.ofString('x'));
        expect(response.isAccepted()).toBe(true);
    });

    it('expect (chain) to be rejected', () => {
        const lower = C.char('x');
        const upper = F.satisfy(val => val === 'y');
        const parser = lower.chain(upper);
        const response = parser.parse(stream.ofString('x'));
        expect(response.isAccepted()).toBe(false);
    });

    it('expect (chain) to be accepted and offset to have move', () => {
        const lower = C.char('x');
        const upper = F.satisfy(val => val === 'x');
        const parser = lower.chain(upper);
        const response = parser.parse(stream.ofString('x'));
        expect(response.offset).toBe(1);
    });

    it('expect (chain) to be accepted and offset to have move more', () => {
        const lower = C.string('xyz');
        const upper = F.satisfy(val => val === 'xyz');
        const parser = lower.chain(upper.then(upper));
        const response = parser.parse(stream.ofString('xyzxyz'));
        expect(response.offset).toBe(2);
    });

    it('expect (chain) to be find back the source offset', () => {
        const lower = C.string('xyz');
        const upper = F.satisfy(val => val === 'xyz');
        const parser = lower.chain(upper.then(upper));
        const response = parser.parse(stream.ofString('xyzxyz'));
        expect(response.input.source.offsets[response.offset]).toBe(6);
    });

    it('expect (chain) to be accepted again', () => {
        const p1 = N.number().thenLeft(C.char(' ').opt());
        const p2 = F.any().then(F.any()).thenLeft(F.eos()).map(function (r) {
            return r[0] + r[1];
        });
        expect(p1.chain(p2).parse(stream.ofString('12 34'), 0).isAccepted()).toBe(true);
    });

    it('expect (chain) to return 46', () => {
        const p1 = N.number().thenLeft(C.char(' ').opt());
        const p2 = F.any().then(F.any()).thenLeft(F.eos())
            .array().map(function (r) {
                return r[0] + r[1];
            });
        expect(p1.chain(p2).parse(stream.ofString('12 34'), 0).value).toBe(46);
    });

    it('expect (chain) to add multiple numbers', () => {
        const token = N.number().then(spaces().opt().drop()).single();
        const lex = F.satisfy(number => number > 0).rep()
            .map(values => values.array().reduce((acc, n) => acc + n, 0));

        const parsing = token.chain(lex).parse(stream.ofString('10 12 44'), 0);

        expect(parsing.isEos()).toBe(true);
        expect(parsing.value).toBe(66);
    });

    it('expect (chain) to be not satisfied by upper level', () => {
        const token = N.number().then(spaces().opt().drop());
        const lex = F.satisfy(number => number > 0).rep()
            .map(values => values.array().reduce((acc, n) => acc + n, 0));

        const parsing = token.chain(lex).parse(stream.ofString('10 -12 44'), 0);

        expect(parsing.isEos()).toBe(false);
    });
}); 