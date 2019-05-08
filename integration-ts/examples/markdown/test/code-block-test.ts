import {title} from "../lib/title-parser";
import {assertDeepEquals, assertEquals, assertTrue} from "../../../assert";
import {codeBlock, codeLine} from "../lib/code-line-parser";


export const codeBlockTests = {

    'test simple code 1ine': function () {
        const line = `    This is a code block`;
        let actual = codeLine(4).val(line);
        let expected = {type: 'codeLine', content: 'This is a code block'};
        assertDeepEquals(expected, actual, 'This is a gentle block code');

    },
    'test simple code bloc': function () {
        let line = `
    This is a code block
    This is the second code block`;
        let actual = codeBlock(4).val(line);
        let expected = {
            type: 'codeBlock',
            lines: [
                "This is a code block",
                "This is the second code block"
            ]
        };
        assertDeepEquals(expected, actual, 'This is a gentle block code');

        line = `    This is a code block
    This is the second code block
`;
        actual = codeBlock(4).val(line);
        assertDeepEquals(expected, actual, 'This is a gentle block code');

    },
    /*

    'test text normal': function() {
        const line = `This is not a code`;
        let actual = title().val(line);
        assertTrue(actual === undefined);
    },

    'test bullet': function() {
        const line = `\t This is  a  level2 bullet`;
        let actual = title().val(line);
        assertTrue(actual === undefined, 'bullets should not be accepted as a code block');
        
    },



    'test code 2': function() {
        const line = `\t\t  This is a code block`;
        let actual = title().val(line);
        let expected = {type:'codeline', content: 'This is a code block'};
        assertDeepEquals(
            expected,
            actual,
            '  This is a  block code stzrting with spaces and ending with eos'
        );
        
    },

    'test code 3': function() {
        const line = `\t\t`;
        let actual = title().val(line);
        let expected = {type:'codeline', content: ''};
        assertDeepEquals(expected, actual, '  This is a blank line in a code');
        
    },

    'test code 4': function() {
        const line = `\t\t  `;
        let actual = title().val(line);
        let expected = {type:'codeline', content: '  '};
        assertDeepEquals(
            expected,
            actual,
            '  This is a code line with only 2 spaces'
        );
        
    },
    */
};
