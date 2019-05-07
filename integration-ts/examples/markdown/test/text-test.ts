import {assertDeepEquals, assertTrue} from "../../../assert";
import {paragraph} from "../lib/text-parser";


export const textTests = {

    'test empty text': function () {


        let actual = paragraph().val('');

        assertTrue(actual === undefined, 'blank text refused');

        actual = paragraph().val('   ');
        assertTrue(actual === undefined, 'blank line are to be rejected');


    },

    'test simple text': function () {


        let actual = paragraph().val('text');
        let expected = {type: 'paragraph', content: [{type: 'text', text: 'text'}]};
        assertDeepEquals(expected, actual);

        actual = paragraph().val('  text ');
        assertDeepEquals(actual, expected);


    },

    'test italic': function () {

        let actual = paragraph().val('*text*');
        let expected = {type: 'paragraph', content: [{type: 'italic', text: 'text'}]};
        assertDeepEquals(actual, expected);

    },

    'test bold': function () {

        let actual = paragraph().val('**text**');
        let expected = {type: 'paragraph', content: [{type: 'bold', text: 'text'}]};
        assertDeepEquals(actual, expected);


    },

    'test combined format': function () {

        let actual = paragraph().val('  *italic* text **then bold** ');
        let expected = {
            type: 'paragraph', content: [
                {type: 'italic', text: 'italic'},
                {type: 'text', text: ' text '},
                {type: 'bold', text: 'then bold'},
                {type: 'text', text:''}
            ]
        };

        assertDeepEquals(actual, expected);


    },

    'single \\n must be translated as space': function () {

        let actual = paragraph().val('  *italic* text\n**then bold** ');
        let expected = {
            type: 'paragraph', content: [
                {type: 'italic', text: 'italic'},
                {type: 'text', text: ' text '},
                {type: 'bold', text: 'then bold'},
                {type: 'text', text: ''}
            ]
        };

        assertDeepEquals(actual, expected);

    },
};
