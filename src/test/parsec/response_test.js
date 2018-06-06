import response from '../../lib/parsec/response';
import stream from '../../lib/stream/index';

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
        done();
    },

    'response accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(response.accept().isAccepted(), 'should be accepted.');
        test.done();
    },

    'response as a success': function (test) {
        test.expect(1);
        // tests here
        test.ok(response.accept().toTry().isSuccess(), 'should be success.');
        test.done();
    },

    'response accepted map to accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(
            response
                .accept()
                .map(function (a) {
                    return a;
                })
                .isAccepted(),
            'should be accepted.'
        );
        test.done();
    },

    'response accepted map to return the value': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.accept('a').map(function (a) {
                return a;
            }).value,
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'response accepted flatMap to accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(
            response
                .accept('a')
                .flatMap(function (a) {
                    return response.accept(a);
                })
                .isAccepted(),
            'should be accepted.'
        );
        test.done();
    },

    'response accepted flatMap to return the value': function (test) {
        test.expect(1);
        // tests here
        test.ok(
            response
                .accept('a')
                .flatMap(function (a) {
                    return response.accept(a);
                })
                .isAccepted(),
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'response accepted flatMap to reject': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .accept()
                .flatMap(function () {
                    return response.reject();
                })
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'response rejected map to rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .reject()
                .map(function (t) {
                    return t;
                })
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'response rejected flatMap to rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .reject()
                .flatMap(function () {
                    return response.accept();
                })
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'response accepted fold': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.accept('a').fold(function (a) {
                return a.value;
            }),
            'a',
            'should retrieve the value.'
        );
        test.done();
    },

    'fold takes a function to map the value depending on result': function (test) {

        let value = response.accept('a')
            .fold(accept => accept.value + '-potato', // Accept has value, input, offset, consumed
                reject => reject.offset + '-tomato'); // Reject has offset, consumed

        // we accept, so it should be a-potato
        test.equal(value, 'a-potato');

        value = response.reject()
            .fold(accept => accept.value + '-potato',
                reject =>  reject.offset + '-tomato');

        // we reject, so it should use the second function
        // Offset is undefined because it's up to the parser to know which offset it's parsing
        test.equal(value, 'undefined-tomato');


        test.done();

    },

    'response filter accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(
            response
                .accept('a')
                .filter(function (a) {
                    return a === 'a';
                })
                .isAccepted(),
            'should filter the response.'
        );
        test.done();
    },

    'response not filter accepted ': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .accept('a')
                .filter(function (a) {
                    return a !== 'a';
                })
                .isAccepted(),
            false,
            'should not filter the response.'
        );
        test.done();
    },

    'accept can be consumed': function (test) {
        test.expect(1);
        // tests here
        const myStream = stream.ofString('abc');
        test.equal(
            response.accept('c', myStream, 3, false).isConsumed(),
            true,
            'should be consumed'
        );
        test.done();
    },
    'accept should not be yet consumed': function (test) {
        test.expect(1);
        // tests here
        const myStream = stream.ofString('abc');
        test.equal(
            response.accept('b', myStream, 2, false).isConsumed(),
            false,
            'should be consumed'
        );
        test.done();
    },

    'response rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.reject().isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'response rejected should not be consumed': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.reject().isConsumed(),
            false,
            'should be not consumed.'
        );
        test.done();
    },

    'response as a failure': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.reject().toTry().isSuccess(),
            false,
            'should be failure.'
        );
        test.done();
    },

    'response rejected fold': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response.reject().fold(
                function (a) {
                    return a.value;
                },
                function () {
                    return 'b';
                }
            ),
            'b',
            'should generate the value.'
        );
        test.done();
    },

    'response filter rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .reject()
                .filter(function () {
                    return true;
                })
                .isAccepted(),
            false,
            'should not filter the response.'
        );
        test.done();
    },

    'response not filter rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            response
                .reject()
                .filter(function () {
                    return false;
                })
                .isAccepted(),
            false,
            'should not filter the response.'
        );
        test.done();
    },
};
