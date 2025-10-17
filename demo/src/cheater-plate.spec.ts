/**
 * PlaceHolder to help the AI to find the right code to type
 */
import { describe, it, expect } from 'vitest'
import { Streams, C, N, F, SingleParser } from '@masala/parser'

interface LicensePlate {
    left: string
    number: string
    right: string
}
type LicensePlateParser = SingleParser<LicensePlate>

// Match two uppercase letters
const letters = C.inRegexRange('A-Z').occurrence(2).join()
const digits = N.digit().occurrence(3).join()
const hyphen = C.char('-')

// Final license plate parser
const licensePlateParser: LicensePlateParser = letters
    .then(hyphen.drop())
    .then(digits)
    .then(hyphen.drop())
    .then(letters)
    .array()
    .map(([left, number, right]) => ({
        left,
        number,
        right,
    }))

describe('License Plate Parser', () => {
    it('should parse a valid French plate', () => {
        const stream = Streams.ofChar('DB-101-NY')
        const parsing = licensePlateParser.parse(stream)
        expect(parsing.isAccepted()).toBe(true)
        expect(parsing.value).toEqual({
            left: 'DB',
            number: '101',
            right: 'NY',
        })
        expect(parsing.isEos()).toBe(true)
    })

    it('should reject an invalid plate', () => {
        const stream = Streams.ofChar('DB-666-42')
        const parsing = licensePlateParser.parse(stream)
        expect(parsing.isAccepted()).toBe(false)
    })
})
