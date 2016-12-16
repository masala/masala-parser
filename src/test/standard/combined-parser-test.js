/**
 * Created by Simon on 16/12/2016.
 */


import Parser from '../../lib/standard/combined-parser';

let value = undefined;
let accepted = undefined;
let parser = null


function testLine(line){
    let parsing = parser.parse(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
    console.info('parsing', parsing, '\n');
}

export default {
    setUp: function (done) {

        parser = Parser;
        done();
    },


    'test empty text': function (test) {
        test.expect(2);

        testLine('');
        test.ok(!accepted, 'empty line are to be rejected');

        testLine('   ');
        test.ok(!accepted, 'blank line are to be rejected');

        test.done();
    },
}