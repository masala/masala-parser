import Token from '../../lib/standard/token';
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


    'test fourSpacesBlock1': function (test) {
        testAParser(Token.fourSpacesBlock(), 'foo     bar');
        test.ok(!accepted, 'fourSpacesBlock must reject anything not starting with a 4 spaces block or equivalent ' )
        test.done();
    },

    'test fourSpacesBlock2': function (test) {
        testAParser(Token.fourSpacesBlock(), '    ');
        test.ok(!accepted, 'fourSpacesBlock must accept 4 spaces' )
        test.done();
    },

    'test fourSpacesBlock3': function (test) {
        testAParser(Token.fourSpacesBlock(), '\t');
        test.ok(!accepted, 'fourSpacesBlock must accept tab character' )
        test.done();
    },

    'test fourSpacesBlock': function (test) {
        testAParser(Token.fourSpacesBlock(), '  \u00A0  ');
        test.ok(!accepted, 'fourSpacesBlock must accept a mix of breakable and non-breakable spaces' )
        test.done();
    },


}