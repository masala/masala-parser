import Token from '../../lib/standard/token-bundle';
import stream from '../../lib/stream/index';
import {F,C,N} from '../../lib/parsec/index';

let value = undefined;
let accepted = undefined;

function testAParser(parser, string){
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
    accepted = parsing.isAccepted();


}

export default {
    setUp: function (done) {
        done();
    },

    'test bad email should fail': function (test) {
        testAParser(Token.email(), 'random text');
        test.ok(!accepted, 'random text should not be recognise as email' )
        test.done();
    },

    'test classic email should be accepted': function (test) {
        testAParser(Token.email(), 'simon.zozol@gmail.com');
        let expected = {email:"simon.zozol@gmail.com"}
        test.deepEqual(value, expected, 'error parsing email' )
        test.done();
    },

    'test greek email should be accepted': function (test) {
        testAParser(Token.email(), 'δοκιμή@παράδειγμα.δοκιμή');
        let expected = {email:"δοκιμή@παράδειγμα.δοκιμή"}
        test.deepEqual(value, expected, 'error parsing email in greek' )
        test.done();
    },
    'test bad email with 2 @ should be rejected': function (test) {
        testAParser(Token.email(), 'simon@zozol@gmail.com');
        test.ok(!accepted, 'email adress should reject 2 @ (unless in double quote)' )
        test.done();
    },

    'test email with one quote should be rejected': function (test) {
        testAParser(Token.email(), 'simon"zozol@gmail.com');
        test.ok(!accepted, 'email adress should reject unbalanced double quote' )
        test.done();
    },

    'test email with two quotes should be accepted': function (test) {
        testAParser(Token.email(), 'simon"le gr@nd"@holy-python.com');
        let expected = {email:'simon"le gr@nd"@holy-python.com'}
        test.deepEqual(value, expected, 'error parsing email with quote' )
        test.done();
    },

    'test two emails integration should be accepted': function (test) {
        const testString = 'simon@holy-python.com δοκιμή@παράδειγμα.δοκιμή'
        testAParser(Token.email().thenLeft(C.char(' ')).then(Token.email()) , testString);
        let expected = [{email:'simon@holy-python.com'}, {email:'δοκιμή@παράδειγμα.δοκιμή'}]
        test.deepEqual(value, expected, 'error parsing email chain' )
        test.done();
    },


    'test simple date should be accepted': function(test){
        const testString = '10-12-2016';
        testAParser(Token.date() , testString);
        let expected = '2016-12-10';
        test.ok(accepted);
        test.deepEqual(value, expected, 'error parsing date');
        test.done();
    }

}