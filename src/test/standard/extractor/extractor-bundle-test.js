import X from '../../../lib/standard/extractor/extractor-bundle';
import {F,C} from '../../../lib/parsec/index';
import stream from '../../../lib/stream/index';


export default {
    setUp: function (done) {
        done();
    },

    'test spaces': function (test) {

        const line = stream.ofString('    this starts with 4 spaces');

        const x = new X();
        const combinator = x.spaces().thenLeft(F.any);
        const value = combinator.parse(line).value;
        console.log('value spaces', value);
        test.equals(value.length,4 );
        test.done();
    }
}



