import { Stream, F, C } from '@masala/parser'
import { describe, it, expect } from 'vitest'

describe('Flow Combinator (not)', () => {
    it('should succeed only when the inner parser fails, without consuming input', () => {
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

        function a() {
            return C.char('a')
        }

        const inputString = 'Xabx' // X matches not(day), fails not(a), fails not(day)

        let stream = Stream.ofChars(inputString)

        let parsing1 = F.not(day()).parse(stream)
        expect(parsing1.isAccepted(), "F.not(day()) on 'X'").toBe(true)
        expect(parsing1.offset, "F.not(day()) offset on 'X'").toBe(1)

        let parsing2 = F.not(a()).parse(stream)
        expect(parsing2.isAccepted(), "F.not(a()) on 'X'").toBe(true)
        expect(parsing2.offset, "F.not(a()) offset on 'X'").toBe(1)

        let incompleteSequenceParser = F.any().then(a()).then(F.any()) // Parses 'X', then 'a', then 'b'
        let incompleteParsing = incompleteSequenceParser.parse(stream)
        expect(incompleteParsing.isAccepted()).toBe(true) // parses Xab from 'Xabx' input
        expect(incompleteParsing.offset).toBe(3) // Offset should be 3 after Xab
    })
})
