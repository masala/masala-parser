import { describe, it, expect } from 'vitest'
import Streams from '../../lib/stream/index'
import { F, C } from '../../lib/parsec/index'

describe('Chars Bundle Tests', () => {
    it('expect (char) to be accepted', () => {
        expect(C.char('a').parse(Streams.ofChar('a'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (char) to be rejected', () => {
        expect(C.char('a').parse(Streams.ofChar('b'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect (char) to be refused', () => {
        expect(() => C.char('aa')).toThrow()
    })

    it('expect (notChar) to be accepted', () => {
        expect(C.notChar('a').parse(Streams.ofChar('b'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (notChar) to be rejected', () => {
        expect(C.notChar('a').parse(Streams.ofChar('a'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect (notChar) to be refused', () => {
        expect(() => C.notChar('aa')).toThrow()
    })

    it('expect (charNotIn) to be accepted', () => {
        expect(
            C.charNotIn('a').parse(Streams.ofChar('b'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (charNotIn) to be rejected', () => {
        expect(
            C.charNotIn('a').parse(Streams.ofChar('a'), 0).isAccepted(),
        ).toBe(false)
    })

    it('expect (charIn) to be accepted', () => {
        expect(C.charIn('a').parse(Streams.ofChar('a'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (charIn) to be rejected', () => {
        expect(C.charIn('a').parse(Streams.ofChar('b'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect (lowerCase) to be accepted', () => {
        expect(C.lowerCase().parse(Streams.ofChar('a'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (lowerCase) to be rejected', () => {
        expect(C.lowerCase().parse(Streams.ofChar('A'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect (upperCase) to be accepted', () => {
        expect(C.upperCase().parse(Streams.ofChar('A'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect (upperCase) to be rejected', () => {
        expect(C.upperCase().parse(Streams.ofChar('z'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect upper (letter) to be accepted', () => {
        expect(C.letter().parse(Streams.ofChar('A'), 0).isAccepted()).toBe(true)
    })

    it('expect lower (letter) to be accepted', () => {
        expect(C.letter().parse(Streams.ofChar('z'), 0).isAccepted()).toBe(true)
    })

    it('expect space (letter) to be rejected', () => {
        expect(C.letter().parse(Streams.ofChar(' '), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect non (letter) to be rejected', () => {
        expect(C.letter().parse(Streams.ofChar('0'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect occidental letter to be accepted', () => {
        expect(C.letter().parse(Streams.ofChar('a'), 0).isAccepted()).toBe(true)
        expect(C.letterAs().parse(Streams.ofChar('a'), 0).isAccepted()).toBe(
            true,
        )
        expect(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(Streams.ofChar('a'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(Streams.ofChar('é'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(Streams.ofChar('Б'))
                .isAccepted(),
        ).toBe(false)
        expect(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(Streams.ofChar('÷'))
                .isAccepted(),
        ).toBe(false)
    })

    it('expect occidental letters to be accepted', () => {
        expect(
            C.letters()
                .then(F.eos())
                .parse(Streams.ofChar('aéÉ'), 0)
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs()
                .then(F.eos())
                .parse(Streams.ofChar('aéÉ'), 0)
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs(C.OCCIDENTAL_LETTER)
                .parse(Streams.ofChar('a'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs(C.OCCIDENTAL_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('éA'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs(C.OCCIDENTAL_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('БAs'))
                .isAccepted(),
        ).toBe(false)
    })

    it('expect ascii letter to be accepted', () => {
        expect(
            C.letterAs(C.ASCII_LETTER)
                .parse(Streams.ofChar('a'), 0)
                .isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.ASCII_LETTER).parse(Streams.ofChar('é')).isAccepted(),
        ).toBe(false)
        expect(
            C.letterAs(C.ASCII_LETTER).parse(Streams.ofChar('Б')).isAccepted(),
        ).toBe(false)
    })

    it('expect ascii letters to be accepted', () => {
        expect(
            C.lettersAs(C.ASCII_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('a'))
                .isAccepted(),
        ).toBe(true)
    })

    it('expect utf8 letter to be accepted', () => {
        expect(
            C.letterAs(C.UTF8_LETTER).parse(Streams.ofChar('a')).isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.UTF8_LETTER).parse(Streams.ofChar('é')).isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.UTF8_LETTER).parse(Streams.ofChar('Б')).isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.UTF8_LETTER).parse(Streams.ofChar('÷')).isAccepted(),
        ).toBe(false)
    })

    it('expect utf8 letters to be accepted', () => {
        expect(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('a'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('éA'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('БAs'))
                .isAccepted(),
        ).toBe(true)
        expect(
            C.letterAs(C.UTF8_LETTER)
                .then(F.eos())
                .parse(Streams.ofChar('Б÷As'))
                .isAccepted(),
        ).toBe(false)
    })

    it('expect unknown letters to be rejected', () => {
        const line = Streams.ofChar('a')
        expect(() => {
            const combinator = C.lettersAs(Symbol('UNKNOWN')).then(F.eos())
            combinator.parse(line)
        }).toThrow()
    })

    it('expect (letters) to be accepted', () => {
        const parsing = C.letters()
            .thenLeft(F.eos())
            .single()
            .parse(Streams.ofChar('someLetters'), 0)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('someLetters')
    })

    it('expect (letters) with space to be rejected', () => {
        const parsing = C.letters()
            .then(F.eos())
            .parse(Streams.ofChar('some Letters'), 0)
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.offset).toBe(4)
    })

    it('expect (letters) with number to be rejected', () => {
        const parsing = C.letters()
            .then(F.eos())
            .parse(Streams.ofChar('some2Letters'), 0)
        expect(parsing.isAccepted()).toBe(false)
    })

    it('expect (letters) to return a string, not an array of letters', () => {
        const parsing = C.letters()
            .thenLeft(F.eos())
            .single()
            .parse(Streams.ofChar('someLetters'), 0)
        expect(parsing.value).toBe('someLetters')
    })

    it('expect (string) to be accepted', () => {
        expect(
            C.string('Hello').parse(Streams.ofChar('Hello'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (string) to be rejected', () => {
        expect(
            C.string('hello').parse(Streams.ofChar('hell'), 0).isAccepted(),
        ).toBe(false)
    })

    it('test stringIn', () => {
        let line = Streams.ofChar('James Bond')
        const combinator = C.stringIn(['The', 'James', 'Bond', 'series'])
        const value = combinator.parse(line).value
        expect(typeof value).toBe('string')
        expect(value).toBe('James')
    })

    it('test stringIn Similar', () => {
        let line = Streams.ofChar('Jack James Jane')
        const combinator = C.stringIn(['Jamie', 'Jacko', 'Jack'])
        const parsing = combinator.parse(line)
        const value = parsing.value
        expect(typeof value).toBe('string')
        expect(value).toBe('Jack')
        expect(parsing.offset).toBe('Jack'.length)
    })

    it('test stringIn one string sidecase', () => {
        let line = Streams.ofChar('James')
        const combinator = C.stringIn(['James'])
        const value = combinator.parse(line).value
        expect(typeof value).toBe('string')
        expect(value).toBe('James')
    })

    it('test stringIn empty sidecase', () => {
        let line = Streams.ofChar('James')
        const combinator = C.stringIn([]).then(F.eos())
        const parsing = combinator.parse(line)
        expect(parsing.isAccepted()).toBe(false)
    })

    it('test stringIn empty accept nothing sidecase', () => {
        let line = Streams.ofChar('')
        const combinator = C.stringIn([]).then(F.eos())
        const parsing = combinator.parse(line)
        expect(parsing.isAccepted()).toBe(true)
    })

    it('expect (notString) to be accepted', () => {
        expect(
            C.notString('**').parse(Streams.ofChar('hello'), 0).isAccepted(),
        ).toBe(true)
    })

    it('expect (notString) to be h', () => {
        expect(C.notString('**').parse(Streams.ofChar('hello'), 0).value).toBe(
            'h',
        )
    })

    it('expect (notString) to be rejected', () => {
        expect(
            C.notString('**').parse(Streams.ofChar('**hello'), 0).isAccepted(),
        ).toBe(false)
    })

    it('expect accent to be accepted', () => {
        expect(C.utf8Letter().parse(Streams.ofChar('é'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect cyriliq to be accepted', () => {
        expect(C.utf8Letter().parse(Streams.ofChar('Б'), 0).isAccepted()).toBe(
            true,
        )
        expect(C.utf8Letter().parse(Streams.ofChar('б'), 0).isAccepted()).toBe(
            true,
        )
    })

    it('expect dash to be rejected', () => {
        expect(C.utf8Letter().parse(Streams.ofChar('-'), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect "nothing" to be rejected', () => {
        expect(C.utf8Letter().parse(Streams.ofChar(''), 0).isAccepted()).toBe(
            false,
        )
    })

    it('expect emoji to be accepted', () => {
        expect(
            C.emoji().then(F.eos()).parse(Streams.ofChar('б'), 0).isAccepted(),
        ).toBe(false)
        expect(
            C.emoji().then(F.eos()).parse(Streams.ofChar('a'), 0).isAccepted(),
        ).toBe(false)
        expect(
            C.emoji()
                .then(F.eos())
                .parse(Streams.ofChar('🐵🐵✈️'), 0)
                .isAccepted(),
        ).toBe(true)
        expect(
            C.emoji().then(F.eos()).parse(Streams.ofChar('✈️'), 0).isAccepted(),
        ).toBe(true)
        expect(
            C.emoji().then(F.eos()).parse(Streams.ofChar('🥪')).isAccepted(),
        ).toBe(true)
    })

    it('expect subString to works', () => {
        let stream = Streams.ofChar('James Bond')
        let parser = C.subString(6).then(C.string('Bond'))
        const response = parser.parse(stream)
        expect(response.value.array()).toEqual(['James ', 'Bond'])
        expect(response.isEos()).toBe(true)
    })
})
