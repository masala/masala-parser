/**
 * Created by Nicolas Zozol on 14/12/2016.
 */
import { title } from '../lib/title-parser.js'
import { assertDeepEquals, assertEquals, assertTrue } from '../../../assert.js'
import { bullet } from '../lib/bullet-parser.js'
import { Stream } from '@masala/parser'

export const titleTests = {
    'test level1': function () {
        let actual = title().val('# title1\n')
        let expected = {
            level: 1,
            text: 'title1',
            type: 'title',
            typeOption: 'sharp',
        }
        assertDeepEquals(actual, expected)
    },

    'test level3': function () {
        let actual = title().val('### title\n')
        let expected = {
            level: 3,
            text: 'title',
            type: 'title',
            typeOption: 'sharp',
        }
        assertDeepEquals(expected, actual, 'test title level 3')
    },

    'title alternate 1 should be accepted': function () {
        let actual = title().val('Title\n=====\n')
        let expected = {
            level: 1,
            text: 'Title',
            type: 'title',
            typeOption: 'line',
        }

        assertDeepEquals(expected, actual, 'test title1 alt')
    },

    'title alternate 1 should be title1': function () {
        let actual = title().val('Title\n=====   \n')
        let expected = {
            type: 'title',
            typeOption: 'line',
            level: 1,
            text: 'Title',
        }

        assertDeepEquals(expected, actual, 'test title1 alt')
    },

    'title alternate 2 should be accepted': function () {
        let actual = title().val('Title\n-----\n')
        let expected = {
            type: 'title',
            typeOption: 'line',
            level: 2,
            text: 'Title',
        }

        assertDeepEquals(expected, actual, 'test title2 alt')
    },

    'title alternate 2 should be title1': function () {
        let actual = title().val('Title\n------   \n')
        let expected = {
            type: 'title',
            typeOption: 'line',
            level: 2,
            text: 'Title',
        }

        assertDeepEquals(expected, actual, 'test title2 alt')
    },

    ' stars into title': function () {
        let actual = title().val('2*3*4 = 24\n------   \n')
        let expected = {
            type: 'title',
            typeOption: 'line',
            level: 2,
            text: '2*3*4 = 24',
        }

        assertDeepEquals(expected, actual, 'test stars in title1')

        actual = title().val('## 2*3*4 = 24\n')
        expected = {
            type: 'title',
            typeOption: 'sharp',
            level: 2,
            text: '2*3*4 = 24',
        }

        assertDeepEquals(expected, actual, 'test stars in title2')
    },

    'Sharps not followed by space': function () {
        let actual = title().val('#Not tile')

        assertEquals(
            actual,
            undefined,
            'Sharp not followed by space shall not be parsed',
        )
    },

    'Sharp title does not eat eol': function () {
        const text = `### This is a title`
        const line = text + '\n'

        let response = title().parse(Stream.ofChars(line))
        assertTrue(response.isAccepted())
        assertEquals(response.offset, text.length)
    },

    'Line title does not eat eol': function () {
        const text = `This is a title\n------`
        const line = text + '\n'

        let response = title().parse(Stream.ofChars(line))
        assertTrue(response.isAccepted())
        assertEquals(response.offset, text.length)
    },
}
