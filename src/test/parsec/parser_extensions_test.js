import stream from '../../lib/stream/index';
import {F, C, N} from '../../lib/parsec/index';

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

    'expect (returns) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.ok(
            F.returns().parse(stream.ofString(''), 0).isAccepted(),
            'should be accepted.'
        );
        test.done();
    },

    'expect (returns) to return a given value': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.returns(123).parse(stream.ofString(''), 0).value,
            123,
            'should be accepted.'
        );
        test.done();
    },

    'expect (returns) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.error().parse(stream.ofString(''), 0).isAccepted(),
            false,
            'should be accepted.'
        );
        test.done();
    },

    'expect (lazy) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.ok(
            F.lazy(function() {
                return F.returns();
            })
                .parse(stream.ofString(''), 0)
                .isAccepted(),
            'should be accepted.'
        );
        test.done();
    },

    'expect (lazy) to return a given value': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.lazy(function() {
                return F.returns(123);
            }).parse(stream.ofString(''), 0).value,
            123,
            'should be accepted.'
        );
        test.done();
    },
    'expect (lazy with empty params) to return a given value': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.lazy(function() {
                return F.returns(123);
            }, []).parse(stream.ofString(''), 0).value,
            123,
            'should be accepted.'
        );
        test.done();
    },

    'expect (lazy) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.lazy(function() {
                return F.error();
            })
                .parse(stream.ofString(''), 0)
                .isAccepted(),
            false,
            'should be accepted.'
        );
        test.done();
    },

    'expect (lazy) with a parameter to return a given value': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.lazy(
                function(v) {
                    return F.returns(v);
                },
                [123]
            ).parse(stream.ofString(''), 0).value,
            123,
            'should be accepted.'
        );
        test.done();
    },
    'expect (lazy) with multiple parameters to return a given value': function(
        test
    ) {
        test.expect(1);
        // tests here
        test.equal(
            F.lazy(
                function(v1, v2) {
                    return F.returns(v1 + v2);
                },
                [10, 20]
            ).parse(stream.ofString(''), 0).value,
            30,
            'should be accepted.'
        );
        test.done();
    },


    'expect (lazy) with unpacked parameters to fail': function(test) {
        test.expect(1);
        // tests here

        let found = false;
        try {
            const combinator = F.lazy((v1, v2) => F.returns(v1 + v2), 10, 20);
            combinator.parse(stream.ofString(''), 0);
        } catch (e) {
            if (e.includes('packed into an array')) {
                found = true;
            }
        }
        test.ok(found, 'should have catch an error');
        test.done();
    },

    'expect (error) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.error().parse(stream.ofString(''), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (eos) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.eos().parse(stream.ofString(''), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (eos) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.eos().parse(stream.ofString('a'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (satisfy) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.satisfy(function(v) {
                return v === 'a';
            })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (satisfy) to be return the right value': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.satisfy(function(v) {
                return v === 'a';
            }).parse(stream.ofString('a'), 0).value,
            'a',
            'should be the right value.'
        );
        test.done();
    },

    'expect (satisfy) to be return the right offset': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.satisfy(function(v) {
                return v === 'a';
            }).parse(stream.ofString('a'), 0).offset,
            1,
            'should be the right offset.'
        );
        test.done();
    },

    'expect (satisfy) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.satisfy(function(v) {
                return v === 'b';
            })
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (doTry satisfy) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.try(
                F.satisfy(function(v) {
                    return v === 'a';
                })
            )
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (doTry satisfy) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.try(
                F.satisfy(function(v) {
                    return v === 'b';
                })
            )
                .parse(stream.ofString('a'), 0)
                .isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect chaining tries':function(test){

        const p1 = C.char('1');
        const p2 = C.char('2');
        const p3 = C.string('33');
        const parser = C.string("start").then(
            F.try(p1).or(F.try(p2)).or(F.try(p3))
        );

        // should fail
        let response = parser.parse(stream.ofString("start3"));
        test.equal(response.isAccepted(), false)
        test.equal(response.offset, 5);


        // should succeed
        response = parser.parse(stream.ofString("start2"));
        test.equal(response.isAccepted(), true)
        test.equal(response.offset, 6);

        test.done()

    },

    'expect (digit) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.digit().parse(stream.ofString('1'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (digit) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.digit().parse(stream.ofString('a'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (number) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number().parse(stream.ofString('123'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (number) to return 123': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number().parse(stream.ofString('123'), 0).value,
            123,
            'should be accepted.'
        );
        test.done();
    },

    'expect negative (number) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number().parse(stream.ofString('-123'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect negative (number) to return -123': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number().parse(stream.ofString('-123'), 0).value,
            -123,
            'should be accepted.'
        );
        test.done();
    },

    'expect float (number) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number()
                .parse(stream.ofString('123.34e-34'), 0)
                .isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect float (number) to return 123.34e-34': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            N.number().parse(stream.ofString('123.34e-34'), 0).value,
            123.34e-34,
            'should be accepted.'
        );
        test.done();
    },

    'expect (charLiteral) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charLiteral().parse(stream.ofString("'a'"), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (charLiteral) to return a': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charLiteral().parse(stream.ofString("'a'"), 0).value,
            'a',
            'should be accepted.'
        );
        test.done();
    },

    'expect (charLiteral) quote to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charLiteral().parse(stream.ofString("'\\''"), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (charLiteral) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charLiteral().parse(stream.ofString("''"), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (stringLiteral) to be accepted': function(test) {
        test.expect(1);
        // tests here
        try{
            test.equal(
                C.stringLiteral().parse(stream.ofString('"a"'), 0).isAccepted(),
                true,
                'should be accepted.'
            );
        }catch(e){
            console.log(e);
        }

        test.done();
    },

    /*
    'expect (stringLiteral) to return abc': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.stringLiteral().parse(stream.ofString('"abc"'), 0).value,
            'abc',
            'should be accepted.'
        );
        test.done();
    },

    'expect (stringLiteral) empty to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.stringLiteral().parse(stream.ofString('""'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },


    /*
    'expect (occurence 1) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.any().occurrence(1).parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (occurence 1) to return [a]': function(test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            F.any().occurrence(1).parse(stream.ofString('a'), 0).value.array(),
            ['a'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (occurence 2) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.any().occurrence(1).parse(stream.ofString('aa'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (occurence 2) to return [a,a]': function(test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            F.any().occurrence(2).parse(stream.ofString('aa'), 0).value.array(),
            ['a', 'a'],
            'should be accepted.'
        );
        test.done();
    },


///OK
/*
    'expect (occurence 3) to return [a,a,a]': function(test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            F.any().occurrence(3).parse(stream.ofString('aaa'), 0).value.array(),
            ['a', 'a', 'a'],
            'should be accepted.'
        );
        test.done();
    },

    'expect (occurence 0) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            F.any().occurrence(0).parse(stream.ofString('aa'), 0).isAccepted(),
            true,
            'should be accepter.'
        );
        test.done();
    },

    'expect (occurence 0) to return []': function(test) {
        test.expect(1);
        // tests here
        test.deepEqual(
            F.any().occurrence(0).parse(stream.ofString('aa'), 0).value.array(),
            [],
            'should be accepter.'
        );
        test.done();
    },


    "expect chained then (2+2) to return [2,'+' ,2]": function(test) {
        // Main difference with sequence, is that a sequence element could be an array
        test.expect(1);
        // tests here
        const string = '2+2';
        const expected = [2, '+', 2];

        const parsing = N.number()
            .then(C.char('+'))
            .then(N.number()).array()
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },

    'expect chained then (2+2) to return []': function(test) {
        // Main difference with sequence, is that a sequence element could be an array
        test.expect(1);
        // tests here
        const string = '2+2';
        const expected = [];

        const parsing = N.number()
            .then(C.char('+'))
            .then(N.number())
            .returns([])
            .parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
    },


    'export subStream(4) to return [h,e,l,l]': function(test) {
        test.expect(1);
        // tests here
        const string = 'hello';
        const expected = ['h', 'e', 'l', 'l'];

        const parsing = F.subStream(4).parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value.array(), expected, 'should be equal');
        test.done();
    },

    'export subString(4) to return hell': function(test) {
        test.expect(1);
        // tests here
        const string = 'hello';
        const expected = 'hell';

        const parsing = C.subString(4).parse(stream.ofString(string), 0);

        test.deepEqual(parsing.value, expected, 'should be equal');
        test.done();
   }*/
};
