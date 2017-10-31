import Streams from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';

let value = undefined;
let accepted = undefined;

function testParser(parser, string) {
    let stream = Streams.ofString(string);
    let parsing = parser.parse(stream);

    value = parsing.value;
    accepted = parsing.isAccepted();
}

export default {
    setUp: function(done) {
        done();
    },

    'expect flatten result to be ok': function(test) {
        const string = 'foobar';
        // tests here
        const parser = C.char('f')
            .then(C.char('o'))
            .then(C.char('o'))
            .then(C.string('bar'));
        testParser(parser, string);
        test.deepEqual(value, ['f', 'o', 'o', 'bar'], 'flatten result not ok');
        test.done();
    },

    'expect thenReturns to be ok when empty': function(test) {
        const string = 'some';
        // tests here
        const parser = F.any.rep().then(F.eos).thenReturns([]);
        testParser(parser, string);
        test.ok(accepted);
        test.deepEqual(value, [], 'flatten result not ok');
        test.done();
    },

    'expect startsWith to start': function(test) {
        const string = ' world';
        const object='hello';
        // tests here
        const parser = F.startsWith(object).then(C.string(' world')).then(F.eos.drop());
        testParser(parser, string);
        test.ok(accepted);
        test.equals(value.join(''), 'hello world');
        test.done();
    },
};
