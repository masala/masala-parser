import X from '../../../lib/standard/extractor/extractor-bundle';
import {F, C} from '../../../lib/parsec/index';
import stream from '../../../lib/stream/index';


export default {
    setUp: function (done) {
        done();
    },


    'test wordsUntilFast string': function (test) {

        const line = stream.ofString('soXYZso');

        const x = new X();
        const combinator = x.wordsUntil('XYZ');
        const parser = combinator.parse(line);
        const value = parser.value;
        const offset = parser.offset;

        test.equals(value, 'so');
        test.equals(offset, 2);
        test.done();
    },
    'test wordsUntilFast string with continuation': function (test) {

        const document = 'start-detect-XYZ-continues';
        const line = stream.ofString(document);

        const start=C.string('start-');
        const x = new X();
        const combinator = start.thenRight(x.wordsUntil('XYZ')).thenLeft(C.string('XYZ-continues'));
        const parser = combinator.parse(line);
        const value = parser.value;
        const offset = parser.offset;

        test.equals(value, 'detect-');
        test.equals(offset, document.length);
        test.done();
    }
}


function _includes(array, value){
    for (let i=0 ; i < array.length;i++){
        if (array[i] === value){
            return true;
        }
    }
    return false;
}


