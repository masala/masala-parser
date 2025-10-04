import { describe, it, expect } from 'vitest'
import { Streams, F, C, N } from '@masala/parser'

describe('F Layer Combinators', () => {
    it('should parse alternatives using try and or', () => {
        const combinator = F.try(N.number())
            .or(C.string('hello'))
            .or(C.string('goodbye'))

        let response = combinator.parse(Streams.ofChar('goodbye'))
        expect(response.isAccepted()).toBe(true)
        // Check the value based on the expected type if needed
        // expect(response.value).toBe('goodbye');
    })

    it('should parse using F.layer and succeed when both parsers match', () => {
        const first = C.char('a').then(C.char('a')).eos()
        const second = C.string('aa').eos()

        const successInput = 'aa'
        const layer = F.layer(first).and(second)

        let layerResponse = layer.parse(Streams.ofChar(successInput))
        expect(layerResponse.isAccepted()).toBe(true)
        // Add expectation for the value if needed, depends on F.layer logic
        // e.g., expect(layerResponse.value)... depending on what F.layer returns
    })
})
