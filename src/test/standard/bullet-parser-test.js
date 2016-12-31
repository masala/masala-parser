/**
 * Created by Simon on 25/12/2016.
 */

import Parser from '../../lib/standard/bullet-parser';

let value = undefined;
let accepted = undefined;
let parser = null


function testLine(line) {
    const parsing = Parser.parse(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
    console.info('parsing', parsing, '\n\n');
}


export default {
    setUp: function (done) {
        done();
    },

    'test text normal': function (test) {
        const line = `This is not a bullet`;
        testLine(line);
        test.ok(!accepted, 'Normal text should not be accepted as a bullet');
        test.done();
    },

    'test normal bullet': function (test) {
        const line = `* This is a bullet`;
        testLine(line);
        test.deepEqual({bullet:{level:1, content:[{text:'This is a bullet'}]}}, value,'probleme test:test normal bullet');
        test.done();
    },

    'test bullet niveau 2': function (test) {
        const line = "      * This is a lvl2 bullet \n  ";
        testLine(line);
        test.deepEqual({bullet:{level:2, content:[{text:'This is a lvl2 bullet '}]}}, value,'probleme test:test bullet Lvl2');
        test.done();
    },

    'test bullet niveau 2': function (test) {
        const line = "\t  * This is another lvl2 bullet \n  ";
        testLine(line);
        test.deepEqual({bullet:{level:2, content:[{text:'This is another lvl2 bullet '}]}}, value,'probleme test:test bullet Lvl2');
        test.done();
    },

    'test bullet et format': function (test) {
        const line = "* This is a bullet *with italic* and even **bold characters**\n  ";
        testLine(line);
        test.deepEqual({bullet:{level:1, content:[{text:"This is a bullet "}
                                , {italic:"with italic"}
                                , {text:" and even "}
                                , {bold:"bold characters"}]}}
                                , value,'probleme test:test bullet et format');
        test.done();
    },


}