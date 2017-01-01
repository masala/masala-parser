import Token from '../../lib/standard/_token';
import stream from '../../lib/stream/index';
import P from '../../lib/parsec/parser';

let value = undefined;
let accepted = undefined;

function testAParser(parser, string){
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
    accepted = parsing.isAccepted();

    console.info('parsing', parsing, '\n');
}

export default {
    setUp: function (done) {
        done();
    } ,

    'test blank': function (test) {
        test.expect(1);

        testAParser(Token.blank(), '  \t   ');
        test.equals('', value, '`blank` must resolve control characters as a void string' )

        test.done();
    },
    
    'rawTextUntilChar': function (test) {
        test.expect(4);

        // read the text until the stop character
        testAParser(Token.rawTextUntilChar('*'), '123456*789');
        test.equals('123456', value
            , '`rawTextUntilChar` should return "123456"' );

        // read the text until ANY of the stop characters (here, "-")
        testAParser(Token.rawTextUntilChar('*-'), '987654-321');
        test.equals('987654', value
            , '`rawTextUntilChar` should return "987654"' );

        //
        testAParser(Token.rawTextUntilChar('*-'), '*');
        test.ok(!accepted, "`rawTextUntilChar('*-')') should reject '*' as an empty string");


        testAParser(Token.rawTextUntilChar('*-', true), '*');
        test.equals('', value
            , "`rawTextUntilChar('*-', true)') should accept '*' as an empty string" );

        test.done();
    },

    'test eol': function (test) {
        test.expect(2);

        // tests here
        testAParser(Token.eol(), '\n');
        test.equals('\n', value, '`eol` must accept \\n and return \\n' )

        testAParser(Token.eol(), ' \n');
        test.ok(!accepted, '`eol` must reject any chain that does not start with \\n' )

        test.done();
    },


    'test combination of token': function (test) {
        test.expect(1);

        // tests here
        let parser = Token.rawTextUntilChar('*')
            .thenLeft(P.char('*'))
            .thenLeft(Token.blank())
            .then(Token.rawTextUntilChar('-'))
            .thenLeft(P.char('-'))
            .then(Token.eol())
            .flattenDeep()
        testAParser(parser, 'toto* tata-\n');

        const expected = ['toto','tata','\n']


        test.deepEqual(expected, value, 'combination failed' )


        test.done();
    },




}