/**
 * Created by Simon on 14/12/2016.
 */

import titleParser from '../../lib/standard/title-parser';


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

        parser =  titleParser;
        done();
    },

    'test level1': function (test) {
        test.expect(2);

        testLine('#title1\n');
        let expected={ title: { level: 1, text: 'title1' } }
        test.ok(accepted, 'test title1');
        test.deepEqual(expected, value, 'test title1')

        test.done();
    },

    'test level3': function (test) {
        test.expect(2);

        testLine('###title\n');
        let expected={ title: { level: 3, text: 'title' } }
        test.ok(accepted, 'test title level 3');
        test.deepEqual(expected, value, 'test title level 3')

        test.done();
    },


}