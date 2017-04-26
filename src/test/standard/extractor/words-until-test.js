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
        const combinator = x.wordsUntilFast('XYZ');
        const value = combinator.parse(line).value;

        test.equals(value, 'so');
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


