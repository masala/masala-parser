import { describe, it, expect } from 'vitest'
import Stream from '../../lib/stream/index'
import { F, C } from '../../lib/core/index'

describe('moveUntil do not return a TupleParser', () => {
    it('test moveUntil returning a string when stopping at a string', () => {
        const document = 'aaXYZb'
        const line = Stream.ofChars(document)
        const combinator = F.moveUntil('XYZ')
        const parser = combinator.parse(line)
        expect(parser.value).toBe('aa')
    })

    it('test moveUntil returning a string when stopping at parser', () => {
        const document = 'aaXYZb'
        const line = Stream.ofChars(document)
        const combinator = F.moveUntil(C.string('XYZ'))
        const parser = combinator.parse(line)
        expect(parser.value).toBe('aa')
    })
})
