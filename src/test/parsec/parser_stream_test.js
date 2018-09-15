import stream from '../../lib/stream/index';
import C from '../../lib/parsec/chars-bundle';
import N from '../../lib/parsec/numbers-bundle';

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
/*
    'endOfStream for empty stream': function(test) {
        test.expect(1);
        // tests here
        var p = C.char(' ').optrep().thenRight(N.numberLiteral());
        test.ok(
            stream.ofParser(p, stream.ofString('')).endOfStream(0),
            'should be endOfStream.'
        );
        test.done();
    },


    'endOfStream for non empty stream': function(test) {
        test.expect(1);
        // tests here
        var p = C.char(' ').optrep().thenRight(N.numberLiteral());
        test.ok(
            stream.ofParser(p, stream.ofString('1')).endOfStream(1),
            'should be endOfStream.'
        );
        test.done();
    },


        'no endOfStream for non empty stream': function(test) {
            test.expect(1);
            // tests here
            var p = C.char(' ').optrep().thenRight(N.numberLiteral());
            test.equal(
                stream.ofParser(p, stream.ofString('1')).endOfStream(0),
                false,
                'should be endOfStream.'
            );
            test.done();
        },

            'get from stream': function(test) {
                test.expect(1);
                // tests here
                var p = C.char(' ').optrep().thenRight(N.numberLiteral());
                test.equal(
                    stream.ofParser(p, stream.ofString('1')).get(0).isSuccess(),
                    true,
                    'should be a success.'
                );
                test.done();
            },

            'do not get from empty stream': function(test) {
                test.expect(1);
                // tests here
                var p = C.char(' ').optrep().thenRight(N.numberLiteral());
                test.equal(
                    stream.ofParser(p, stream.ofString('1')).get(1).isSuccess(),
                    false,
                    'should be a failure.'
                );
                test.done();
            },

            'get from stream numberLiteral 123': function(test) {
                test.expect(1);
                // tests here
                var p = C.char(' ').optrep().thenRight(N.numberLiteral());
                test.equal(
                    stream.ofParser(p, stream.ofString('123')).get(0).success(),
                    123,
                    'should be a 123.'
                );
                test.done();
            },
    */


                'series of numbers': function(test) {

                    // tests here
                    const p = N.numberLiteral()
                        .then(C.char(' ').rep().drop());

                    const parserStream = stream.ofParser(p, stream.ofString('123   14137'));
                                                                   // index: ^0    ^6


                    const first = parserStream.get(0).success(); //>> 123
                    test.equal(first, 123);

                    const second = parserStream.get(1).success(); //>> 114
                    test.equal(second, 14137);
/*
                    // Offset after reading start (1) is related to index after 123 (3)
                    // Offset after reading at 6 (7) is related to index after '123   14137'(11)
                    test.deepEqual(parserStream.offsets, {0:6, 1:11});
*/
                    test.done();
                },
/*
                'failing series of numbers': function(test) {

                    // tests here
                    const p = N.numberLiteral();
                    const parserStream = stream.ofParser(p, stream.ofString('123   a'));
                    // index: ^0    ^6


                    const first = parserStream.get(0).success(); //>> 123
                    test.equal(first, 123);
                    test.deepEqual(parserStream.offsets, {1:3});

                    const second = parserStream.get(6); // try 'a'
                    test.ok(second.isFailure());
                    test.deepEqual(parserStream.offsets, {1:3});

                    test.done();
                },

            */
};
