import genlex from '../../lib/genlex/genlex';
import token from '../../lib/genlex/token';
import {F, C, N} from '../../lib/parsec/index';
import stream from '../../lib/stream/index';


//
// Facilities
//

var tkNumber = token.parser.number,
    tkKeyword = token.parser.keyword;

function tkKey(s) {
    return tkKeyword.match(s);
}


function addToken() {
    return tkKey('+').or(tkKey('-'));
}

function operation(){
    return tkNumber.then(addToken()).then(tkNumber)
        .map( ([left, op, right]) => op ==='+' ? left+right : left - right );
}



function numberParser() {
    let keywords = ['*', '/', '-', '+'];
    let tokenizer = genlex
        .generator(keywords)
        .tokenBetweenSpaces(token.builder).debug('tokenizer');

    return tokenizer.chain(operation().thenLeft(F.eos().drop()));
}

export default {
    setUp: function (done) {
        done();
    },

    'expect operation combinations': function (test) {

        let /*parsing = numberParser().parse(stream.ofString('10-4'));
        test.equal(parsing.value, 6, 'addition before division');*/

        parsing = numberParser().parse(stream.ofString('+3 -  4'));
        test.equal(parsing.value, -1);



        test.done();
    }

}