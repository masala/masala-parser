import Streams from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';
import {GenLex} from "../../lib";

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

    'subStream is ok on string stream':function (test){


        const text = 'Hello World';
        const parser = F.subStream(6).then(C.string('World'));

        const response = parser.parse(Streams.ofString(text));

        test.ok(response.isAccepted());

        test.equal(7, response.value.size()); // 6 for the stream, one for World

        test.done();

    },

    'subStream is ok on genlex stream':function (test){

        const genlex = new GenLex();
        genlex.setSeparatorsParser(F.not(C.charIn('+-<>[],.')));
        genlex.keywords(['+', '-', '<', '>', '[', ']', ',', '.']);
        const grammar = F.subStream(4).drop().then(F.any().rep());

        const parser = genlex.use(grammar);


        const text = '++++ and then >>';


        const response = parser.parse(Streams.ofString(text));

        test.ok(response.isAccepted());
        test.equal(2,response.value.size());

        test.done();

    },

    'not parser should not eat offset':function(test){

        const text = 'this is a line';
        const line = text+'\n';

        const eol = C.char('\n');
        const parser = F.not(eol).rep();

        let response = parser.parse(Streams.ofString(line));
        test.ok(response.isAccepted());
        test.equal(text.length, response.offset);

        const withParser = F.not(eol).rep().then(eol);
        response = withParser.parse(Streams.ofString(line));
        test.ok(response.isAccepted());
        test.equal(line.length, response.offset);

        test.done();

    },

    'expect flatten result to be ok': function(test) {
        const string = 'foobar';
        // tests here
        const parser = C.char('f')
            .then(C.char('o'))
            .then(C.char('o'))
            .then(C.string('bar'))
            .array();
        testParser(parser, string);
        test.deepEqual(value, ['f', 'o', 'o', 'bar'], 'flatten result not ok');
        test.done();
    },

    'expect returns to be ok when empty': function(test) {
        const string = 'some';
        // tests here
        const parser = F.any().rep().then(F.eos()).returns([]);
        testParser(parser, string);
        test.ok(accepted);
        test.deepEqual(value, [], 'flatten result not ok');
        test.done();
    },

    'expect startWith to start': function(test) {
        const string = ' world';
        const object = 'hello';
        // tests here
        const parser = F.startWith(object)
            .then(C.string(' world'))
            .then(F.eos().drop());
        testParser(parser, string);
        test.ok(accepted);
        test.equals(value.join(''), 'hello world');
        test.done();
    },

    'test moveUntilFast string': function(test) {
        const line = Streams.ofString('soXYZso');

        const combinator = F.moveUntil('XYZ');
        const parser = combinator.parse(line);
        const value = parser.value;
        const offset = parser.offset;

        test.equals(value, 'so');
        test.equals(offset, 2);
        test.done();
    },
    'test moveUntilFast string with continuation': function(test) {
        const document = 'start-detect-XYZ-continues';
        const line = Streams.ofString(document);

        const start = C.string('start-');

        const combinator = start
            .drop()
            .then(F.moveUntil('XYZ'))
            .then(C.string('XYZ-continues').drop())
            .single();
        const parser = combinator.parse(line);
        const value = parser.value;
        const offset = parser.offset;

        test.equals(value, 'detect-');
        test.equals(offset, document.length);
        test.done();
    },
    'test moveUntilFast array of string with continuation': function(test) {
        const document = 'start-detect-XYZ-continues';
        const line = Streams.ofString(document);

        const start = C.string('start-');

        const combinator = start
            .drop()
            .then(F.moveUntil(['ABC', 'ZE', 'XYZ']))
            .then(C.string('XYZ-continues').drop())
            .single();

        const parser = combinator.parse(line);
        const value = parser.value;
        const offset = parser.offset;

        test.equals(value, 'detect-');
        test.equals(offset, document.length);
        test.done();
    },
    'test moveUntilFast string fails': function(test) {
        const document = 'start-detect-XYZ-continues';
        const line = Streams.ofString(document);

        const start = C.string('start-');

        const combinator = start
            .drop()
            .then(F.moveUntil('EEE'))
            .then(C.string('XYZ-continues').drop());

        const parsing = combinator.parse(line);

        test.ok(!parsing.isAccepted());
        test.done();
    },
    'test moveUntilFast array of string fails': function(test) {
        const document = 'start-detect-XYZ-continues';
        const line = Streams.ofString(document);

        const start = C.string('start-');

        const combinator = start
            .drop()
            .then(F.moveUntil(['ABC', 'ZE', 'EEE']))
            .then(C.string('XYZ-continues').drop());

        const parsing = combinator.parse(line);

        test.ok(!parsing.isAccepted());
        test.done();
    },
    'test moveUntilFast fails if array stream': function(test) {
        const document = ['More', 'XYZ'];
        const line = Streams.ofArray(document);

        const combinator = F.moveUntil(['ABC', 'ZE', 'XYZ']);
        let found = false;
        try {
            combinator.parse(line);
        } catch (e) {
            if (e === 'Input source must be a String') {
                found = true;
            }
        }

        test.ok(found);
        test.done();
    },
    'test moveUntilFastString fails if array stream': function(test) {
        const document = ['More', 'XYZ'];
        const line = Streams.ofArray(document);

        const combinator = F.moveUntil('XYZ');
        let found = false;
        try {
            combinator.parse(line);
        } catch (e) {
            if (e === 'Input source must be a String') {
                found = true;
            }
        }

        test.ok(found);
        test.done();
    },

    'test moveUntil': function(test) {
        const line = Streams.ofString('I write until James appears');

        const combinator = F.moveUntil(C.string('James')).then(F.any().drop()).single();
        const value = combinator.parse(line).value;

        test.equals(value, 'I write until ');
        test.done();
    },
    'test moveUntil Not found': function(test) {
        const line = Streams.ofString('I write until James appears');

        const combinator = F.moveUntil(C.string('Indiana'))
            .then(C.string('I'))
            .then(F.any().drop());
        const accepted = combinator.parse(line).isAccepted();

        test.ok(!accepted);
        test.done();
    },
    'test moveUntil  found with failing parser': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        const combinator = F.moveUntil(C.string('James')).then(F.dropTo(F.eos()));
        const accepted = combinator.parse(line).isAccepted();

        test.ok(!accepted);
        test.done();
    },
    'test dropTo with string': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        const combinator = F.dropTo('James')
            .then(C.string(' Bond appears'))
            .then(F.eos());
        const accepted = combinator.parse(line).isAccepted();

        test.ok(accepted);
        test.done();
    },
    'test dropTo with string fail': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        const combinator = F.dropTo('James')
            .then(C.string(' Bond appears'))
            .then(F.eos());
        const accepted = combinator.parse(line).isAccepted();

        test.ok(accepted);
        test.done();
    },
    'test dropTo with parser': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        const combinator = F.dropTo(C.string('James'))
            .then(C.string(' Bond appears'))
            .then(F.eos());
        const accepted = combinator.parse(line).isAccepted();

        test.ok(accepted);
        test.done();
    },
    'test moveUntil found with more parsers': function(test) {
        const line = Streams.ofString('I write until James Bond appears');

        const combinator = F.moveUntil(C.string('James'))
            .then(F.dropTo('appears'))
            .then(F.eos().drop())
            .single();
        const value = combinator.parse(line).value;

        test.equals(value, 'I write until ');
        test.done();
    },

    'lazy with a class': function(test) {
        class SomeLazyParser {
            constructor(char) {
                this.char = char;
            }

            first() {
                return C.char(this.char).then(
                    this.second().opt().map(opt => opt.orElse(''))
                );
            }

            second() {
                return C.char('b').then(F.lazy(this.first, ['a'], this));
            }
        }

        const line = Streams.ofString('ababa');

        const combinator = new SomeLazyParser('a').first().then(F.eos().drop());
        const value = combinator.parse(line).value;

        test.equals(value.join(''), 'ababa');
        test.done();
    },
};

