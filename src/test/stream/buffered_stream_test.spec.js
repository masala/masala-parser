import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index'

describe('Buffered Stream Tests', () => {
    it('endOfStream for empty stream', () => {
        expect(stream.buffered(stream.ofString('')).endOfStream(0)).toBe(true)
    })

    it('endOfStream for non empty stream', () => {
        expect(stream.buffered(stream.ofString('1')).endOfStream(1)).toBe(true)
    })

    it('no endOfStream for non empty stream', () => {
        expect(stream.buffered(stream.ofString('1')).endOfStream(0)).toBe(false)
    })

    it('get from stream', () => {
        expect(stream.buffered(stream.ofString('1')).get(0).isSuccess()).toBe(
            true,
        )
    })

    it('do not get from empty stream', () => {
        expect(stream.buffered(stream.ofString('1')).get(1).isSuccess()).toBe(
            false,
        )
    })

    it('get from stream number 1', () => {
        expect(stream.buffered(stream.ofString('123')).get(0).success()).toBe(
            '1',
        )
    })

    it('get from stream number is cached', () => {
        const s = stream.buffered(stream.ofString('123'))
        const v = s.get(0)

        expect(s.get(0)).toBe(v)
    })
})
