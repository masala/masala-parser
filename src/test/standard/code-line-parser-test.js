/**
 * Created by Simon on 03/01/2017.
 */

import Parser from '../../lib/standard/code-line-parser';

let value = undefined;
let accepted = undefined;
let expected = undefined;


function testLine(line) {
    const parsing = Parser.parse(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
}



export default {
    setUp: function (done) {
        done();
    },

    'test text normal': function (test) {
        const line = `This is not a code`;
        testLine(line);
        test.ok(!accepted, '   Normal text should not be accepted as a code block');
        test.done();
    },

    'test bullet': function (test) {
        const line = `\t This is  a  level2 bullet`;
        testLine(line);
        test.ok(!accepted, 'bullets should not be accepted as a code block');
        test.done();
    },


    'test code 1': function (test) {
        const line = `        This is a code block\n`;
        testLine(line);
        expected = {code:"This is a code block"};
        test.deepEqual(value, expected, 'This is a gentle block code');
        test.done();
    },

    'test code 2': function (test) {
        const line = `\t\t  This is a code block`;
        testLine(line);
        expected = {code:"  This is a code block"};
        test.deepEqual(value, expected, '  This is a  block code stzrting with spaces and ending with eos');
        test.done();
    },

    'test code 3': function (test) {
        const line = `\t\t`;
        testLine(line);
        expected = {code:""};
        test.deepEqual(value, expected, '  This is a blank line in a code');
        test.done();
    },


    'test code 4': function (test) {
        const line = `\t\t  `;
        testLine(line);
        expected = {code:"  "};
        test.deepEqual(value, expected, '  This is a code line with only 2 spaces');
        test.done();
    },
}