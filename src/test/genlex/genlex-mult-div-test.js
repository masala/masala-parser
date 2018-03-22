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

const priorToken = () => tkKey('*').or(tkKey('/'))


const multExpr = () => terminal().then(subMultExpr().opt())
    .map(([left, optRight]) => left * optRight.orElse(1));


const subMultExpr = function () {

    return tkKey('*').drop().then(terminal())
        .then(F.lazy(subMultExpr).opt())
        .map(([left, optRight]) => left * optRight.orElse(1))
};

function terminal() {
    return tkNumber.or(F.lazy(multExpr));
}

function priorExpr() {
    return terminal().then(subPriorExpr().opt())
        .map(([left, optRight]) => {
            if (optRight.isPresent()){
                let [operator, right] = optRight.get();
                return operator === '*' ? left*right : left/right;
            }else{
                return left;
            }

        });

}

function subPriorExpr() {

    return priorToken().then(terminal())
        .then(F.lazy(subPriorExpr).opt())
        .map(([token, left, optRight]) => {
            console.log(token, left, optRight);
            return [token, left * optRight.orElse(1)];
        })
};


function multParser() {
    var keywords = ['*', '/'],
        tokenizer = genlex
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
        console.log('>>>', parsing.value);
        test.equal(parsing.value, 3.5, 'simple division');

        test.done();
    }

}