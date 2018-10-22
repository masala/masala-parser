import list, {MASALA_VOID, asList} from '../../lib/data/list';

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
        test.equal(
            list(1).filter(i => i !== 1).isEmpty(),
            true,
            'should be empty.'
        );
        test.done();
    },

    'filtering elements returns same list': function (test) {
        test.expect(1);
        // tests here
        test.equal(
            list(1).filter(i => i === 1).isEmpty(),
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

    'flatMap integer list': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            list(1, 2, 3).flatMap(function (v) {
                return list(v, v + 1);
            }),
            list(1, 2, 2, 3, 3, 4),
            'should flatMap.'
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
    },
    'a list of a list are deep equal list': function (test) {
        const lower = list(1, 2);

        const flat = list(lower);
        test.deepEqual(lower, flat);
        test.deepEqual(flat.value, [1, 2]);
        test.ok (lower !== flat)
        test.done();
    },
    '__void__ is not added to the list': function (test) {
        let v = MASALA_VOID;
        let vList = list(v);

        test.equal(vList.size(), 0)
        vList = vList.add(v).add( 3).add( v).add( 5);
        test.equal(vList.size(), 2)
        test.done();
    },
    'asList(array) transforms an array in a List': function (test) {

        let caught = false;
        try {
            asList(2);
        } catch (e) {
            caught = true;
        }
        test.ok(caught);

        const emptyList = asList([]);
        test.ok(emptyList.isEmpty());

        const fromArray = asList([2, 4, 5]);
        test.deepEqual(fromArray, list(2, 4, 5));

        test.done()
    },
    'list and __void__ can be added in a List': function (test) {



        const flat = asList([2, 4, 5]);

        const result = list(MASALA_VOID, flat, 1,2,MASALA_VOID);

        test.deepEqual(result, list(2, 4, 5, 1, 2));

        test.done()
    }
};
