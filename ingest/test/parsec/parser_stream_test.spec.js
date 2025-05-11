import { describe, it, expect } from 'vitest';
import stream from '../../lib/stream/index';
import C from '../../lib/parsec/chars-bundle';
import N from '../../lib/parsec/numbers-bundle';
import Streams from "../../lib/stream";
import unit from "../../lib/data/unit";

function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}

describe('Parser Stream Tests', () => {
    it('endOfStream for empty stream', () => {
        const p = C.char(' ').optrep().thenRight(N.number());
        expect(
            stream.ofParser(p, stream.ofString('')).endOfStream(0)
        ).toBe(true);
    });

    it('endOfStream for non empty stream', () => {
        const p = C.char(' ').optrep().thenRight(N.number());
        expect(
            stream.ofParser(p, stream.ofString('1')).endOfStream(1)
        ).toBe(true);
    });

    it('no endOfStream for non empty stream', () => {
        const p = C.char(' ').optrep().thenRight(N.number());
        expect(
            stream.ofParser(p, stream.ofString('1')).endOfStream(0)
        ).toBe(false);
    });

    it('get from stream', () => {
        const p = C.char(' ').optrep().thenRight(N.number());
        expect(
            stream.ofParser(p, stream.ofString('1')).get(0).isSuccess()
        ).toBe(true);
    });

    it('do not get from empty stream', () => {
        const p = C.char(' ').optrep().thenRight(N.number());
        expect(
            stream.ofParser(p, stream.ofString('1')).get(1).isSuccess()
        ).toBe(false);
    });

    it('get from stream number 123', () => {
        const p = C.char(' ').optrep().thenRight(N.number()).single();
        expect(
            stream.ofParser(p, stream.ofString('123')).get(0).success()
        ).toBe(123);
    });

    it('Offset are found in series of numbers', () => {
        const p = N.number()
            .then(C.char(' ').optrep().drop()).single();

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'));
        // index: ^0    ^6

        const first = parserStream.get(0).success(); //>> 123
        expect(first).toBe(123);

        const second = parserStream.get(1).success(); //>> 114
        expect(second).toBe(14137);
        expect(parserStream.offsets).toEqual([0, 6, 11]);
    });

    it('failing series of numbers', () => {
        const p = N.number()
            .then(C.char(' ').optrep().drop()).single();
        const parserStream = stream.ofParser(p, stream.ofString('123   a'));
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success(); //>> 123
        expect(first).toBe(123);
        expect(parserStream.offsets).toEqual([0, 6]);

        const second = parserStream.get(1); // try 'a'
        expect(second.isFailure()).toBe(true);

        expect(parserStream.offsets).toEqual([0, 6]);
    });

    it('having correct location when success', () => {
        const p = N.number()
            .then(C.char(' ').optrep().drop()).single();

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'));
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success(); //>> 123
        expect(first).toBe(123);
        expect(parserStream.location(0)).toBe(0);

        const second = parserStream.get(1).success(); //>> 114
        expect(second).toBe(14137);
        expect(parserStream.location(1)).toBe(6);
    });

    it('searching illegal location will fail', () => {
        const p = N.number()
            .then(C.char(' ').optrep().drop()).single();

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'));
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success(); //>> 123
        expect(first).toBe(123);
        
        expect(() => parserStream.location(4)).toThrow();
    });

    it('having correct location when fail', () => {
        const p = N.number();

        const parserStream = stream.ofParser(p, stream.ofString('1234   14137'));
        //                                                index: ^0  ^4

        const first = parserStream.get(0).success(); //>> 123
        expect(first).toBe(1234);
        expect(parserStream.location(0)).toBe(0);

        parserStream.get(1); //>> fail
        expect(parserStream.location(1)).toBe(4);
    });

    it('unsafe_get can see next element', () => {
        const lower = N.number().then(spaces().opt().drop()).single();

        const lowerStream = Streams.ofString('10 12 44');
        const parserStream = Streams.ofParser(lower, lowerStream);

        parserStream.unsafeGet(0);
        const value = parserStream.unsafeGet(1);

        expect(value).toBe(12);
    });

    it('unsafe_get cannot see beyond next element', () => {
        const lower = N.number().then(spaces().opt().drop());

        const lowerStream = Streams.ofString('10 12 44');
        const parserStream = Streams.ofParser(lower, lowerStream);

        expect(() => parserStream.unsafeGet(1)).toThrow();
    });
}); 