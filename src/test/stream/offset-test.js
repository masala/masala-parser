import Streams from '../../lib/stream/index';
import C from "../../lib/parsec/chars-bundle";

export default {
    setUp: function (done) {
        done();
    },


    'Parsing ok with a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');


        const parser = C.string('The');
        const parsing = parser.parse(stream, 0);

        test.ok(parsing.isAccepted());
        test.ok(! parsing.isConsumed());
        test.equal(parsing.offset, 3);

        test.done();
    },

    'Parsing ok inside a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');

        const parser = C.string('world');
        const parsing = parser.parse(stream, 4);

        test.ok(parsing.isAccepted());
        test.ok(! parsing.isConsumed());
        test.equal(parsing.offset, 9);

        test.done();
    },

    'Parsing ok completing a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');

        const parser = C.letter().or(C.char(' ')).rep();
        const parsing = parser.parse(stream);

        test.ok(parsing.isAccepted());
        test.ok(parsing.isConsumed());
        test.equal(parsing.offset, 22);

        test.done();
    },




}