import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index'
import { F, C, N } from '../../lib/parsec/index'

describe('Parser Core Tests', () => {
    it('expect val to be a nice shortcut', () => {
        const parser = C.string('xyz')
        const val = parser.val('xyz')
        expect(val).toBe('xyz')
    })

    it('expect (map) to be accepted', () => {
        expect(
            C.char('a')
                .map(function (a) {
                    return a + 'b'
                })
                .parse(stream.ofChars('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (map) to be rejected', () => {
        expect(
            C.char('a')
                .map(function (a) {
                    return a + 'b'
                })
                .parse(stream.ofChars('b'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (map) to be return ab', () => {
        expect(
            C.char('a')
                .map(function (a) {
                    return a + 'b'
                })
                .parse(stream.ofChars('a'), 0).value,
        ).toBe('ab')
    })

    it('expect (map) to be return 5x8', () => {
        const st = stream.ofChars('5x8')
        const combinator = N.integer()
            .then(C.char('x').drop())
            .then(N.integer())
            .array()
            .map((values) => values[0] * values[1])

        expect(combinator.parse(st).value).toBe(40)
    })

    it('expect (flatMap) to be accepted', () => {
        expect(
            C.char('a')
                .flatMap(function () {
                    return F.returns('b')
                })
                .parse(stream.ofChars('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (flatMap) to be rejected', () => {
        expect(
            C.char('a')
                .flatMap(function () {
                    return F.returns('b')
                })
                .parse(stream.ofChars('b'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (flatMap) to be return ab', () => {
        expect(
            C.char('a')
                .flatMap(function () {
                    return C.char('b')
                })
                .parse(stream.ofChars('ab'), 0).value,
        ).toBe('b')
    })

    it('expect (filter) to be accepted', () => {
        expect(
            C.char('a')
                .filter(function (a) {
                    return a === 'a'
                })
                .parse(stream.ofChars('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (filter) to be rejected', () => {
        expect(
            C.char('a')
                .filter(function (a) {
                    return a === 'b'
                })
                .parse(stream.ofChars('a'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (match) to be accepted', () => {
        expect(
            C.char('a').match('a').parse(stream.ofChars('a'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (match) to be rejected', () => {
        expect(
            C.char('a').match('b').parse(stream.ofChars('a'), 0).isAccepted(),
        ).toBe(false)
    })

    it('expect (then) to be accepted', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (then) left to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofChars('cb'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (then) right to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .parse(stream.ofChars('ac'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (then) to return [a,b]', () => {
        expect(
            C.char('a').then(C.char('b')).array().parse(stream.ofChars('ab'), 0)
                .value,
        ).toEqual(['a', 'b'])
    })

    it('expect (then) to return [a,b,d]', () => {
        expect(
            C.char('a')
                .then(C.char('b').then(C.char('c').drop()).then(C.char('d')))
                .array()
                .parse(stream.ofChars('abcd'), 0).value,
        ).toEqual(['a', 'b', 'd'])
    })

    it('expect (then) to be empty with two drops', () => {
        const parser = C.char('a').drop().then(C.char('b').drop())

        const value = parser.parse(stream.ofChars('ab')).value.value

        expect(Array.isArray(value)).toBe(true)
        expect(value.length).toBe(0)
    })

    it('expect (then) to be associative', () => {
        const first = C.char('a')
            .then(C.char('b'))
            .then(C.char('c').drop())
            .then(C.char('d'))
            .array()

        const second = C.char('a')
            .then(C.char('b'))
            .then(C.char('c').drop().then(C.char('d')))
            .array()

        expect(first.parse(stream.ofChars('abcd')).value).toEqual(
            second.parse(stream.ofChars('abcd')).value,
        )
    })

    it('expect (then) to be replaced by concat', () => {
        expect(
            C.char('a')
                .concat(C.char('b'))
                .then(C.char('c').drop())
                .concat(C.char('d'))
                .array()
                .parse(stream.ofChars('abcd'), 0).value,
        ).toEqual(['a', 'b', 'd'])
    })

    it('expect (thenLeft) to be accepted', () => {
        expect(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (thenLeft) to return a', () => {
        expect(
            C.char('a')
                .thenLeft(C.char('b'))
                .single()
                .parse(stream.ofChars('ab'), 0).value,
        ).toBe('a')
    })

    it('expect (thenLeft) to be rejected', () => {
        expect(
            C.char('a')
                .thenLeft(C.char('b'))
                .parse(stream.ofChars('b'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (thenRight) to be accepted', () => {
        expect(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (thenRight) to return a', () => {
        expect(
            C.char('a')
                .thenRight(C.char('b'))
                .single()
                .parse(stream.ofChars('ab'), 0).value,
        ).toBe('b')
    })

    it('expect (thenRight) to be rejected', () => {
        expect(
            C.char('a')
                .thenRight(C.char('b'))
                .parse(stream.ofChars('b'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (drop/then) to be accepted', () => {
        expect(
            C.char('a')
                .drop()
                .then(C.char('b'))
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (drop/then) to be return b', () => {
        expect(
            C.char('a')
                .drop()
                .then(C.char('b'))
                .single()
                .parse(stream.ofChars('ab'), 0).value,
        ).toBe('b')
    })

    it('expect (then/drop) to be accepted', () => {
        expect(
            C.char('a')
                .then(C.char('b').drop())
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (drop/then) to be return a', () => {
        expect(
            C.char('a')
                .then(C.char('b').drop())
                .single()
                .parse(stream.ofChars('ab'), 0).value,
        ).toBe('a')
    })

    it('expect (eos) to be accepted at the end', () => {
        const parser = C.string('abc').eos()
        const response = parser.parse(stream.ofChars('abc'))

        expect(response.isAccepted()).toBe(true)
        expect(response.isEos()).toBe(true)
        expect(response.value).toBe('abc')
    })

    it('expect (eos) to be rejected without eating char', () => {
        const parser = C.char('a').eos()
        const response = parser.parse(stream.ofChars('ab'))

        expect(response.isAccepted()).toBe(false)
        expect(response.isEos()).toBe(false)
        expect(response.offset).toBe(1)
        expect(response.value).toBeUndefined()
    })

    it('expect rejected (eos) to be rejected keeping previous offset', () => {
        const parser = C.char('a').then(C.char('a')).eos()
        const response = parser.parse(stream.ofChars('ab is ending at 1'))

        expect(response.isAccepted()).toBe(false)
        expect(response.isEos()).toBe(false)
        expect(response.offset).toBe(1)
        expect(response.value).toBeUndefined()
    })

    it('expect (thenEos) to be accepted at the end', () => {
        expect(
            C.char('a').thenEos().parse(stream.ofChars('a')).isAccepted(),
        ).toBe(true)
    })

    it('expect (thenEos) to be rejected if not the end', () => {
        expect(
            C.char('a').thenEos().parse(stream.ofChars('abc')).isAccepted(),
        ).toBe(false)
    })

    it('expect (returns) to be accepted', () => {
        expect(
            C.char('a')
                .returns('b')
                .parse(stream.ofChars('ab'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (returns) to return b', () => {
        expect(
            C.char('a').returns('b').parse(stream.ofChars('ab'), 0).value,
        ).toBe('b')
    })

    it('expect (returns) not to eat char', () => {
        expect(
            C.char('a')
                .returns('X')
                .then(C.char('b'))
                .array()
                .parse(stream.ofChars('ab'), 0).value,
        ).toEqual(['X', 'b'])
    })

    it('expect (returns) to be rejected', () => {
        expect(
            C.char('a').returns('b').parse(stream.ofChars('b'), 0).isAccepted(),
        ).toBe(false)
    })

    it('expect (or) to be accepted', () => {
        expect(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofChars('a'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (or) to be rejected', () => {
        expect(
            C.char('a')
                .or(C.char('b'))
                .parse(stream.ofChars('c'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (or) LL(1) to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b'))
                .or(C.char('a'))
                .parse(stream.ofChars('ac'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (or) to return a', () => {
        expect(
            C.char('a').or(C.char('b')).parse(stream.ofChars('a'), 0).value,
        ).toBe('a')
    })

    it('expect (or) to return b', () => {
        expect(
            C.char('a').or(C.char('b')).parse(stream.ofChars('b'), 0).value,
        ).toBe('b')
    })

    it('expect (then.or) left to be rejected', () => {
        expect(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofChars('ad'), 0)
                .isAccepted(),
        ).toBe(false)
    })

    it('expect (then.or) left to be consumed', () => {
        expect(
            C.char('a')
                .then(C.char('b').or(C.char('c')))
                .parse(stream.ofChars('ad'), 0).consumed,
        ).toBe(true)
    })

    it('expect (opt) some to accepted', () => {
        expect(
            C.char('a').opt().parse(stream.ofChars('a'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (opt) some to return some a', () => {
        expect(
            C.char('a').opt().parse(stream.ofChars('a'), 0).value.get(),
        ).toBe('a')
    })

    it('expect (opt) none to accepted', () => {
        expect(
            C.char('a').opt().parse(stream.ofChars('b'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (opt) none to return none', () => {
        expect(
            C.char('a').opt().parse(stream.ofChars('b'), 0).value.isPresent(),
        ).toBe(false)
    })

    it('expect (rep) to accepted', () => {
        expect(
            C.char('a').rep().parse(stream.ofChars('a'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (rep) to rejected', () => {
        expect(
            C.char('a').rep().parse(stream.ofChars('b'), 0).isAccepted(),
        ).toBe(false)
    })

    it('expect (rep) mutiple to accepted', () => {
        expect(
            C.char('a').rep().parse(stream.ofChars('aaaabbb'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (rep) mutiple to return [a,a,a,a]', () => {
        expect(
            C.char('a').rep().parse(stream.ofChars('aaaabbb'), 0).value.array(),
        ).toEqual(['a', 'a', 'a', 'a'])
    })

    it('expect (optrep) to accepted', () => {
        expect(
            C.char('a').optrep().parse(stream.ofChars('a'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (optrep) none to accepted', () => {
        expect(
            C.char('a').optrep().parse(stream.ofChars('b'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (optrep) mutiple to accepted', () => {
        expect(
            C.char('a')
                .optrep()
                .parse(stream.ofChars('aaaabbb'), 0)
                .isAccepted(),
        ).toBe(true)
    })

    it('expect (optrep) mutiple to return some [a,a,a,a]', () => {
        expect(
            C.char('a')
                .optrep()
                .parse(stream.ofChars('aaaabbb'), 0)
                .value.array(),
        ).toEqual(['a', 'a', 'a', 'a'])
    })

    it('expect (optrep) to return none', () => {
        expect(
            C.char('a').optrep().parse(stream.ofChars('bbb'), 0).value.array(),
        ).toEqual([])
    })

    it('expect (optrep) to return [b,b,b]', () => {
        expect(
            C.notChar('a')
                .optrep()
                .parse(stream.ofChars('bbba'), 0)
                .value.array(),
        ).toEqual(['b', 'b', 'b'])
    })

    it('expect two (optrep) to be merged as [b,b,b,a]', () => {
        expect(
            C.char('b')
                .optrep()
                .then(C.char('a').optrep())
                .array()
                .parse(stream.ofChars('bbba'), 0).value,
        ).toEqual(['b', 'b', 'b', 'a'])
    })

    it('expect two (optrep) to return [[b,b,b],[a]] using array()', () => {
        expect(
            C.char('b')
                .optrep()
                .array()
                .then(C.char('a').optrep().array())
                .array()
                .parse(stream.ofChars('bbba'), 0).value,
        ).toEqual([['b', 'b', 'b'], ['a']])
    })

    it('expect debug() to make side effect', () => {
        const original = console.log
        let sideEffect = false

        console.log = function () {
            sideEffect = true
        }

        C.char('a').debug('found').optrep().parse(stream.ofChars('aaa'), 0)

        console.log = original
        expect(sideEffect).toBe(true)
    })

    it('expect debug(param, false) to make side effect', () => {
        const original = console.log
        let sideEffect = false

        console.log = function () {
            sideEffect = true
        }

        C.char('a')
            .debug('found', false)
            .optrep()
            .parse(stream.ofChars('aaa'), 0)

        console.log = original
        expect(sideEffect).toBe(true)
    })

    it('expect (debug) to not make side effect', () => {
        const original = console.log
        let sideEffect = false

        console.log = function () {
            sideEffect = true
        }

        C.char('a').debug('found').optrep().parse(stream.ofChars('xxxx'), 0)

        console.log = original
        expect(sideEffect).toBe(false)
    })

    it('joins a TupleParser resulting in a string', () => {
        const st = stream.ofChars('5x8')
        let combinator = F.any().rep().join('')
        expect(combinator.parse(st).value).toBe('5x8')

        combinator = F.any().rep().join('-')
        expect(combinator.parse(st).value).toBe('5-x-8')
    })

    it('fails with join() if it is not a TupleParser', () => {
        const st = stream.ofChars('5x8')
        let combinator = F.any().rep().first().join('')
        expect(() => combinator.parse(st)).toThrow()
    })
})
