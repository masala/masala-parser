import { describe, it, expect } from 'vitest'
import stream from '../../lib/stream/index.js'
import jsonparser from '../../lib/standard/json/jsonparser.js'

describe('JSON Parser Tests', () => {
    it('number accepted', () => {
        expect(jsonparser.parse(stream.ofString('123')).isAccepted()).toBe(true)
    })

    it('string accepted', () => {
        expect(jsonparser.parse(stream.ofString('"123"')).isAccepted()).toBe(
            true,
        )
    })

    it('string and unrecognized item rejected', () => {
        let content = '"123" -' //'"123" -'
        expect(jsonparser.parse(stream.ofString(content)).isAccepted()).toBe(
            false,
        )
    })

    it('string and unrecognized item rejected with correct offset', () => {
        //FIXME #108
        let result
        try {
            result = jsonparser.parse(stream.ofString('["123",2,4]'))
            //console.log('Offsets >>', stream.offsets[7])
        } catch (e) {
            console.error(e)
        }

        expect(result.isEos()).toBe(true)

        //FIXME #108: Not ok with Error
        expect(result.offset).toBe(7)
    })

    it('null accepted', () => {
        expect(jsonparser.parse(stream.ofString('null')).isAccepted()).toBe(
            true,
        )
    })

    it('true accepted', () => {
        expect(jsonparser.parse(stream.ofString('true')).isAccepted()).toBe(
            true,
        )
    })

    it('false accepted', () => {
        expect(jsonparser.parse(stream.ofString('false')).isAccepted()).toBe(
            true,
        )
    })

    it('empty array accepted', () => {
        expect(jsonparser.parse(stream.ofString('[ ]')).isAccepted()).toBe(true)
    })

    it('singleton array accepted', () => {
        expect(jsonparser.parse(stream.ofString('[ 123 ]')).isAccepted()).toBe(
            true,
        )
    })

    it('multi element array accepted', () => {
        expect(
            jsonparser.parse(stream.ofString('[ 123 , 234 ]')).isAccepted(),
        ).toBe(true)
    })

    it('empty object accepted', () => {
        expect(jsonparser.parse(stream.ofString('{ }')).isAccepted()).toBe(true)
    })

    it('singleton object accepted', () => {
        expect(
            jsonparser.parse(stream.ofString('{ "a" : "v" }')).isAccepted(),
        ).toBe(true)
    })

    it('multi element object accepted', () => {
        expect(
            jsonparser
                .parse(stream.ofString('{ "a" : "v", "a" : [] }'))
                .isAccepted(),
        ).toBe(true)
    })

    it('multi level object accepted', () => {
        expect(
            jsonparser
                .parse(stream.ofString('{ "a" : "v", "b" : {"c":{"d":12} }}'))
                .isAccepted(),
        ).toBe(true)
    })
})
