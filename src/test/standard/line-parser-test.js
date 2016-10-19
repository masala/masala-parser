import stream from '../../lib/stream/index';
import LineParser from '../../lib/standard/line_parser';

let lineParser = null;

function isDefined(object) {
    return typeof object !== 'undefined';
}

function isString(object) {
    return typeof object === 'string';
}

function isArray(object){
    return object instanceof Array;
}
function isObject(object){
    return ! (object instanceof Array) &&  typeof object == 'object';
}

function display(value, prefix=false){
    if (prefix){
        console.info(`${prefix} : ${JSON.stringify(value)}`);
    }else{
        console.info(JSON.stringify(value));
    }
}

export default {
    setUp: function(done) {
        lineParser = new LineParser();
        done();
    },

    'Sharp title 1 should be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(lineParser.parseLine('# Title \n').isAccepted(),
            'should be accepted.');
        test.done();
    },
    'title 1 should be retrieved': function (test) {
        test.expect(5);

        const parsing = lineParser.parseLine('# Title \n');
        const value = parsing.value;
        const accepted = parsing.isAccepted();

        // tests here
        test.ok(accepted, 'title is accepted');
        test.ok(isObject(value), 'value is an object');
        test.ok(isDefined(value.title), 'value.title is defined');
        test.ok(isString(value.title), 'value.title is a direct string');
        test.equal(value.level,1, 'value level is 1');

        //ends
        test.done();
    },
    'Correct value level': function (test) {
        test.expect(2);

        const parsing = lineParser.parseLine('### Title \n');
        const value = parsing.value;
        const accepted = parsing.isAccepted();


        // tests here
        test.ok(accepted, 'title is accepted');
        test.equal(value.level,3, 'value level is 3');

        //ends
        test.done();
    },
    'title has no formatting': function (test) {
        test.expect(3);

        const parsing = lineParser.parseLine('### Title *formatted*\n');
        const value = parsing.value;
        const accepted = parsing.isAccepted();

        // tests here
        test.ok(accepted, 'title is accepted');
        test.ok(isString(value.title), 'formatting is not taken');
        test.ok(value.title.includes('*'), '* is part of the title');

        //ends
        test.done();
    },

    'line should be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(lineParser.parseLine('a simple test\n').isAccepted(),
            'should be accepted.');
        test.done();
    }

};
