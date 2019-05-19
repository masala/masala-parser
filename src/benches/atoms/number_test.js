import testParser from '../test_core';
import {N,C} from '../../lib/parsec/index';
import {eos} from '../../lib/parsec/parser'

export default {
    setUp: function(done) {
        done();
    },

    'expect N.integer to be ok': function(test) {
        const string = '42 '.repeat(1024);
        // tests here
        const parser = (N.integer().then(C.char(' ')).drop()).optrep().then(eos());
        let result = testParser(parser, string);
        test.ok(result.isAccepted(), 'Sequence of numbers');
        test.done();
    },

};
