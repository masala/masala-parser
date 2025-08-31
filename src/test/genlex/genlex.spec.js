import { describe, it, expect } from 'vitest'
import { F, C, N } from '../../lib/parsec'
import {
    GenLex,
    getMathGenLex,
    anyToken,
    leanTuple,
} from '../../lib/genlex/genlex'
import stream from '../../lib/stream'

// Helper function from the original test file
function dateParser() {
    // Renamed from date() to avoid conflict if imported elsewhere
    return N.digits()
        .then(C.charIn(['-', '/']).returns('-')) // Standardize separator for join
        .then(N.digits())
        .then(C.charIn(['-', '/']).returns('-'))
        .then(N.digits())
        .map((dateValues) =>
            dateValues[4] > 2000 ? dateValues.reverse() : dateValues,
        )
        .map((dateArray) => dateArray.join(''))
}

describe('GenLex Tests', () => {
    it('genlex find offsets when success', () => {
        const genlex = new GenLex()
        const plus = genlex.tokenize('+')
        const minus = genlex.tokenize('-')
        let grammar = plus.or(minus).rep().thenEos()
        const parser = genlex.use(grammar)
        const text = '+ + - --'
        const parsing = parser.parse(stream.ofString(text))

        expect(parsing.isEos()).toBe(true) // Nodeunit: test.ok(parsing.isEos(), 'the parsing has reached the eos()');
        expect(parsing.offset).toBe(5) // Nodeunit: test.equal(5, parsing.offset, 'there are 5 keywords');
        expect(parsing.input.location(parsing.offset)).toBe(8) // Nodeunit: test.equal(8, parsing.input.location(parsing.offset), 'there are 8 chars')
    })

    it('genlex find offsets when fail', () => {
        const genlex = new GenLex()
        const plus = genlex.tokenize('+')
        const minus = genlex.tokenize('-')
        let grammar = plus.or(minus).rep().thenEos()
        const parser = genlex.use(grammar)
        const text = '+  +  +* --'
        const parsing = parser.parse(stream.ofString(text))

        expect(parsing.isEos()).toBe(false) // Nodeunit: test.ok(! parsing.isEos(), 'an error should have occurred');
        expect(parsing.getOffset()).toBe(3) // Nodeunit: test.equal(3, parsing.getOffset(), 'Failed at the third token');
        expect(parsing.location()).toBe(7) // Nodeunit: test.equal(7, parsing.location(), 'fail is not 3: it must be the char offset before the error');
    })

    it('expect Genlex to be constructed with spaces ', () => {
        const genlex = new GenLex()
        expect(genlex.spaces).toBeDefined() // Nodeunit: test.ok(genlex.spaces !== undefined);
        expect(genlex.definitions.length).toBe(0) // Nodeunit: test.ok(genlex.definitions.length === 0);
    })

    it('expect tokenize() to add on definition', () => {
        const genlex = new GenLex()
        genlex.tokenize(N.number(), 'number', 500)
        expect(genlex.definitions.length).toBe(1) // Nodeunit: test.ok(genlex.definitions.length === 1);
    })

    it('expect use() to sort definitions by revert priority', () => {
        const genlex = new GenLex()
        const tkNumber = genlex.tokenize(N.number(), 'number')
        const tkDate = genlex.tokenize(dateParser(), 'date', 800)
        const tkChar = genlex.tokenize(C.charLiteral(), 'char', 1200)
        let grammar = tkDate.then(tkNumber.rep().or(tkChar))

        genlex.use(grammar)
        expect(genlex.definitions[0].name).toBe('char')
        expect(genlex.definitions[2].name).toBe('date')
        expect(genlex.definitions[1].name).toBe('number')
    })

    it('expect use() to create an easy tokenizer', () => {
        const genlex = new GenLex()
        const tkNumber = genlex.tokenize(N.number(), 'number')
        let grammar = tkNumber.rep()
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString('34 23'))
        expect(parsing.isAccepted()).toBe(true)
    })

    it('GenLex can tokenize keywords', () => {
        const genlex = new GenLex()
        const plus = genlex.tokenize('+')
        let grammar = plus.rep().then(F.eos().drop())
        const parser = genlex.use(grammar)
        const text = '+++++'
        const parsing = parser.parse(stream.ofString(text))
        expect(parsing.isAccepted()).toBe(true)
    })

    it('tokenize mixes with keywords', () => {
        const genlex = new GenLex()
        const number = genlex.tokenize(N.number(), 'number')
        const plus = genlex.tokenize('+')
        let grammar = plus.or(number).rep().then(F.eos().drop())
        const parser = genlex.use(grammar)
        const text = '++77++4+'
        const parsing = parser.parse(stream.ofString(text))
        expect(parsing.isEos()).toBe(true)
    })

    it('getMathGenLex() gives a simple genlex', () => {
        const genlex = getMathGenLex()
        const number = genlex.get('number')
        let grammar = number.rep()
        const text = '15 14'
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString(text))
        const tokenValues = parsing.value.array().map(tv => tv.value)
        expect(tokenValues).toEqual([15, 14])
    })

    it('getMathGenLex can be enhanced with a parser', () => {
        const genlex = getMathGenLex()
        genlex.remove('-')
        const number = genlex.get('number')
        const tkDate = genlex.tokenize(dateParser(), 'date', 800)
        let grammar = tkDate.rep().then(number).then(F.eos())
        const text = '15-12-2018      12-02-2020   12 '
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString(text))
        expect(parsing.isAccepted()).toBe(true)
    })

    it('getMathGenLex can be enhanced with a string', () => {
        const genlex = getMathGenLex()
        const number = genlex.get('number')
        const dol = genlex.tokenize('$', 'dol')
        let grammar = number.then(dol).rep().then(F.eos())
        const text = '15 $ '
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString(text))
        expect(parsing.isEos()).toBe(true)
    })

    it('getMathGenLex can be enhanced with a string and no name', () => {
        const genlex = getMathGenLex()
        const number = genlex.get('number')
        genlex.tokenize('$')
        const dol = genlex.get('$')
        let grammar = number.then(dol).rep().then(F.eos())
        const text = '15 $ '
        const parsing = genlex.use(grammar).parse(stream.ofString(text))
        expect(parsing.isEos()).toBe(true)
    })

    it('genlex can change separators with a given string', () => {
        const genlex = getMathGenLex()
        const number = genlex.get('number')
        let grammar = number.rep().then(F.eos().drop())
        genlex.setSeparators('-')
        const text = '15-12-35--'
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString(text))
        expect(parsing.isAccepted()).toBe(true)
        const tokenValues = parsing.value.array().map(tv => tv.value)
        expect(tokenValues).toEqual([15, 12, 35])
    })

    it('genlex separators must be a string', () => {
        const genlex = getMathGenLex()
        const number = genlex.get('number')
        let grammar = number.rep().then(F.eos())
        expect(() => genlex.setSeparators(1)).toThrow()
    })

    // anyToken(genlex)
    it('anyToken parses a stream of declared keywords', () => {
        const genlex = new GenLex()
        genlex.keywords(['A', 'B', 'C'])
        const grammar = anyToken(genlex).rep().thenEos()
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString('A B C A'))
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value.array().map(tv => tv.value)).toEqual([
            'A',
            'B',
            'C',
            'A',
        ])
    })

    it('anyToken fails when next token is not recognized', () => {
        const genlex = new GenLex()
        genlex.keywords(['A', 'B'])
        const grammar = anyToken(genlex).rep().thenEos()
        const parser = genlex.use(grammar)
        const parsing = parser.parse(stream.ofString('A X'))
        expect(parsing.isAccepted()).toBe(false)
        expect(parsing.getOffset()).toBe(1)
    })

    // New tests about keywords() kind of parser and TokenValue timing
    it('keywords returns token-stream parsers (not char parsers)', () => {
        const genlex = new GenLex()
        const [a, b] = genlex.keywords(['A', 'B'])
        // Using keyword parser directly on a char stream should fail
        const direct = a.parse(stream.ofString('A'))
        expect(direct.isAccepted()).toBe(false)
        // Using within a token stream (via use) should work
        const parser = genlex.use(a.thenEos())
        const res = parser.parse(stream.ofString('A'))
        expect(res.isAccepted()).toBe(true)
        expect(res.value.at(0).value).toBe('A')
    })

    it('F.any after use yields TokenValue; keyword parser maps to raw value', () => {
        const genlex1 = new GenLex()
        genlex1.keywords(['A', 'B'])
        // F.any() should see TokenValue instances and we can map to underlying values
        const parserAny = genlex1.use(
            F.any()
                .map(tv => tv.value)
                .rep()
                .thenEos(),
        )
        const anyRes = parserAny.parse(stream.ofString('A B'))
        expect(anyRes.isAccepted()).toBe(true)
        expect(anyRes.value.array()).toEqual(['A', 'B'])

        const genlex2 = new GenLex()
        const [a] = genlex2.keywords(['A'])
        const parserA = genlex2.use(a.thenEos())
        const aRes = parserA.parse(stream.ofString('A'))
        expect(aRes.isAccepted()).toBe(true)
        // keyword parser maps TokenValue to raw token value (wrapped in a Tuple by thenEos)
        expect(aRes.value.at(0).value).toBe('A')
    })

    it('Genlex F.any yields wrapped values', () => {
        const genlex1 = new GenLex()
        const [a, b] = genlex1.keywords(['A', 'B'])
        // F.any() over the token stream should see TokenValue instances currently
        const parserAThenB = genlex1.use(F.any().rep().thenEos())
        const anyResponse = parserAThenB.parse(stream.ofString('A B'))
        expect(anyResponse.isAccepted()).toBe(true)
        const result = anyResponse.value
        expect(result.at(0).value).toEqual('A')
        expect(leanTuple(anyResponse.value)).toEqual(['A', 'B'])
    })

    it('Genlex tokenize yields wrapped values', () => {
        const genlexAB = new GenLex()
        const a = genlexAB.tokenize('A', 'a')
        const b = genlexAB.tokenize('B', 'b')
        const parserAThenB = genlexAB.use(a.then(b).thenEos())
        const response = parserAThenB.parse(stream.ofString('A B'))
        const result = response.value
        expect(response.isAccepted()).toBe(true)
        expect(result.at(0).value).toBe('A')
        expect(leanTuple(result)).toEqual(['A', 'B'])
    })

    it('Genlex keywords yields wrapped values', () => {
        const genlex1 = new GenLex()
        const [a, b] = genlex1.keywords(['A', 'B'])
        // F.any() over the token stream should see TokenValue instances currently
        const parserAThenB = genlex1.use(a.then(b).thenEos())
        const response = parserAThenB.parse(stream.ofString('A B'))
        const result = response.value

        expect(response.isAccepted()).toBe(true)
        expect(result.at(0).value).toBe('A')
        expect(leanTuple(result)).toEqual(['A', 'B'])
    })
})
