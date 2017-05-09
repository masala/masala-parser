/**
 * Created by Simon on 16/12/2016.
 *
 */

import mdParser from '../../../lib/standard/markdown/markdown-parser';

let value = undefined;

function testLine(line) {
    let parsing = mdParser.parseLine(line);
    value = parsing.value;
}

export default {
    setUp: function(done) {
        done();
    },

    /*
    'test empty text2': function (test) {
        testLine('   ');
        test.ok(accepted, 'blank line is accepted');
        test.done();
    },

    'test empty text3': function (test) {
        testLine('  \n\n  \n    \n ');
        test.ok(accepted, 'blank lines are accepted');
        test.done();
    },   */

    'test level1': function(test) {
        testLine('# title1\n');
        let expected = {title: {level: 1, text: 'title1'}};
        test.deepEqual(expected, value, 'test title1');
        test.done();
    },

    'test level3': function(test) {
        testLine('### title\n');
        let expected = {title: {level: 3, text: 'title'}};
        test.deepEqual(expected, value, 'test title level 3');
        test.done();
    },

    'title alternate 1 should be accepted': function(test) {
        testLine('Title\n=====\n');
        let expected = {title: {level: 1, text: 'Title'}};
        test.deepEqual(expected, value, 'test title1 alt');
        test.done();
    },

    'title alternate 1 should be title1': function(test) {
        testLine('Title\n=====   \n');
        let expected = {title: {level: 1, text: 'Title'}};
        test.deepEqual(expected, value, 'test title1 alt');
        test.done();
    },

    'title alternate 2 should be accepted': function(test) {
        testLine('Title\n-----\n');
        let expected = {title: {level: 2, text: 'Title'}};
        test.deepEqual(expected, value, 'test title2 alt');
        test.done();
    },

    'title alternate 2 should be title1': function(test) {
        testLine('Title\n------   \n');
        let expected = {title: {level: 2, text: 'Title'}};
        test.deepEqual(expected, value, 'test title2 alt');
        test.done();
    },

    ' stars into title': function(test) {
        testLine('2*3*4 = 24\n------   \n');
        let expected = {title: {level: 2, text: '2*3*4 = 24'}};
        test.deepEqual(expected, value, 'test stars in title1');
        test.done();
    },

    ' stars into title2': function(test) {
        testLine('## 2*3*4 = 24\n');
        let expected = {title: {level: 2, text: '2*3*4 = 24'}};
        test.deepEqual(expected, value, 'test stars in title2');
        test.done();
    },

    'test simple text': function(test) {
        testLine('text');
        test.deepEqual({paragraph: [{text: 'text'}]}, value);
        test.done();
    },

    'test simple text2': function(test) {
        testLine('  text ');
        test.deepEqual({paragraph: [{text: 'text'}]}, value);
        test.done();
    },

    'test italic': function(test) {
        testLine('*text*');
        test.deepEqual({paragraph: [{italic: 'text'}]}, value);
        test.done();
    },

    'test bold': function(test) {
        testLine('**text**');
        test.deepEqual({paragraph: [{bold: 'text'}]}, value);
        test.done();
    },

    'test combined format': function(test) {
        testLine('  *italic* text **then bold** ');
        let expected = {
            paragraph: [
                {italic: 'italic'},
                {text: ' text '},
                {bold: 'then bold'},
                {text: ' '},
            ],
        };
        test.deepEqual(expected, value);
        test.done();
    },

    'single \\n must be translated as space': function(test) {
        testLine('  *italic* text\n**then bold** ');
        let expected = {
            paragraph: [
                {italic: 'italic'},
                {text: ' text '},
                {bold: 'then bold'},
                {text: ' '},
            ],
        };
        test.deepEqual(expected, value);
        test.done();
    },

    'test normal bullet': function(test) {
        const line = `* This is a bullet`;
        testLine(line);
        test.deepEqual(
            {bullet: {level: 1, content: [{text: 'This is a bullet'}]}},
            value,
            'problem test:test normal bullet'
        );
        test.done();
    },

    'test complex bullet': function(test) {
        const line = '*    This is a bullet \n  ';
        testLine(line);
        test.deepEqual(
            {bullet: {level: 1, content: [{text: '   This is a bullet '}]}},
            value,
            'problem test:test complex bullet '
        );
        test.done();
    },
};
