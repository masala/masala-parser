import { describe, it, expect } from 'vitest'
import { frontMatterParser } from '../lib/front-matter.js'
import { Streams } from '@masala/parser'

describe('Front Matter Parser', () => {
    it('should parse a single line of front matter', () => {
        const input = Streams.ofString('title: My Document\n')
        const result = frontMatterParser.parse(input)
        expect(result.isAccepted()).toBe(true)
        expect(result.value).toEqual([{ name: 'title', value: 'My Document' }])
    })

    it('should parse multiple lines of front matter', () => {
        const input = Streams.ofString(`title: My Document
author: John Doe
date: 2024-03-20
`)
        const result = frontMatterParser.parse(input)
        expect(result.isAccepted()).toBe(true)
        expect(result.value).toEqual([
            { name: 'title', value: 'My Document' },
            { name: 'author', value: 'John Doe' },
            { name: 'date', value: '2024-03-20' },
        ])
    })

    it('should handle empty values', () => {
        const input = Streams.ofString('title:\n')
        const result = frontMatterParser.parse(input)
        expect(result.isAccepted()).toBe(true)
        expect(result.value).toEqual([{ name: 'title', value: '' }])
    })

    it('should reject invalid identifiers', () => {
        const input = Streams.ofString('123title: Invalid\n')
        const result = frontMatterParser.parse(input)
        expect(result.isAccepted()).toBe(false)
    })

    it('should handle multiple newlines between entries', () => {
        const input = Streams.ofString(`title: My Document

author: John Doe

date: 2024-03-20
`)
        const result = frontMatterParser.parse(input)
        expect(result.isAccepted()).toBe(true)
        expect(result.value).toEqual([
            { name: 'title', value: 'My Document' },
            { name: 'author', value: 'John Doe' },
            { name: 'date', value: '2024-03-20' },
        ])
    })
})
