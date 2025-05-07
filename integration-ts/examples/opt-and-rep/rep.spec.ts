import {C, N, Tuple, Streams} from "@masala/parser";
import {describe, it, expect} from "vitest";

describe('rep parser', () => {
    it('should create a tuple', () => {

        const tp = C.char('a').rep()
        const n = N.number()
        const mixed = tp.then(n);

        const data = mixed.val('aaa0')
        const last = data.last()
        expect(data.size()).toEqual(4)
        expect(data.at(0)).toEqual('a')
        expect(data.at(3)).toEqual(0)
        expect(last).toEqual(0)
    })
    it('should create support emptyTupleParser', () => {

        const tp = C.char('a').drop().rep()
        const n = N.number()
        const parser = tp.then(n)

        const data = parser.val('aaa100')
        expect(data.first()).toBe(100)

    })

    it('should create support TupleParser', () => {
        const n = N.number().then(C.char('/')).rep()

        const stream = Streams.ofString('1/2/3/4/5/')
        const response = n.parse(stream)
        const data = response.value
    })


})
