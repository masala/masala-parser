import { describe, it, expect } from 'vitest'
import fs from 'fs'
import jsonparser from '../../lib/standard/json/jsonparser.js'
import stream from '../../lib/stream/index.js'

async function sampleTest(sample) {
    const data = await fs.promises.readFile(
        './src/test/standard/json/samples/' + sample,
    )
    let result = {
        isAccepted: function () {
            return false
        },
    }

    try {
        result = jsonparser.parse(stream.ofString(data.toString()))
    } catch (e) {
        console.log(e.stack)
    }

    if (!result.isAccepted()) {
        console.log(result)
    }

    return result
}

describe('JSON Sample Tests', () => {
    it('test 1k', async () => {
        const result = await sampleTest('1k.json')
        expect(result.isAccepted()).toBe(true)
    })

    it('test 100k', async () => {
        const result = await sampleTest('100k.json')
        expect(result.isAccepted()).toBe(true)
    })
})
