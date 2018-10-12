import Streams from '../../lib/stream/index';;
import {F, C, N} from "../../lib/parsec";
import unit from "../../lib/data/unit";

export default {
    setUp: function (done) {
        done();
    },


    'response ok with a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');


        const parser = C.string('The');
        const response = parser.parse(stream, 0);

        test.ok(response.isAccepted());
        test.ok(! response.isEos());
        test.equal(response.offset, 3);

        test.done();
    },

    'response ok inside a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');

        const parser = C.string('world');
        const response = parser.parse(stream, 4);

        test.ok(response.isAccepted());
        test.ok(! response.isEos());
        test.equal(response.offset, 9);

        test.done();
    },

    'response ok completing a StringStream': function(test) {

        const stream = Streams.ofString('The world is a vampire');

        const parser = C.letter().or(C.char(' ')).rep();
        const response = parser.parse(stream);

        test.ok(response.isAccepted());
        test.ok(response.isEos());
        test.equal(response.offset, 22);

        test.done();
    },

    'response fails at StringStream start': function(test) {

        const stream = Streams.ofString('The world is a vampire');

        const parser = C.string('That');
        const response = parser.parse(stream);

        test.ok(!response.isAccepted());
        test.equal(response.offset, 0);

        test.done();
    },

    'response fails inside a StringStream': function(test) {

        const stream = Streams.ofString('abc de');

        const parser = C.string('abc').then(C.string('fails'));
        const response = parser.parse(stream);

        test.ok(!response.isAccepted());
        test.equal(response.offset, 3);

        test.done();
    },

    'response passes the StringStream': function(test) {

        const stream = Streams.ofString('abc de');

        const parser = C.letter().or(C.char(' ')).rep().then(C.string('!!!'));
        const response = parser.parse(stream);

        test.ok(!response.isAccepted());

        // because an error has NEVER stream consumed
        test.ok(!response.isEos());
        test.equal(response.offset, stream.source.length);

        test.done();
    },

    'response with a failed try is rejected, and offset is 0': function(test) {
        const stream = Streams.ofString('abc de');

        const parser = F.try(C.string('abc').then(C.char('x')))
            .or(C.string('x'));
        const response = parser.parse(stream);

        test.ok(!response.isAccepted());
        test.equal(response.offset, 0);

        test.done();

    },





    'ParserStream.get() is idemPotent':function(test){
        const lower = N.number().then(spaces().opt().drop());


        const lowerStream = Streams.ofString('10 12 44');
        const parserStream = Streams.ofParser(lower, lowerStream);

        let tryGet = parserStream.get(0);
        test.ok(tryGet.isSuccess());
        test.equal(10, tryGet.value);

        let firstOffset = parserStream.getOffset(1);
        test.equal(parserStream.offsets[1], 3);

        tryGet = parserStream.get(1);
        test.ok(tryGet.isSuccess());
        test.equal(12, tryGet.value);

        test.equal(parserStream.offsets[1], 3);

        let secondOffset = parserStream.getOffset(1);

        test.ok(firstOffset, secondOffset);



        test.done();
    }



}


function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}