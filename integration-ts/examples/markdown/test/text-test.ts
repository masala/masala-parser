import { assertDeepEquals, assertEquals, assertTrue } from '../../../assert.js'
import { paragraph } from '../lib/text-parser.js'
import { Streams } from '@masala/parser'

export const textTests = {
    'test empty text': function () {
        let actual = paragraph().val('')

        assertTrue(actual === undefined, 'blank text refused')

        actual = paragraph().val('   ')
        let expected = { type: 'paragraph', content: [] }
        assertDeepEquals(expected, actual, 'blank line are filtered')
    },

    'test simple text': function () {
        let actual = paragraph().val('text')
        let expected = {
            type: 'paragraph',
            content: [{ type: 'text', text: 'text' }],
        }
        assertDeepEquals(expected, actual)

        actual = paragraph().val('  text ')
        assertDeepEquals(actual, expected)
    },

    'test italic': function () {
        let actual = paragraph().val('*text*')
        let expected = {
            type: 'paragraph',
            content: [{ type: 'italic', text: 'text' }],
        }
        assertDeepEquals(actual, expected)
    },

    'test bold': function () {
        let actual = paragraph().val('**text**')
        let expected = {
            type: 'paragraph',
            content: [{ type: 'bold', text: 'text' }],
        }
        assertDeepEquals(actual, expected)
    },

    'test combined format': function () {
        let actual = paragraph().val('  *italic* text **then bold** ')
        let expected = {
            type: 'paragraph',
            content: [
                { type: 'italic', text: 'italic' },
                { type: 'text', text: 'text' },
                { type: 'bold', text: 'then bold' },
            ],
        }

        assertDeepEquals(actual, expected)
    },

    'single \\n must be translated as space': function () {
        let actual = paragraph().val(
            '  *italic* text\n**then bold**\nthen *final italic text* ',
        )
        let expected = {
            type: 'paragraph',
            content: [
                { type: 'italic', text: 'italic' },
                { type: 'text', text: 'text' },
                {
                    type: 'bold',
                    text: 'then bold',
                },
                { type: 'text', text: 'then' },
                { type: 'italic', text: 'final italic text' },
            ],
        }

        assertDeepEquals(actual, expected)
    },

    'other complex paragraph': function () {
        const complexParagraph = `They know how to  *use the force*
  , speed up,  and destroy **Death Stars**.`
        let text = complexParagraph + '\n'

        const expectedComplexParagraph = {
            type: 'paragraph',
            content: [
                { type: 'text', text: 'They know how to' },
                { type: 'italic', text: 'use the force' },
                { type: 'text', text: ', speed up,  and destroy' },
                { type: 'bold', text: 'Death Stars' },
                { type: 'text', text: '.' },
            ],
        }
        let response = paragraph().parse(Streams.ofChar(text))

        assertDeepEquals(response.value, expectedComplexParagraph)
        assertEquals(response.offset, complexParagraph.length)
    },
}
