import {C, N, F} from "@masala/parser";
import {describe, it, expect} from "vitest";

describe('Tuple typescript integration', () => {
    it('should create mixed parser that handle first and last object', () => {

        const c = C.char('a')
        const n = N.number()
        const mixed = c.then(n)

        const first = mixed.first()
        const valueFirst = first.val('a0')
        expect(valueFirst).toBe('a')

        const last = mixed.last()
        const valueLast = last.val('a0')
        expect(valueLast).toBe(0)
    })

    it('should create a same parser with then', () => {
        const a = C.char('a')
        const b = C.char('b')
        const mixed = a.then(b).then(F.any().drop())

        const first = mixed.first()
        const valueFirst = first.val('ab0')
        expect(valueFirst).toBe('a')

        const last = mixed.last()
        const valueLast = last.val('ab0')
        expect(valueLast).toBe('b')
    })

    it('Appending from dropped, it should create a string parser with then', () => {
        const a = C.char('a')
        const stringsParser = F.any().drop().then(a)

        const first = stringsParser.first()
        const valueFirst = first.val('0ab')
        expect(valueFirst).toBe('a')


    })

    it('Appending from dropped, it should create a mixedParser with then', () => {
        const a = C.char('a')
        const b = N.number()
        const stringsParser = F.any().drop().then(a).then(b)

        const first = stringsParser.first()
        const valueFirst = first.val('Xa45')
        expect(valueFirst).toBe('a')

        const last = stringsParser.last()
        const valueLast = last.val('Xa45')
        expect(valueLast).toBe(45)
    })


})
