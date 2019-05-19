import testParser from '../test_core';
import {C} from '../../lib/parsec/index';
import {eos} from '../../lib/parsec/parser'

export default {
    setUp: function(done) {
        done();
    },

    'expect C.string to be ok': function(test) {
        const string = 'a '.repeat(1024 * 1024);
        // tests here
        const parser = (C.string('a ').drop()).optrep().then(eos());
        let result = testParser(parser, string);
        test.ok(result.isAccepted(), 'Sequence of numbers');
        test.done();
    },

};
