import stream from '../../lib/stream/index';
import tokenizer from '../../lib/genlex/tokenizer';
import token from '../../lib/genlex/token';

const tkBuilder = token.builder;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

export default {
    setUp: function(done) {
        done();
    },

    'tokeniser is a success': function(test) {
        test.expect(1);
        // tests here
        test.ok(
            tokenizer([':', '->'])
                .tokenize(stream.ofString('type f : a -> b'))
                .isSuccess(),
            'should be a success.'
        );
        test.done();
    },

    'tokeniser return a list of tokens': function(test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            tokenizer(['let', 'in', '=', '->'])
                .tokenize(stream.ofString('let f = \'a\' in "aa"'))
                .success(),
            [
                tkBuilder.keyword('let'),
                tkBuilder.ident('f'),
                tkBuilder.keyword('='),
                tkBuilder.char('a'),
                tkBuilder.keyword('in'),
                tkBuilder.string('aa'),
            ],
            'should be a a list of tokens.'
        );
        test.done();
    },
};
