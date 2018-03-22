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



function multExpr () {
    return terminal().then(subMultExpr().opt())
        .map(([left, optRight]) => left * optRight.orElse(1));
}

const subMultExpr = function () {

    return tkKey('*').drop().then(terminal())
        .then(F.lazy(subMultExpr).opt())
        .map(([left, optRight]) => left * optRight.orElse(1))
};

function terminal () {
    return tkNumber.or(F.lazy(multExpr));
}


function multParser() {
    var keywords = ['*'],
        tokenizer = genlex
            .generator(keywords)
            .tokenBetweenSpaces(token.builder);

    return tokenizer.chain(multExpr().thenLeft(F.eos().drop()));
}

export default {
    setUp: function (done) {
        done();
    },

    'expect multExpr to make mults': function (test) {
        const parsing = multParser().parse(stream.ofString('3 * 4 *-2.5'));
        test.equal(parsing.value, -30, 'mult.');
        test.done();
    }

}