import stream from '../../../lib/stream/index'
import jsonparser from '../../../lib/standard/json/jsonparser'

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

    'number accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('123')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'string accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('"123"')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'string and unrecognized item rejected': function (test) {
        test.expect(1)
        // tests here
        let content = '"123" -' //'"123" -'
        test.equal(
            jsonparser.parse(stream.ofChars(content)).isAccepted(),
            false,
            'should be rejected.',
        )
        test.done()
    },

    'string and unrecognized item rejected with correct offset': function (
        test,
    ) {
        //FIXME #108
        // tests here
        try {
            var result = jsonparser.parse(stream.ofChars('["123",2,4]'))
            //console.log('Offsets >>', stream.offsets[7])
        } catch (e) {
            console.error(e)
        }

        test.ok(result.isEos(), 'should be consumed.')

        //FIXME #108: Not ok with Error
        test.equal(result.offset, 7, 'should be 7.')
        test.done()
    },

    'null accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('null')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'true accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('true')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'false accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('false')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'empty array accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('[ ]')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'singleton array accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('[ 123 ]')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'multi element array accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('[ 123 , 234 ]')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'empty object accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('{ }')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'singleton object accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser.parse(stream.ofChars('{ "a" : "v" }')).isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'multi element object accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser
                .parse(stream.ofChars('{ "a" : "v", "a" : [] }'))
                .isAccepted(),
            'should be accepted.',
        )
        test.done()
    },

    'multi level object accepted': function (test) {
        test.expect(1)
        // tests here
        test.ok(
            jsonparser
                .parse(stream.ofChars('{ "a" : "v", "b" : {"c":{"d":12} }}'))
                .isAccepted(),
            'should be accepted.',
        )
        test.done()
    },
}
