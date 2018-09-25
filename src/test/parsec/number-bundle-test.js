import stream from '../../lib/stream/index';
import {N} from '../../lib/parsec/index';

let value = undefined;

function testParser(parser, string) {
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
}

export default {
    setUp: function(done) {
        done();
    },

    'expect N.integer() to be ok': function(test) {
        const string = '007';
        // tests here
        const parser = N.integer();
        testParser(parser, string);
        test.equal(value, 7, 'N.integer()');
        test.done();
    },

    'expect N.integer() with sign to be ok': function(test) {
        const string = '-007';
        // tests here
        const parser = N.integer();
        testParser(parser, string);
        test.equal(value, -7, 'negative N.integer()');
        test.done();
    },

    'expect number without sign to be ok': function(test) {
        const string = '007.12';
        // tests here
        const parser = N.number();
        testParser(parser, string);
        test.equal(value, 7.12, 'number');
        test.done();
    },

    'expect many digits to be joined and to be a number': function(test) {
        const string = '007';
        // tests here
        const parser = N.digits();
        testParser(parser, string);
        test.equal(typeof value, 'number', 'N.digits() should be a number');
        test.equal(value, 7, 'N.digits() returns a bad value');
        test.done();
    },
};
