import T from '../../lib/standard/token-bundle';
import stream from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';

let value = undefined;
let accepted = undefined;

function testParser(parser, string) {
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
    accepted = parsing.isAccepted();
}

export default {
    setUp: function(done) {
        done();
    },

    'test bad email should fail': function(test) {
        testParser(T.email(), 'random text');
        test.ok(!accepted, 'random text should not be recognise as email');
        test.done();
    },

    'test classic email should be accepted': function(test) {
        testParser(T.email(), 'simon.zozol@gmail.com');
        let expected = {email: 'simon.zozol@gmail.com'};
        test.deepEqual(value, expected, 'error parsing email');
        test.done();
    },

    'test greek email should be accepted': function(test) {
        testParser(T.email(), 'δοκιμή@παράδειγμα.δοκιμή');
        let expected = {email: 'δοκιμή@παράδειγμα.δοκιμή'};
        test.deepEqual(value, expected, 'error parsing email in greek');
        test.done();
    },
    'test bad email with 2 @ should be rejected': function(test) {
        testParser(T.email(), 'simon@zozol@gmail.com');
        test.ok(
            !accepted,
            'email adress should reject 2 @ (unless in double quote)'
        );
        test.done();
    },

    'test email with one quote should be rejected': function(test) {
        testParser(T.email(), 'simon"zozol@gmail.com');
        test.ok(
            !accepted,
            'email adress should reject unbalanced double quote'
        );
        test.done();
    },

    'test email with two quotes should be accepted': function(test) {
        testParser(T.email(), 'simon"le gr@nd"@holy-python.com');
        let expected = {email: 'simon"le gr@nd"@holy-python.com'};
        test.deepEqual(value, expected, 'error parsing email with quote');
        test.done();
    },

    'test two emails integration should be accepted': function(test) {
        const testString = 'simon@holy-python.com δοκιμή@παράδειγμα.δοκιμή';
        testParser(T.email().thenLeft(C.char(' ')).then(T.email()), testString);
        let expected = [
            {email: 'simon@holy-python.com'},
            {email: 'δοκιμή@παράδειγμα.δοκιμή'},
        ];
        test.deepEqual(value, expected, 'error parsing email chain');
        test.done();
    },

    'test eol should be found': function(test) {
        const testString = 'Hello\nWorld';
        testParser(
            C.string('Hello').then(T.eol).then(C.string('World')).then(F.eos),
            testString
        );
        test.ok(accepted);
        test.done();
    },
    'test eol with Windows \r\n should be found': function(test) {
        const testString = 'Hello\r\nWorld';
        testParser(
            C.string('Hello').then(T.eol).then(C.string('World')).then(F.eos),
            testString
        );
        test.ok(accepted);
        test.done();
    },
    'test blanks': function(test) {
        const testString = 'Hello\t  World';
        testParser(
            C.string('Hello')
                .then(T.blank())
                .then(C.string('World'))
                .then(F.eos),
            testString
        );
        test.ok(accepted);
        test.done();
    },
    'test more blanks': function(test) {
        const testString = 'Hello\t\n  World';
        testParser(
            C.string('Hello')
                .then(T.blank(' \t\n'))
                .then(C.string('World'))
                .then(F.eos),
            testString
        );
        test.ok(accepted);
        test.done();
    },
    'test blanks with Acceptor': function(test) {
        const testString = 'Hello\t\r\n  World';
        const blankAcceptor = C.charIn(' \t').or(T.eol);
        testParser(
            C.string('Hello')
                .then(T.blank(blankAcceptor))
                .then(C.string('World'))
                .then(F.eos),
            testString
        );
        test.ok(accepted);
        test.done();
    },
    'test date': function(test) {
        const testString = '2012-10-12';
        testParser(T.date().then(F.eos), testString);
        test.ok(accepted);
        test.done();
    },
};
