import testParser from '../test_core';
import {C} from '../../lib/parsec/index';
import {eos} from '../../lib/parsec/parser'

export default {
    setUp: function(done) {
        done();
    },

    'expect C.char to be ok': function(test) {
        const string = 'a'.repeat(1024 * 1024);
        // tests here
        const parser = (C.char('a').drop()).optrep().then(eos());
        let result = testParser(parser, string);
        test.ok(result.isAccepted(), 'Sequence of numbers');
        test.done();
    },

    'expect C.char and space to be ok': function(test) {
        const string = 'a '.repeat(1024 * 1024);
        // tests here
        const parser = (C.char('a').then(C.char(' ')).drop()).optrep().then(eos());
        let result = testParser(parser, string);
        test.ok(result.isAccepted(), 'Sequence of numbers');
        test.done();
    },

    'expect C.char or space to be ok': function(test) {
        const string = 'a '.repeat(1024 * 1024);
        // tests here
        const parser = (C.char('a').or(C.char(' ')).drop()).optrep().then(eos());
        let result = testParser(parser, string);
        test.ok(result.isAccepted(), 'Sequence of numbers');
        test.done();
    },
};
