import { describe, it, expect } from 'vitest'
import Stream from '../../lib/stream/index'
import { F, C } from '../../lib/core/index'
import { GenLex } from '../../lib'

function testParser(parser, string) {
    let stream = Stream.ofChars(string)
    let parsing = parser.parse(stream)
    return parsing
}

describe('Flow Bundle Tests', () => {
    it('subStream is ok on string stream', () => {
        const text = 'Hello World'
        const parser = F.subStream(6).then(C.string('World'))
        const response = parser.parse(Stream.ofChars(text))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(7)
    })

    it('subStream is ok on genlex stream', () => {
        const genlex = new GenLex()
        genlex.setSeparatorsParser(F.not(C.charIn('+-<>[],.')))
        genlex.keywords(['+', '-', '<', '>', '[', ']', ',', '.'])
        const grammar = F.subStream(4).drop().then(F.any().rep())
        const parser = genlex.use(grammar)
        const text = '++++ and then >>'
        const response = parser.parse(Stream.ofChars(text))

        expect(response.isAccepted()).toBe(true)
        expect(response.value.size()).toBe(2)
    })

    it('not parser should not eat offset', () => {
        const text = 'this is a line'
        const line = text + '\n'
        const eol = C.char('\n')
        const parser = F.not(eol).rep()

        let response = parser.parse(Stream.ofChars(line))
        expect(response.isAccepted()).toBe(true)
        expect(response.offset).toBe(text.length)

        const withParser = F.not(eol).rep().then(eol)
        response = withParser.parse(Stream.ofChars(line))
        expect(response.isAccepted()).toBe(true)
        expect(response.offset).toBe(line.length)
    })

    it('expect flatten result to be ok', () => {
        const string = 'foobar'
        const parser = C.char('f')
            .then(C.char('o'))
            .then(C.char('o'))
            .then(C.string('bar'))
            .array()
        const parsing = testParser(parser, string)
        expect(parsing.value).toEqual(['f', 'o', 'o', 'bar'])
    })

    it('expect returns to be ok when empty', () => {
        const string = 'some'
        const parser = F.any().rep().then(F.eos()).returns([])
        const parsing = testParser(parser, string)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual([])
    })

    it('expect startWith to start', () => {
        const string = ' world'
        const object = 'hello'
        const parser = F.startWith(object)
            .then(C.string(' world'))
            .then(F.eos().drop())
        const parsing = testParser(parser, string)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value.join('')).toBe('hello world')
    })

    it('test moveUntilFast string', () => {
        const line = Stream.ofChars('soXYZso')
        const combinator = F.moveUntil('XYZ')
        const parser = combinator.parse(line)
        expect(parser.value).toBe('so')
        expect(parser.offset).toBe(2)
    })

    it('test moveUntilFast string with include', () => {
        const line = Stream.ofChars('soXYZso')
        const combinator = F.moveUntil('XYZ', true)
        const parser = combinator.parse(line)
        expect(parser.value).toBe('soXYZ')
        expect(parser.offset).toBe(5)
    })

    it('test moveUntilFast string with continuation', () => {
        const document = 'start-detect-XYZ-continues'
        const line = Stream.ofChars(document)
        const start = C.string('start-')
        const combinator = start
            .drop()
            .then(F.moveUntil('XYZ'))
            .then(C.string('XYZ-continues').drop())
            .single()
        const parser = combinator.parse(line)
        expect(parser.value).toBe('detect-')
        expect(parser.offset).toBe(document.length)
    })

    it('test moveUntilFast array of string with continuation', () => {
        const document = 'start-detect-XYZ-continues'
        const line = Stream.ofChars(document)
        const start = C.string('start-')
        const combinator = start
            .drop()
            .then(F.moveUntil(['ABC', 'ZE', 'XYZ']))
            .then(C.string('XYZ-continues').drop())
            .single()
        const parsing = combinator.parse(line)
        expect(parsing.value).toBe('detect-')
        expect(parsing.offset).toBe(document.length)
    })

    it('test moveUntilFast array of string with include', () => {
        const document = 'start-detect-XYZ-continues'
        const line = Stream.ofChars(document)
        const start = C.string('start-')
        const combinator = start
            .drop()
            .then(F.moveUntil(['ABC', 'ZE', 'XYZ'], true))
            .then(C.string('-continues').drop())
            .single()
        const parsing = combinator.parse(line)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toBe('detect-XYZ')
        expect(parsing.offset).toBe(document.length)
    })

    it('test moveUntilFast string fails', () => {
        const document = 'start-detect-XYZ-continues'
        const line = Stream.ofChars(document)
        const start = C.string('start-')
        const combinator = start
            .drop()
            .then(F.moveUntil('EEE'))
            .then(C.string('XYZ-continues').drop())
        const parsing = combinator.parse(line)
        expect(parsing.isAccepted()).toBe(false)
    })

    it('test moveUntilFast array of string fails', () => {
        const document = 'start-detect-XYZ-continues'
        const line = Stream.ofChars(document)
        const start = C.string('start-')
        const combinator = start
            .drop()
            .then(F.moveUntil(['ABC', 'ZE', 'EEE']))
            .then(C.string('XYZ-continues').drop())
        const parsing = combinator.parse(line)
        expect(parsing.isAccepted()).toBe(false)
    })

    it('test moveUntilFast fails if array stream', () => {
        const document = ['More', 'XYZ']
        const line = Stream.ofArrays(document)
        const combinator = F.moveUntil(['ABC', 'ZE', 'XYZ'])
        expect(() => combinator.parse(line)).toThrow(
            'Input source must be a String',
        )
    })

    it('test moveUntilFastString fails if array stream', () => {
        const document = ['More', 'XYZ']
        const line = Stream.ofArrays(document)
        const combinator = F.moveUntil('XYZ')
        expect(() => combinator.parse(line)).toThrow(
            'Input source must be a String',
        )
    })

    it('test moveUntil', () => {
        const line = Stream.ofChars('I write until James appears')
        const combinator = F.moveUntil(C.string('James'))
            .then(F.any().drop())
            .single()
        const value = combinator.parse(line).value
        expect(value).toBe('I write until ')
    })

    it('test moveUntil parser, with include', () => {
        const line = Stream.ofChars('I write until James appears')
        const combinator = F.moveUntil(C.string('James'), true)
            .then(F.any().rep().drop())
            .single()
        const parsing = combinator.parse(line)
        const value = parsing.value
        expect(parsing.isAccepted()).toBe(true)
        expect(value).toBe('I write until James')
        expect(parsing.offset).toBe(line.source.length)
    })

    it('test moveUntil parser, with include and structure', () => {
        const line = Stream.ofChars('I write until James appears')
        const combinator = F.moveUntil(
            C.string('James').map((james) => ({
                structure: james,
            })),
            true,
        )
            .then(F.any().rep().drop())
            .single()
        const parsing = combinator.parse(line)
        const value = parsing.value
        expect(parsing.isAccepted()).toBe(true)
        expect(value).not.toBe('I write until James')
        expect(parsing.offset).toBe(line.source.length)
    })

    it('test moveUntil parser, with eos, not including', () => {
        const line = Stream.ofChars('I write until the end')
        const combinator = F.moveUntil(C.string('end'), false)
        const parsing = combinator.parse(line)
        const value = parsing.value
        expect(parsing.isAccepted()).toBe(true)
        expect(value).toBe('I write until the ')
        expect(parsing.offset).toBe('I write until the '.length)
    })

    it('test moveUntil parser, with eos, including', () => {
        const line = Stream.ofChars('I write until James appears')
        const combinator = F.moveUntil(C.string('appears'), true)
        const parsing = combinator.parse(line)
        const value = parsing.value
        expect(parsing.isAccepted()).toBe(true)
        expect(value).toBe('I write until James appears')
        expect(parsing.offset).toBe(line.source.length)
    })

    it('test moveUntil Not found', () => {
        const line = Stream.ofChars('I write until James appears')
        const combinator = F.moveUntil(C.string('Indiana'))
            .then(C.string('I'))
            .then(F.any().drop())
        const accepted = combinator.parse(line).isAccepted()
        expect(accepted).toBe(false)
    })

    it('test moveUntil found with failing parser', () => {
        const line = Stream.ofChars('I write until James Bond appears')
        const combinator = F.moveUntil(C.string('James')).then(
            F.dropTo(F.eos()),
        )
        const accepted = combinator.parse(line).isAccepted()
        expect(accepted).toBe(false)
    })

    it('test dropTo with string', () => {
        const line = Stream.ofChars('I write until James Bond appears')
        const combinator = F.dropTo('James')
            .then(C.string(' Bond appears'))
            .then(F.eos())
        const accepted = combinator.parse(line).isAccepted()
        expect(accepted).toBe(true)
    })

    it('test dropTo with string fail', () => {
        const line = Stream.ofChars('I write until James Bond appears')
        const combinator = F.dropTo('James')
            .then(C.string(' Bond appears'))
            .then(F.eos())
        const accepted = combinator.parse(line).isAccepted()
        expect(accepted).toBe(true)
    })

    it('test dropTo with parser', () => {
        const line = Stream.ofChars('I write until James Bond appears')
        const combinator = F.dropTo(C.string('James'))
            .then(C.string(' Bond appears'))
            .then(F.eos())
        const accepted = combinator.parse(line).isAccepted()
        expect(accepted).toBe(true)
    })

    it('test moveUntil found with more parsers', () => {
        const line = Stream.ofChars('I write until James Bond appears')
        const combinator = F.moveUntil(C.string('James'))
            .then(F.dropTo('appears'))
            .then(F.eos().drop())
            .single()
        const value = combinator.parse(line).value
        expect(value).toBe('I write until ')
    })

    it('lazy with a class', () => {
        class SomeLazyParser {
            constructor(char) {
                this.char = char
            }

            first() {
                return C.char(this.char).then(
                    this.second()
                        .opt()
                        .map((opt) => opt.orElse('')),
                )
            }

            second() {
                return C.char('b').then(F.lazy(this.first, ['a'], this))
            }
        }

        const line = Stream.ofChars('ababa')
        const combinator = new SomeLazyParser('a').first().then(F.eos().drop())
        const value = combinator.parse(line).value
        expect(value.join('')).toBe('ababa')
    })
})
