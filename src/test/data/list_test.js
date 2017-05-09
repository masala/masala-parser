import list from '../../lib/data/list';

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

    'empty list': function (test) {
        test.expect(1);
        // tests here
        test.equal(list().isEmpty(), true, 'should be empty.');
        test.done();
    },

    'non empty list': function (test) {
        test.expect(1);
        // tests here
        test.equal(list(1).isEmpty(), false, 'should not be empty.');
        test.done();
    },

    'filtering elements returns empty list': function (test) {
        test.expect(1);
        // tests here
        test.equal(list(1).filter(i => i != 1).isEmpty(), true, 'should be empty.');
        test.done();
    },

    'filtering elements returns same list': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            list(1).filter(i => i == 1).isEmpty(),
            false,
            'should not be empty.'
        );
        test.done();
    },

    'map integer list': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            list(1, 2, 3).map(function (v) {
                return v + 1;
            }),
            list(2, 3, 4),
            'should map.'
        );
        test.done();
    },

    'flatmap integer list': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            list(1, 2, 3).flatmap(function (v) {
                return list(v, v + 1);
            }),
            list(1, 2, 2, 3, 3, 4),
            'should flatmap.'
        );
        test.done();
    },

    'retrieve non empty array': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(list(1, 2).array(), [1, 2], 'should not be empty.');
        test.done();
    },

    'retrieve joined characters array': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(list('1', '2').join(''), '12', 'should be "12".');
        test.done();
    },
    'add element': function (test) {
        test.expect(1);
        // tests here
        const myList = list(1, 2);

        test.deepEqual([1, 2, 3], myList.add(3).array());

        test.done();
    },
    'list size': function (test) {
        test.expect(1);
        // tests here
        const myList = list(1, 2, 3, 4);

        test.equal(4, myList.size());

        test.done();
    }
};
