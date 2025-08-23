import { describe, it, expect } from 'vitest'
import response from '../../lib/parsec/response'
import stream from '../../lib/stream/index'

describe('Response Tests', () => {
    it('response accepted', () => {
        expect(response.accept().isAccepted()).toBe(true)
    })

    it('response as a success', () => {
        expect(
            response
                .accept()
                .toTry()
                .isSuccess(),
        ).toBe(true)
    })

    it('response accepted map to accepted', () => {
        expect(
            response
                .accept()
                .map(function(a) {
                    return a
                })
                .isAccepted(),
        ).toBe(true)
    })

    it('response accepted map to return the value', () => {
        expect(
            response.accept('a').map(function(a) {
                return a
            }).value,
        ).toBe('a')
    })

    it('response accepted map to pass in response as second argument', () => {
        expect(
            response.accept('a').map(function(_, response) {
                return response
            }).value,
        ).toEqual(response.accept('a'))
    })

    it('response accepted flatMap to accepted', () => {
        expect(
            response
                .accept('a')
                .flatMap(function(a) {
                    return response.accept(a)
                })
                .isAccepted(),
        ).toBe(true)
    })

    it('response accepted flatMap knows the offset', () => {
        const responseOffset = response
            .accept('a', 'abc', 1, false)
            .flatMap(function(a, response) {
                return response.offset
            })

        expect(responseOffset).toBe(1)
    })

    it('response accepted flatMap to return the value', () => {
        expect(
            response
                .accept('a')
                .flatMap(function(a) {
                    return response.accept(a)
                })
                .isAccepted(),
        ).toBe(true)
    })

    it('response accepted flatMap to reject', () => {
        expect(
            response
                .accept()
                .flatMap(function() {
                    return response.reject()
                })
                .isAccepted(),
        ).toBe(false)
    })

    it('response rejected map to rejected', () => {
        expect(
            response
                .reject()
                .map(function(t) {
                    return t
                })
                .isAccepted(),
        ).toBe(false)
    })

    it('response rejected map callback not called', () => {
        let calls = 0
        response.reject().map(function() {
            calls++
        })
        expect(calls).toBe(0)
    })

    it('response rejected flatMap to rejected', () => {
        expect(
            response
                .reject()
                .flatMap(function() {
                    return response.accept()
                })
                .isAccepted(),
        ).toBe(false)
    })

    it('response rejected flatMap callback not called', () => {
        let calls = 0
        response.reject().flatMap(function() {
            calls++
        })
        expect(calls).toBe(0)
    })

    it('response accepted fold', () => {
        expect(
            response.accept('a').fold(function(a) {
                return a.value
            }),
        ).toBe('a')
    })

    it('fold takes a function to map the value depending on result', () => {
        let value = response.accept('a').fold(
            accept => accept.value + '-potato', // Accept has value, input, offset, consumed
            reject => reject.offset + '-tomato',
        ) // Reject has offset, consumed

        // we accept, so it should be a-potato
        expect(value).toBe('a-potato')

        value = response.reject().fold(
            accept => accept.value + '-potato',
            reject => reject.offset + '-tomato',
        )

        // we reject, so it should use the second function
        // Offset is undefined because it's up to the parser to know which offset it's parsing
        expect(value).toBe('undefined-tomato')
    })

    it('response filter accepted', () => {
        expect(
            response
                .accept('a')
                .filter(function(a) {
                    return a === 'a'
                })
                .isAccepted(),
        ).toBe(true)
    })

    it('response not filter accepted', () => {
        expect(
            response
                .accept('a')
                .filter(function(a) {
                    return a !== 'a'
                })
                .isAccepted(),
        ).toBe(false)
    })

    it('accept can be consumed', () => {
        const myStream = stream.ofString('abc')
        const acceptance = response.accept('c', myStream, 3, false)
        const consumed = acceptance.isEos()
        expect(consumed).toBe(true)
    })

    it('accept should not be yet consumed', () => {
        const myStream = stream.ofString('abc')
        expect(response.accept('b', myStream, 2, false).isEos()).toBe(false)
    })

    it('response rejected', () => {
        expect(response.reject().isAccepted()).toBe(false)
    })

    it('response rejected should not be consumed', () => {
        expect(response.reject().isEos()).toBe(false)
    })

    it('response as a failure', () => {
        expect(
            response
                .reject()
                .toTry()
                .isSuccess(),
        ).toBe(false)
    })

    it('response rejected fold', () => {
        expect(
            response.reject().fold(
                function(a) {
                    return a.value
                },
                function() {
                    return 'b'
                },
            ),
        ).toBe('b')
    })

    it('response filter rejected', () => {
        expect(
            response
                .reject()
                .filter(function() {
                    return true
                })
                .isAccepted(),
        ).toBe(false)
    })

    it('response not filter rejected', () => {
        expect(
            response
                .reject()
                .filter(function() {
                    return false
                })
                .isAccepted(),
        ).toBe(false)
    })
})
