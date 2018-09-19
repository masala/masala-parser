import {getMathGenLex} from '../../lib/genlex/genlex';
import {F} from '../../lib/parsec/index';
import stream from '../../lib/stream/index';

/*
 Implementing general solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> NUMBER | ( E )   (https://en.wikipedia.org/wiki/Operator-precedence_parser)



 * Expr -> SubExpr then OptYieldExpr
 * OptYieldExpr -> YieldExpr.opt()
 * YieldExpr ->  + then SubExpr then YieldExpr
 * PriorExpr -> Terminal then OptPriorExpr
 * OptPriorExpr -> PriorExpr.opt()
 * PriorExpr ->  * then Terminal then OptPriorExpr
 * Terminal -> (Expr)| Number | -Terminal | Expr  // care of priority !

 */


// tokens
const genlex = getMathGenLex();
const {number, plus, minus, mult, div, open, close} = genlex.tokens();

const priorToken = () => mult.or(div);
const yieldToken = () => plus.or(minus);

function terminal() {
    return parenthesis()
        .or(number)
        .or(negative())
        .or(F.lazy(expression))
}

function negative() {
    return minus.drop().then(F.lazy(terminal)).map(x => -x);
}

function parenthesis() {
    return open.drop().then(F.lazy(expression)).then(close.drop())
}

function expression() {
    return priorExpr().flatMap(optYieldExpr);
}


function optYieldExpr(left) {

    return yieldExpr(left).opt()
        .map(opt => opt.isPresent() ? opt.get() : left)
}

function yieldExpr(left) {
    return yieldToken()
        .then(priorExpr())
        .map(([token, right]) =>
            token === '+' ? left + right : left - right)
        .flatMap(optYieldExpr);
}


function priorExpr() {
    return terminal().flatMap(optSubPriorExp);
}

function optSubPriorExp(priorValue) {
    return subPriorExpr(priorValue).opt()
        .map(opt => opt.isPresent() ? opt.get() : priorValue);
}


function subPriorExpr(priorValue) {

    return priorToken().then(terminal())
        .map(([token, left]) => token === '*' ? priorValue * left : priorValue / left)
        .flatMap(optSubPriorExp)
}


function multParser() {

    const parser = expression();

    return genlex.use(parser.then(F.eos().drop()));
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
    },
    'expect multExpr to make negative priorities': function (test) {
        let parsing = multParser().parse(stream.ofString('3 * -4'));
        test.equal(parsing.value, -12, 'negative multiplication');

        test.done();
    },
    'expect Expr to be inside parenthesis': function (test) {

        let parsing = multParser().parse(stream.ofString('3 * (4)'));
        test.equal(parsing.value, 12, 'simple parenthesis expr');

        parsing = multParser().parse(stream.ofString('3 * (2*4)'));
        test.equal(parsing.value, 24, 'more complexe parenthesis expr');

        parsing = multParser().parse(stream.ofString('3 * (2*(4))'));
        test.equal(parsing.value, 24, 'deep parenthesis expr');

        test.done();
    },
    'expect + and * to respect priorities': function (test) {

        let parsing = multParser().parse(stream.ofString('3 +2*4 '));
        test.equal(parsing.value, 11, 'simple multiplication');

        test.done();
    },

    'expect - and / to respect priorities': function (test) {

        let parsing = multParser().parse(stream.ofString('3 + -4/2*5 '));
        test.equal(parsing.value, -7, 'bad priorities');

        test.done();
    },

}