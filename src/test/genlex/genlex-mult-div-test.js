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

const priorToken = () => tkKey('*').or(tkKey('/'));


function terminal() {
    return tkNumber.or(F.lazy(priorExpr));
}

function priorExpr() {
    return terminal().flatMap(optSubPriorExp);
}

function optSubPriorExp(priorValue) {
    // console.log('previousValue', priorValue);
    return subPriorExpr(priorValue).opt()
        .map(opt => opt.isPresent() ? opt.get() : priorValue);
}


function subPriorExpr(priorValue) {

    return priorToken().then(terminal())
        .map(([token, left]) => token === '*' ? priorValue * left : priorValue / left)
        .flatMap(optSubPriorExp)
}


function multParser() {
    let keywords = ['*', '/'];
    let tokenizer = genlex
        .generator(keywords)
        .tokenBetweenSpaces(token.builder);

    return tokenizer.chain(priorExpr().thenLeft(F.eos().drop()));
}

export default {
    setUp: function (done) {
        done();
    },

    'expect multExpr to make mults': function (test) {
        let parsing = multParser().parse(stream.ofString('3 * 4'));
        test.equal(parsing.value, 12, 'simple multiplication');

        parsing = multParser().parse(stream.ofString('14 / 4'));

        test.equal(parsing.value, 3.5, 'simple division');

        parsing = multParser().parse(stream.ofString('14 / 4*3 '));

        test.equal(parsing.value, 10.5, 'combine mult and div');

        parsing = multParser().parse(stream.ofString('14 / 4*3 /2*  2 '));

        test.equal(parsing.value, 10.5, 'combine more mult and div');

        test.done();
    }

}