import stream from '../../lib/stream/index';
import {N} from '../../lib/parsec/index';

let value = undefined;

function testParser(parser, string) {
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
    


}

export default  {
    setUp: function (done) {
        done();
    },

    'expect N.integer to be ok': function (test) {

        const string = '007';
        // tests here
        const parser = N.integer;
        testParser(parser, string);
        test.equal(value, 7, 'N.integer');
        test.done();
    },

    'expect N.integer with sign to be ok': function (test) {

        const string = '-007';
        // tests here
        const parser = N.integer;
        testParser(parser, string);
        test.equal(value, -7, 'negative N.integer');
        test.done();
    },

    'expect numberLiteral without sign to be ok': function (test) {

        const string = '007.12';
        // tests here
        const parser = N.numberLiteral;
        testParser(parser, string);
        test.equal(value, 7.12, 'numberLiteral');
        test.done();
    },

    'expect many digits to be joined and to be a string': function (test) {

        const string = '007';
        // tests here
        const parser = N.digits;
        testParser(parser, string);
        test.equal(typeof value, 'string', 'N.digits should be a string');
        test.equal(value, '007', 'N.digits returns a bad value');
        test.done();
    }


}