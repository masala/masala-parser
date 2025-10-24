import { Streams, F, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

function day() {
    return C.stringIn([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
    ])
}

const string = '-MONDAY-'

function combinator() {
    return F.any().then(day()).then(F.nop()).then(F.any()).eos()
}

let stream = Streams.ofChars(string)
let parsing = combinator().parse(stream)

describe('Flow Combinators (nop, any, eos)', () => {
    it('should parse any, then day, then nop, then any, then eos', () => {
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.isEos()).toBe(true)
        // Value check depends on what eos() returns, often undefined or a special marker
        // expect(parsing.value)...
    })
})
