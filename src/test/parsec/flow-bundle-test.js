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
    'test wordsUntil': function(test) {
        const line = Streams.ofString('I write until James appears');

         
        const combinator = F.moveUntil(C.string('James')).thenLeft(F.any);
        const value = combinator.parse(line).value;

        test.equals(value, 'I write until ');
        test.done();
    },
    'test wordsUntil Not found': function(test) {
        const line = Streams.ofString('I write until James appears');


        const combinator = F.moveUntil(C.string('Indiana'))
            .then(C.string('I'))
            .thenLeft(F.any);
        const accepted = combinator.parse(line).isAccepted();

        test.ok(!accepted);
        test.done();
    },
    'test wordsUntil found with more parsers': function(test) {
        const line = Streams.ofString('I write until James Bond appears');


        const combinator = F.moveUntil(C.string('James'))
            .thenLeft(C.string('James Bond'))
            .thenLeft(F.any);
        const value = combinator.parse(line).value;

        test.equals(value, 'I write until ');
        test.done();
    },
    'test wordsUntil  found with failing parser': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        
        const combinator = F.moveUntil(C.string('James'))
            .thenLeft(C.string('Indiana jones'))
            .thenLeft(F.any);
        const accepted = combinator.parse(line).isAccepted();

        test.ok(!accepted);
        test.done();
    },
};
