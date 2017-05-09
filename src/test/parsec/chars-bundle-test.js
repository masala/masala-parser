import stream from '../../lib/stream/index';
import {C} from '../../lib/parsec/index';

let value = undefined;

function testParser(parser, string) {
    let myStream = stream.ofString(string);
    let parsing = parser.parse(myStream);

    value = parsing.value;
}

export default {
    setUp: function(done) {
        done();
    },

    'expect accent to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString('é'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },
    'expect cyriliq to be accepted': function(test) {
        test.expect(2);
        // tests here
        //Белград
        //български
        test.equal(
            C.utf8Letter.parse(stream.ofString('Б'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.equal(
            C.utf8Letter.parse(stream.ofString('б'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },
    'expect dash to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString('-'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },
    'expect "nothing" to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString(''), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },
};
