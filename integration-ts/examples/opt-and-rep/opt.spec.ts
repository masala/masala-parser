import { C, N, Tuple, Streams } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Optional parser', () => {
    it('should create an option', () => {
        const c = C.char('a').opt()
        const n = N.number()

        const mixed = c.then(n)

        const data = mixed.val('a0') as Tuple<any>
        expect(data.size()).toEqual(2)
    })

    it('should create a resolved option ', () => {
        const c = C.char('a')
            .opt()
            .map((v) => {
                return v.orElse('b')
            })
        const n = C.char('z')

        const mixed = c.then(n)
        const stream = Streams.ofString('zNOT_REACHED')

        const response = mixed.parse(stream) // not 'a', so we have 'b' as default value
        const data = response.value
        expect(data.size()).toEqual(2)
        expect(data.at(0)).toEqual('b')
        expect(response.offset).toEqual(1)
    })

    it('should merge tuple options nicely', () => {
        const tupleParser = C.char('a').then(C.char('b')).opt()
        const stringParser = C.string('!!!')

        const mixed = tupleParser.then(stringParser)

        // First case: the tuple is not here
        const data = mixed.val('!!!')
        const first = data.first()
        const last = data.last()
        expect(first.isPresent()).toBeFalsy()
        expect(last).toBe('!!!')
    })

    it('should merge void nicely', () => {
        const tupleParser = C.char('a').then(C.char('b')).drop().opt()
        const stringParser = C.string('!!!')

        const mixed = tupleParser.then(stringParser)

        // First case: the tuple is not here
        const data = mixed.val('ab!!!')
        const first = data.first()
        const last = data.last()
        expect(first.isPresent()).toBeTruthy()
        expect(last).toBe('!!!')
    })
})
