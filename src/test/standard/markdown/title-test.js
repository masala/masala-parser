/**
 * Created by Simon on 14/12/2016.
 */

import Parser from '../../../lib/standard/markdown/title-parser';

let value = undefined;
let accepted = undefined;
let parser = null;

function testLine(line) {
  let parsing = parser.parse(line);
  value = parsing.value;
  accepted = parsing.isAccepted();
}

export default {
  setUp: function(done) {
    parser = Parser;
    done();
  },

  'test level1': function(test) {
    test.expect(2);

    testLine('# title1\n');
    let expected = {title: {level: 1, text: 'title1'}};
    test.ok(accepted, 'test title1');
    test.deepEqual(expected, value, 'test title1');

    test.done();
  },

  'test level3': function(test) {
    test.expect(2);

    testLine('### title\n');
    let expected = {title: {level: 3, text: 'title'}};
    test.ok(accepted, 'test title level 3');
    test.deepEqual(expected, value, 'test title level 3');

    test.done();
  },

  'title alternate 1 should be accepted': function(test) {
    test.expect(1);

    testLine('Title\n=====\n');
    let expected = {title: {level: 1, text: 'Title'}};

    test.deepEqual(expected, value, 'test title1 alt');
    test.done();
  },

  'title alternate 1 should be title1': function(test) {
    test.expect(1);

    testLine('Title\n=====   \n');
    let expected = {title: {level: 1, text: 'Title'}};

    test.deepEqual(expected, value, 'test title1 alt');
    test.done();
  },

  'title alternate 2 should be accepted': function(test) {
    test.expect(1);

    testLine('Title\n-----\n');
    let expected = {title: {level: 2, text: 'Title'}};

    test.deepEqual(expected, value, 'test title2 alt');
    test.done();
  },

  'title alternate 2 should be title1': function(test) {
    test.expect(1);

    testLine('Title\n------   \n');
    let expected = {title: {level: 2, text: 'Title'}};

    test.deepEqual(expected, value, 'test title2 alt');
    test.done();
  },

  ' stars into title': function(test) {
    test.expect(2);

    testLine('2*3*4 = 24\n------   \n');
    let expected = {title: {level: 2, text: '2*3*4 = 24'}};

    test.deepEqual(expected, value, 'test stars in title1');

    testLine('## 2*3*4 = 24\n');
    expected = {title: {level: 2, text: '2*3*4 = 24'}};

    test.deepEqual(expected, value, 'test stars in title2');

    test.done();
  },

  'Sharps not followed by space': function(test) {
    test.expect(1);

    testLine('#Not tile');

    test.ok(!accepted, 'Sharp not followed by space shall not be parsed');
    test.done();
  },
};
