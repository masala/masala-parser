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


}