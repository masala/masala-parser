import { describe, it, expect } from 'vitest'

import { GenLex } from '../../lib/index.js'
import stream from '../../lib/stream/index.js'

describe('GenLex Tests with nospace', () => {
    it('genlex.noSeparators() wont accept if spaces are present', () => {
        const genlex = new GenLex().noSeparator()
        const [plus, minus] = genlex.keywords(['+', '-'])
        let grammar = plus.or(minus).rep().thenEos()
        const parser = genlex.use(grammar)
        const text = '+ + - --'
        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(false)
        expect(parsing.offset).toBe(1)
    })

    it('genlex.noSeparators() will accept if spaces are NOT present', () => {
        const genlex = new GenLex().noSeparator()
        const [plus, minus] = genlex.keywords(['+', '-'])
        let grammar = plus.or(minus).rep().thenEos()
        const parser = genlex.use(grammar)
        const text = '+-+---'
        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(true)
        expect(parsing.offset).toBe(6)
    })

    it('reset with spaces with setSeparators', () => {
        let genlex = new GenLex().noSeparator()
        genlex.setSeparators('=')
        const [plus, minus] = genlex.keywords(['+', '-'])
        let grammar = plus.or(minus).rep().thenEos()
        const parser = genlex.use(grammar)
        const text = '+=-=+=='
        const parsing = parser.parse(stream.ofChars(text))

        expect(parsing.isEos()).toBe(true)
        expect(parsing.offset).toBe(3)
    })
})
