import stream from '../../lib/stream/index';
import {F, C, N} from '../../lib/parsec/index';
import unit from "../../lib/data/unit";

export default {
    setUp: function (done) {
        done();
    },

    'expect (chain) to be accepted': function (test) {

        const lower = C.char('x');

        const upper = F.satisfy(val => val === 'x');

        const parser = lower.chain(upper);

        const response = parser.parse(stream.ofString('x'));

        test.ok(response.isAccepted(), 'Should be accepted');

        test.done();

    },
    'expect (chain) to be rejected': function (test) {

        const lower = C.char('x');

        const upper = F.satisfy(val => val === 'y');

        const parser = lower.chain(upper);

        const response = parser.parse(stream.ofString('x'));

        test.ok(!response.isAccepted(), 'Should be rejected');

        test.done();

    },
    'expect (chain) to be accepted and offset to have move': function (test) {

        const lower = C.char('x');

        // satisfy makes the stuff move only if accepted
        const upper = F.satisfy(val => val === 'x');

        const parser = lower.chain(upper);

        const response = parser.parse(stream.ofString('x'));

        test.ok(response.offset === 1, 'Should have moved');

        test.done();

    },
    'expect (chain) to be accepted and offset to have move more': function (test) {

        const lower = C.string('xyz');

        // satisfy makes the stuff move only if accepted
        const upper = F.satisfy(val => val === 'xyz');

        const parser = lower.chain(upper.then(upper));

        const response = parser.parse(stream.ofString('xyzxyz'));

        test.equal(response.offset, 2, 'Should have moved more');

        test.done();

    },
    'expect (chain) to be find back the source offset': function (test) {

        const lower = C.string('xyz');

        // satisfy makes the stuff move only if accepted
        const upper = F.satisfy(val => val === 'xyz');

        const parser = lower.chain(upper.then(upper));

        const response = parser.parse(stream.ofString('xyzxyz'));

        test.equal(response.input.source.offsets[response.offset], 6, 'Should have find stringStream offset');

        test.done();
    },

    'expect (chain) to be accepted again': function (test) {
        test.expect(1);
        // tests here
        var p1 = N.numberLiteral().thenLeft(C.char(' ').opt()),
            p2 = F.any().then(F.any()).thenLeft(F.eos()).map(function (r) {
                return r[0] + r[1];
            });

        test.equal(
            p1.chain(p2).parse(stream.ofString('12 34'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (chain) to return 46': function (test) {
        test.expect(1);
        // tests here
        const p1 = N.numberLiteral().thenLeft(C.char(' ').opt()),
            p2 = F.any().then(F.any()).thenLeft(F.eos())
                .array().map(function (r) {
                return r[0] + r[1];
            });

        test.equal(
            p1.chain(p2).parse(stream.ofString('12 34'), 0).value,
            46
        );
        test.done();
    },

    'expect (chain) to add multiple numbers ': function (test) {
        const token = N.numberLiteral().then(spaces().opt().drop());
        const lex = F.satisfy(number => number > 0).rep()
            .map(values => values.array().reduce((acc, n) => acc + n, 0 ));


        const parsing = token.chain(lex).parse(stream.ofString('10 12 44'), 0)


        test.ok(parsing.isConsumed(), 'should have been consumed');
        test.equal(parsing.value, 66, 'should be 66.');
        test.done();

    },

    'expect (chain) to be not satisfied by upper level ': function (test) {
        const token = N.numberLiteral().then(spaces().opt().drop());
        const lex = F.satisfy(number => number > 0).rep()
            .map(values => values.array().reduce((acc, n) => acc + n, 0 ));


        const parsing = token.chain(lex).parse(stream.ofString('10 -12 44'), 0)


        test.ok(!parsing.isConsumed(), 'should have been consumed');
        test.done();

    }
}

function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}