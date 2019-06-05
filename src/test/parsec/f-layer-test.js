import Streams from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';


export default {
    setUp: function (done) {
        done();
    },

    'expect F.layer(parser) to work as parser with backtrak on success': function (test) {
        const parser = C.char('a').thenEos();
        const successInput = 'a';
        const failInput = 'b';

        const layer = F.layer(parser);

        let response = layer.parse(Streams.ofString(successInput));

        test.ok(response.isAccepted());
        test.equal(response.offset, 0);

        // Fail test
        response = layer.parse(Streams.ofString(failInput));

        test.ok(!response.isAccepted());
        test.equal(response.offset, 0);
        test.done();
    },

    'expect F.layer(parser).and(other) to succeed': function (test) {
        try {
            const first = C.char('a').then(C.char('a')).thenEos().array().map(r => r.length);

            const second = C.string('aa').thenEos();

            const successInput = 'aa';

            const layer = F.layer(first).and(second).and(second).array();

            let response = layer.parse(Streams.ofString(successInput));

            test.ok(response.isAccepted());
            test.deepEqual(response.value, [2, 'aa', 'aa']);
            test.equal(response.offset, 2);
        }catch (e) {
            console.log(e);
        }
        test.done();
    },

    'expect F.layer(first).and(second).and(third) to be associative': function (test) {
        const first = C.char('a').then(C.char('a')).thenEos().array().map(r => r.length);
        const second = C.char('a').then(C.char('a')).thenEos().array().map(r => r.join('-'));
        const third = C.string('aa').thenEos();

        const input = 'aa';

        const layer = F.layer(first).and(second).and(third).array();

        let response = layer.parse(Streams.ofString(input));

        test.ok(response.isAccepted());
        test.deepEqual(response.value, [2, 'a-a', 'aa']);
        test.equal(response.offset, 2);
        test.done();
    },
    'expect F.layer(parser).and(other) to fail with second': function (test) {
        const first = C.char('a').then(C.char('a')).array().thenEos().map(r => r.length);
        const second = C.string('aaFAIL').thenEos();

        const successInput = 'aa';

        const layer = F.layer(first).and(second).array();

        let response = layer.parse(Streams.ofString(successInput));

        test.ok(! response.isAccepted());
        test.equal(response.offset, 0);
        test.equal(response.value, undefined);
        test.done();
    },
    'expect F.layer(parser).and(other) to fail with first': function (test) {
        const first = C.char('a').then(C.char('a')).thenEos().map(r => r.length);

        const second = C.string('aaSUCCESS').thenEos();

        const successInput = 'aaSUCCESS'; // first fail by not meeting Eos
        const layer = F.layer(first).and(second);

        let response = layer.parse(Streams.ofString(successInput));

        test.ok(! response.isAccepted());
        test.equal(response.offset, 2); // stop at first because could not find the Eos
        test.equal(response.value, undefined);
        test.done();
    },

    'expect F.layer(parser).and(other) to not move on the second after first fails': function (test) {
        const first = C.char('a').then(C.char('a')).thenEos().map(r => r.length);

        let found = false;
        const second = C.string('aaSUCCESS').thenEos().map(x => {
            found = true;
            return x;
        });

        const successInput = 'aaSUCCESS'; // first fail by not meeting Eos

        const layer = F.layer(first).and(second);
        let response = layer.parse(Streams.ofString(successInput));

        test.ok(! response.isAccepted());
        test.equal(response.offset, 2);
        test.equal(false, found); // second was not even tried
        test.done();
    },



}