import option from '../../lib/data/option';

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

    'option empty': function(test) {
        test.expect(1);
        // tests here
        test.equal(option.none().isPresent(), false, 'should be empty option.');
        test.done();
    },

    'option not empty': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option.some(12).isPresent(),
            true,
            'should not be empty option.'
        );
        test.done();
    },

    'option empty mapped': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .none()
                .map(function(a) {
                    return a;
                })
                .isPresent(),
            false,
            'should be empty option.'
        );
        test.done();
    },

    'option not empty mapped': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .some(12)
                .map(function(a) {
                    return a;
                })
                .get(),
            12,
            'should not be empty option.'
        );
        test.done();
    },

    'option not empty flat mapped to option': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .some(12)
                .flatmap(function(a) {
                    return option.some(a);
                })
                .get(),
            12,
            'should not be empty option.'
        );
        test.done();
    },

    'option empty flat mapped': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .some()
                .flatmap(function(a) {
                    return a;
                })
                .isPresent(),
            false,
            'should be empty option.'
        );
        test.done();
    },

    'option empty or else': function(test) {
        test.expect(1);
        // tests here
        test.equal(option.none().orElse(12), 12, 'should be empty option.');
        test.done();
    },

    'option not empty or else': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option.some(12).orElse(14),
            12,
            'should be not empty option.'
        );
        test.done();
    },

    'option empty or lazy else': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option.none().orLazyElse(function() {
                return 12;
            }),
            12,
            'should be empty option.'
        );
        test.done();
    },

    'option not empty or lazy else': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option.some(12).orLazyElse(function() {
                return 14;
            }),
            12,
            'should be not empty option.'
        );
        test.done();
    },

    'option empty filter': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .none()
                .filter(function(v) {
                    return v === 1;
                })
                .isPresent(),
            false,
            'should be empty option.'
        );
        test.done();
    },

    'option not empty filter': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .some(12)
                .filter(function(v) {
                    return v === 12;
                })
                .get(),
            12,
            'should be not empty option.'
        );
        test.done();
    },

    'option not empty wrong filter': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            option
                .some(12)
                .filter(function(v) {
                    return v === 13;
                })
                .isPresent(),
            false,
            'should be empty option.'
        );
        test.done();
    },
};
