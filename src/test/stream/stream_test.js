import stream from '../../lib/stream/index'

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
    setUp: function (done) {
        done()
    },

    'endOfStream for empty stream': function (test) {
        test.expect(1)
        // tests here
        test.ok(stream.ofString('').endOfStream(0), 'should be endOfStream.')
        test.done()
    },

    'endOfStream for non empty stream': function (test) {
        test.expect(1)
        // tests here
        test.ok(stream.ofString('1').endOfStream(1), 'should be endOfStream.')
        test.done()
    },

    'no endOfStream for non empty stream': function (test) {
        test.expect(1)
        // tests here
        test.equal(
            stream.ofString('1').endOfStream(0),
            false,
            'should be endOfStream.',
        )
        test.done()
    },

    'get from stream': function (test) {
        test.expect(1)
        // tests here
        test.equal(
            stream.ofString('1').get(0).isSuccess(),
            true,
            'should be a success.',
        )
        test.done()
    },

    'do not get from empty stream': function (test) {
        test.expect(1)
        // tests here
        test.equal(
            stream.ofString('1').get(1).isSuccess(),
            false,
            'should be a failure.',
        )
        test.done()
    },

    'do not get from erroneous stream': function (test) {
        test.expect(1)
        // tests here
        test.equal(
            stream
                .ofString({
                    length: 1,
                    charAt: function () {
                        throw new Error()
                    },
                })
                .get(0)
                .isSuccess(),
            false,
            'should be a failure.',
        )
        test.done()
    },
}
