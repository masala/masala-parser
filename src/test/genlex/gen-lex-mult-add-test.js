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

/**
 * Yield is '+' and '-' ; Prior is '*' and '/'
 */
function yieldToken() {
    return tkKey('+').or(tkKey('-'));
}

function priorToken() {
    return tkKey('*').or(tkKey('/'));
}

/**
 * E -> T E'
 * E' -> + TE'  |  eps
 * T -> F T'
 * T' -> * FT'  |  eps
 * F -> NUMBER | ID | ( E )
 *
 * Expr -> Prior then SubExpr
 * YieldExpr -> ( + then SubExpr then YieldExpr ).opt()
 * SubExpr -> Terminal then PriorExpr
 * PriorExpr -> ( * then Terminal then PriorExpr).opt()
 * Terminal -> Number | Identifiant | (Expr)
 *
 * Expr -> SubExpr then OptYieldExpr
 * OptYieldExpr -> YieldExpr.opt()
 * YieldExpr ->  + then SubExpr then YieldExpr
 * SubExpr -> Terminal then PriorExpr
 * OptPriorExpr -> PriorExpr.opt()
 * PriorExpr ->  * then Terminal then PriorExpr
 * Terminal -> Number | Identifiant | (Expr)
 */

function expr() {
    return subExpr().debug('subExpr').flatMap(optYieldExpr);
}


function optYieldExpr(left) {

    return yieldExpr(left).opt()
        .map(opt => opt.isPresent() ? opt.get() : left)
}

function yieldExpr(left) {
    return yieldToken()
        .then(subExpr())
        .map(([token, right]) =>
            token === '+' ? left + right : left - right)
        .flatMap(optYieldExpr);
}


function terminal() {
    return tkNumber.or(F.lazy(expr));
}

function subExpr() {
    return terminal().flatMap(optPriorExp);
}

function optPriorExp(priorValue) {
    // console.log('previousValue', priorValue);
    return priorExpr(priorValue).opt()
        .map(opt => opt.isPresent() ? opt.get() : priorValue);
}


function priorExpr(priorValue) {

    return priorToken().then(terminal())
        .map(([token, left]) => token === '*' ? priorValue * left : priorValue / left)
        .flatMap(optPriorExp)
}


function multParser() {
    let keywords = ['*', '/', '-', '+'];
    let tokenizer = genlex
        .generator(keywords)
        .tokenBetweenSpaces(token.builder);

    return tokenizer.chain(priorExpr().thenLeft(F.eos().drop()));
}

export default {
    setUp: function (done) {
        done();
    },

    'expect operation combinations': function (test) {

        let parsing = multParser().parse(stream.ofString('3'));
        test.equal(parsing.value, 3);


        /*
         let parsing = multParser().parse(stream.ofString('3 * 4 + 2'));
         test.equal(parsing.value, 14);

         parsing = multParser().parse(stream.ofString('3 - 14 / 2'));

         test.equal(parsing.value, -4, 'addition before division');

         parsing = multParser().parse(stream.ofString('16 / -4* 3 +2'));

         test.equal(parsing.value, -10, 'combine mult, div, addition');
         */
        test.done();
    }

}