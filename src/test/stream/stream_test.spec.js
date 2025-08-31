import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index'

describe('Stream Tests', () => {
    it('endOfStream for empty stream', () => {
        expect(stream.ofString('').endOfStream(0)).toBe(true)
    })

    it('endOfStream for non empty stream', () => {
        expect(stream.ofString('1').endOfStream(1)).toBe(true)
    })

    it('no endOfStream for non empty stream', () => {
        expect(stream.ofString('1').endOfStream(0)).toBe(false)
    })

    it('get from stream', () => {
        expect(
            stream
                .ofString('1')
                .get(0)
                .isSuccess(),
        ).toBe(true)
    })

    it('do not get from empty stream', () => {
        expect(
            stream
                .ofString('1')
                .get(1)
                .isSuccess(),
        ).toBe(false)
    })

    it('do not get from erroneous stream', () => {
        expect(
            stream
                .ofString({
                    length: 1,
                    charAt: function() {
                        throw new Error()
                    },
                })
                .get(0)
                .isSuccess(),
        ).toBe(false)
    })
})
