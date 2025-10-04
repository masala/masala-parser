import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index'
import { F, C, N } from '../../lib/parsec/index'

describe('Parser Extensions Tests', () => {
    it('expect (returns) to be accepted', () => {
        expect(F.returns().parse(stream.ofChar(''), 0).isAccepted()).toBe(true)
    })

    it('expect (returns) to return a given value', () => {
        expect(F.returns(123).parse(stream.ofChar(''), 0).value).toBe(123)
    })

    it('expect (returns) to be rejected', () => {
        expect(F.error().parse(stream.ofChar(''), 0).isAccepted()).toBe(false)
    })

    it('expect (lazy) to be accepted', () => {
        expect(
            F.lazy(function () {
                return F.returns()
            })
                .parse(stream.ofChar(''), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (lazy) to return a given value', () => {
        expect(
            F.lazy(function () {
                return F.returns(123)
            }).parse(stream.ofChar(''), 0).value,
        ).toBe(123)
    })

    it('expect (lazy with empty params) to return a given value', () => {
        expect(
            F.lazy(function () {
                return F.returns(123)
            }, []).parse(stream.ofChar(''), 0).value,
        ).toBe(123)
    })

    it('expect (lazy) to be rejected', () => {
        expect(
            F.lazy(function () {
                return F.error()
            })
                .parse(stream.ofChar(''), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (lazy) with a parameter to return a given value', () => {
        expect(
            F.lazy(
                function (v) {
                    return F.returns(v)
                },
                [123],
            ).parse(stream.ofChar(''), 0).value,
        ).toBe(123)
    })

    it('expect (lazy) with multiple parameters to return a given value', () => {
        expect(
            F.lazy(
                function (v1, v2) {
                    return F.returns(v1 + v2)
                },
                [10, 20],
            ).parse(stream.ofChar(''), 0).value,
        ).toBe(30)
    })

    it('expect (lazy) with unpacked parameters to fail', () => {
        let found = false
        try {
            const combinator = F.lazy((v1, v2) => F.returns(v1 + v2), 10, 20)
            combinator.parse(stream.ofChar(''), 0)
        } catch (e) {
            if (e.includes('packed into an array')) {
                found = true
            }
        }
        expect(found).toBe(true)
    })

    it('expect (error) to be rejected', () => {
        expect(F.error().parse(stream.ofChar(''), 0).isAccepted()).toBe(false)
    })

    it('expect (eos) to be accepted', () => {
        expect(F.eos().parse(stream.ofChar(''), 0).isAccepted()).toBe(true)
    })

    it('expect (eos) to be rejected', () => {
        expect(F.eos().parse(stream.ofChar('a'), 0).isAccepted()).toBe(false)
    })

    it('expect (satisfy) to be accepted', () => {
        expect(
            F.satisfy(function (v) {
                return v === 'a'
            })
                .parse(stream.ofChar('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (satisfy) to be return the right value', () => {
        expect(
            F.satisfy(function (v) {
                return v === 'a'
            }).parse(stream.ofChar('a'), 0).value,
        ).toBe('a')
    })

    it('expect (satisfy) to be return the right offset', () => {
        expect(
            F.satisfy(function (v) {
                return v === 'a'
            }).parse(stream.ofChar('a'), 0).offset,
        ).toBe(1)
    })

    it('expect (satisfy) to be rejected', () => {
        expect(
            F.satisfy(function (v) {
                return v === 'b'
            })
                .parse(stream.ofChar('a'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (doTry satisfy) to be accepted', () => {
        expect(
            F.try(
                F.satisfy(function (v) {
                    return v === 'a'
                }),
            )
                .parse(stream.ofChar('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (doTry satisfy) to be rejected', () => {
        expect(
            F.try(
                F.satisfy(function (v) {
                    return v === 'b'
                }),
            )
                .parse(stream.ofChar('a'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (digit) to be accepted', () => {
        expect(N.digit().parse(stream.ofChar('1'), 0).isAccepted()).toBe(true)
    })

    it('expect (digit) to be rejected', () => {
        expect(N.digit().parse(stream.ofChar('a'), 0).isAccepted()).toBe(false)
    })

    it('expect (number) to be accepted', () => {
        expect(N.number().parse(stream.ofChar('123'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (number) to return 123', () => {
        expect(N.number().parse(stream.ofChar('123'), 0).value).toBe(123)
    })

    it('expect negative (number) to be accepted', () => {
        expect(N.number().parse(stream.ofChar('-123'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect negative (number) to return -123', () => {
        expect(N.number().parse(stream.ofChar('-123'), 0).value).toBe(-123)
    })

    it('expect float (number) to be accepted', () => {
        expect(
            N.number().parse(stream.ofChar('123.34e-34'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect float (number) to return 123.34e-34', () => {
        expect(N.number().parse(stream.ofChar('123.34e-34'), 0).value).toBe(
            123.34e-34,
        )
    })

    it('expect (charLiteral) to be accepted', () => {
        expect(
            C.charLiteral().parse(stream.ofChar("'a'"), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (charLiteral) to return a', () => {
        expect(C.charLiteral().parse(stream.ofChar("'a'"), 0).value).toBe('a')
    })

    it('expect (charLiteral) quote to be accepted', () => {
        expect(
            C.charLiteral().parse(stream.ofChar("'\\''"), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (charLiteral) to be rejected', () => {
        expect(C.charLiteral().parse(stream.ofChar("''"), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect (stringLiteral) to be accepted', () => {
        expect(
            C.stringLiteral().parse(stream.ofChar('"a"'), 0).isAccepted(),
        ).toBe(true)
    })
})
