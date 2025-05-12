import { title } from '../lib/title-parser'
import { assertDeepEquals, assertEquals, assertTrue } from '../../../assert'
import { codeBlock, codeLine } from '../lib/code-line-parser'

export const codeBlockTests = {
    'test simple code 1ine': function () {
        const line = `    This is a code block`
        let actual = codeLine().val(line)
        let expected = { type: 'codeLine', content: 'This is a code block' }
        assertDeepEquals(expected, actual, 'This is a gentle block code')
    },

    'test simple code bloc': function () {
        let line = `  This is a code block
    This is the second code block
    This is the third code block`
        let actual = codeBlock().val(line)
        let expected = {
            type: 'codeBlock',
            lines: [
                'This is a code block',
                'This is the second code block',
                'This is the third code block',
            ],
        }
        assertDeepEquals(expected, actual, 'This is a gentle block code')

        line = `    This is a code block
    This is the second code block
    This is the third code block
`
        actual = codeBlock().val(line)
        assertDeepEquals(expected, actual, 'This is a gentle block code')
    },

    'test text normal': function () {
        const line = `This is not a code`
        let actual = codeBlock().val(line)
        assertTrue(actual === undefined)
    },

    'test bullet': function () {
        const line = `\t\t* This is  a  level2 bullet`
        let actual = codeBlock().val(line)
        assertTrue(
            actual !== undefined,
            'bullets should be accepted as a code block when no priority is set',
        )
    },

    'code blocks are not trimmed in this project': function () {
        const line = `\t\t  This is a code block`
        let actual = codeBlock().val(line)
        let expected = { type: 'codeBlock', lines: ['This is a code block'] }
        assertDeepEquals(
            expected,
            actual,
            '  This is a NOT TRIMMED block code starting with mixed tabs and spaces',
        )
    },

    'test code empty block': function () {
        const line = `\t`
        let actual = codeBlock().val(line)
        assertTrue(actual === undefined, 'Too empty for code block')
    },

    'test code space block': function () {
        const line = `\t  `
        let actual = codeBlock().val(line)
        let expected = { type: 'codeBlock', lines: [] }
        assertDeepEquals(
            expected,
            actual,
            '  This is a code line with only 2 spaces',
        )
    },
}
