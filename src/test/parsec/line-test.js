import stream from '../../lib/stream/index';
import {C,N} from '../../lib/parsec/index';

const eol = C.char('\n')

export default {
    setUp: function (done) {
        done();
    },

    'expect line 1 is ok': function (test) {
        const string = '007';
        // tests here
        const parser = N.integer();
        const response = parser.parse(stream.ofString(string));

        test.equal(1, response.line());
        test.done();
    },
    'expect line 2 is ok': function (test) {
        const string = '007\n12';
        // tests here
        const parser = N.integer().then(eol).then(N.integer());
        const response = parser.parse(stream.ofString(string));

        test.equal(2, response.line());
        test.done();
    },
    'multiline is ok': function (test) {
        const string = '007\n\n12';
        // tests here
        const parser = N.integer().then(eol).then(N.integer());
        const response = parser.parse(stream.ofString(string));

        test.equal(3, response.line());
        test.done();
    },
    'not finished parser is ok': function (test) {
        const string = '007\nab\n12';
        // tests here
        const parser = N.integer().then(eol).then(N.integer());
        const response = parser.parse(stream.ofString(string));

        test.equal(2, response.line());
        test.equal(false, response.isAccepted());
        test.done();
    },
    'first lines is ok and windows': function (test) {
        const string = '\n007\nab\n12';
        // tests here
        const parser = eol.then(N.integer()).then(eol).then(N.integer());
        const response = parser.parse(stream.ofString(string));

        test.equal(3, response.line());
        test.equal(false, response.isAccepted());
        test.done();
    }



}
