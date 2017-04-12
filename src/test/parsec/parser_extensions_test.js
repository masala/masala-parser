import stream from '../../lib/stream/index';
import {F,C,N} from '../../lib/parsec/index';

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

    'expect (returns) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(F.returns().parse(stream.ofString(""), 0).isAccepted(),
            'should be accepted.');
        test.done();
    },

    'expect (returns) to return a given value': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.returns(123).parse(stream.ofString(""), 0).value,
            123,
            'should be accepted.');
        test.done();
    },

    'expect (returns) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.error.parse(stream.ofString(""), 0).isAccepted(),
            false,
            'should be accepted.');
        test.done();
    },

    'expect (lazy) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(F.lazy(function () {
                return F.returns();
            }).parse(stream.ofString(""), 0).isAccepted(),
            'should be accepted.');
        test.done();
    },

    'expect (lazy) to return a given value': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.lazy(function () {
                return F.returns(123);
            }).parse(stream.ofString(""), 0).value,
            123,
            'should be accepted.');
        test.done();
    },

    'expect (lazy) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.lazy(function () {
                return F.error;
            }).parse(stream.ofString(""), 0).isAccepted(),
            false,
            'should be accepted.');
        test.done();
    },

    'expect (lazy) with a parameter to return a given value': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.lazy(function (v) {
                return F.returns(v);
            }, [123]).parse(stream.ofString(""), 0).value,
            123,
            'should be accepted.');
        test.done();
    },

    'expect (error) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.error.parse(stream.ofString(""), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (eos) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.eos.parse(stream.ofString(""), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (eos) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.eos.parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (satisfy) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.satisfy(function (v) {
                return v === 'a';
            }).parse(stream.ofString("a"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (satisfy) to be return the right value': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.satisfy(function (v) {
                return v === 'a';
            }).parse(stream.ofString("a"), 0).value,
            'a',
            'should be the right value.');
        test.done();
    },

    'expect (satisfy) to be return the right offset': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.satisfy(function (v) {
                return v === 'a';
            }).parse(stream.ofString("a"), 0).offset,
            1,
            'should be the right offset.');
        test.done();
    },

    'expect (satisfy) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.satisfy(function (v) {
                return v === 'b';
            }).parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (doTry satisfy) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.try(F.satisfy(function (v) {
                return v === 'a';
            })).parse(stream.ofString("a"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (doTry satisfy) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.try(F.satisfy(function (v) {
                return v === 'b';
            })).parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (digit) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.digit.parse(stream.ofString("1"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (digit) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.digit.parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (lowerCase) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.lowerCase.parse(stream.ofString("a"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (lowerCase) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.lowerCase.parse(stream.ofString("A"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (upperCase) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.upperCase.parse(stream.ofString("A"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (upperCase) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.upperCase.parse(stream.ofString("z"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect upper (letter) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.letter.parse(stream.ofString("A"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect lower (letter) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.letter.parse(stream.ofString("z"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },
    'expect space (letter) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.letter.parse(stream.ofString(" "), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect non (letter) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.letter.parse(stream.ofString("0"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (letters) to be accepted': function (test) {
        test.expect(2);
        // tests here
        const parsing = C.letters.thenLeft(F.eos).parse(stream.ofString("someLetters"), 0);
        test.equal(parsing.isAccepted(), true, 'should be accepted.');
        test.deepEqual(parsing.value, 'someLetters', 'should be equal.');
        test.done();
    },

    'expect (letters) with space to be rejected': function (test) {
        test.expect(2);
        // tests here
        const parsing = C.letters.then(F.eos).parse(stream.ofString("some Letters"), 0);
        test.equal(parsing.isAccepted(), false, 'should be rejected.');
        test.notDeepEqual(parsing.value, 'some Letters', 'should be equal.');
        test.done();
    },

    'expect (letters) with number to be rejected': function (test) {
        test.expect(1);
        // tests here
        const parsing = C.letters.then(F.eos).parse(stream.ofString("some2Letters"), 0);
        test.equal(parsing.isAccepted(), false, 'should be accepted.');
        test.done();
    },

    'expect (letters) to return a string, not an array of letters': function (test) {
        test.expect(1);
        // tests here
        const parsing = C.letters.thenLeft(F.eos).parse(stream.ofString("someLetters"), 0);
        test.equal(parsing.value, 'someLetters', 'not a string');
        test.done();
    },


    'expect (char) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.char('a').parse(stream.ofString("a"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (char) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.char('a').parse(stream.ofString("b"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (char) to be refused': function (test) {
        test.expect(1);
        // tests here
        test.throws(function () {
            C.char('aa');
        });
        test.done();
    },

    'expect (notChar) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.notChar('a').parse(stream.ofString("b"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (notChar) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.notChar('a').parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (notChar) to be refused': function (test) {
        test.expect(1);
        // tests here
        test.throws(function () {
            C.notChar('aa');
        });
        test.done();
    },


    'expect (charNotIn) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charNotIn('a').parse(stream.ofString("b"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (charNotIn) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charNotIn('a').parse(stream.ofString("a"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (charIn) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charIn('a').parse(stream.ofString("a"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (charIn) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charIn('a').parse(stream.ofString("b"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (string) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.string('Hello').parse(stream.ofString("Hello"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (string) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.string('hello').parse(stream.ofString("hell"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (notString) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.notString('**').parse(stream.ofString("hello"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (notString) to be h': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.notString('**').parse(stream.ofString("hello"), 0).value,
            'h',
            'should be h.');
        test.done();
    },

    'expect (notString) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.notString('**').parse(stream.ofString("**hello"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (number) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("123"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (number) to return 123': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("123"), 0).value,
            123,
            'should be accepted.');
        test.done();
    },

    'expect negative (number) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("-123"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect negative (number) to return -123': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("-123"), 0).value,
            -123,
            'should be accepted.');
        test.done();
    },

    'expect float (number) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("123.34e-34"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect float (number) to return 123.34e-34': function (test) {
        test.expect(1);
        // tests here
        test.equal(N.numberLiteral.parse(stream.ofString("123.34e-34"), 0).value,
            123.34e-34,
            'should be accepted.');
        test.done();
    },

    'expect (charLiteral) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charLiteral.parse(stream.ofString("'a'"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (charLiteral) to return a': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charLiteral.parse(stream.ofString("'a'"), 0).value,
            'a',
            'should be accepted.');
        test.done();
    },

    'expect (charLiteral) quote to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charLiteral.parse(stream.ofString("'\\''"), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (charLiteral) to be rejected': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.charLiteral.parse(stream.ofString("''"), 0).isAccepted(),
            false,
            'should be rejected.');
        test.done();
    },

    'expect (stringLiteral) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.stringLiteral.parse(stream.ofString('"a"'), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (stringLiteral) to return abc': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.stringLiteral.parse(stream.ofString('"abc"'), 0).value,
            "abc",
            'should be accepted.');
        test.done();
    },

    'expect (stringLiteral) empty to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(C.stringLiteral.parse(stream.ofString('""'), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (occurence 1) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.any.occurrence(1).parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (occurence 1) to return [a]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(F.any.occurrence(1).parse(stream.ofString('a'), 0).value.array(),
            ['a'],
            'should be accepted.');
        test.done();
    },

    'expect (occurence 2) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.any.occurrence(1).parse(stream.ofString('aa'), 0).isAccepted(),
            true,
            'should be accepted.');
        test.done();
    },

    'expect (occurence 2) to return [a,a]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(F.any.occurrence(2).parse(stream.ofString('aa'), 0).value.array(),
            ['a', 'a'],
            'should be accepted.');
        test.done();
    },

    'expect (occurence 3) to return [a,a,a]': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(F.any.occurrence(3).parse(stream.ofString('aaa'), 0).value.array(),
            ['a', 'a', 'a'],
            'should be accepted.');
        test.done();
    },

    'expect (occurence 0) to be accepted': function (test) {
        test.expect(1);
        // tests here
        test.equal(F.any.occurrence(0).parse(stream.ofString('aa'), 0).isAccepted(),
            true,
            'should be accepter.');
        test.done();
    },


    'expect (occurence 0) to return []': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(F.any.occurrence(0).parse(stream.ofString('aa'), 0).value.array(),
            [],
            'should be accepter.');
        test.done();
    },

    "expect sequence ( '(',text(), ')' ) to return ['(', text, ')']": function (test) {
        test.expect(1);
        // tests here
        const string = '(Hello)';
        const expected = ['(', 'Hello', ')'];

        const parsing = F
            .sequence(
                C.char('('),
                C.charNotIn(')').rep().map(v=>v.join('')),
                C.char(')')
            )
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },
    "expect sequence ( 2+2) to return [2,'+' ,2]": function (test) {
        test.expect(1);
        // tests here
        const string = '2+2';
        const expected = [2, '+', 2];

        const parsing = F.sequence(
                N.numberLiteral,
                C.char('+'),
                N.numberLiteral)
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },

    "expect flattenDeep ( 2+2) to return [2,'+' ,2]": function (test) {
        // Main difference with sequence, is that a sequence element could be an array
        test.expect(1);
        // tests here
        const string = '2+2';
        const expected = [2, '+', 2];

        const parsing = N.numberLiteral
            .then (C.char('+'))
            .then(N.numberLiteral)
            .flattenDeep()
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },

    "expect flattenDeep (2+2) to return []": function (test) {
        // Main difference with sequence, is that a sequence element could be an array
        test.expect(1);
        // tests here
        const string = '2+2';
        const expected = [];

        const parsing = N.numberLiteral
            .then (C.char('+'))
            .then(N.numberLiteral)
            .thenReturns([])
            .flattenDeep()
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },

    "export subStream(4) to return [h,e,l,l]": function (test) {
        test.expect(1);
        // tests here
        const string = 'hello';
        const expected = ['h','e','l','l'];

        const parsing = F.subStream(4)
                .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value.array(), expected, 'should be equal');
        test.done();
    },

    "export subString(4) to return hell": function (test) {
        test.expect(1);
        // tests here
        const string = 'hello';
        const expected = 'hell';

        const parsing = C.subString(4)
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    }

};
