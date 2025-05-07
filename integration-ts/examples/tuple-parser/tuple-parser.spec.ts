import {C, N} from "@masala/parser";
import {describe, it, expect} from "vitest";

describe('Tuple typescript integration', () => {
    it('should create mixed parser that handle first and last object', () => {

        const c = C.char('a')
        const n = N.number()
        const merge = c.then(n)

        const value = merge.val('a0')

        expect(value.first()).toBe('a')
        expect(value.last()).toBe(0)

    })
})
