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

export default  {
    setUp: function (done) {
        done();
    },

    'expect flatten result to be ok': function (test) {

        const string = 'foobar';
        // tests here
        const parser = C
            .char('f')
            .then(C.char('o'))
            .then(C.char('o'))
            .then(C.string('bar'));
        testParser(parser, string);
        test.deepEqual(value, ['f', 'o', 'o', 'bar'], 'flatten result not ok');
        test.done();
    },

    'expect flatten result to be ok when empty': function (test) {

        const string = 'some';
        // tests here
        const parser = F.any.rep()
            .then(F.eos)
            .thenReturns([]);
        testParser(parser, string);
        test.ok(accepted);
        test.deepEqual(value, [], 'flatten result not ok');
        test.done();
    },

}
