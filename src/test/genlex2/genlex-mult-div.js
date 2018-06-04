import {GenLex, getMathGenLex} from '../../lib/genlex2/genlex';
import {F, C, N} from '../../lib/parsec/index';
import stream from '../../lib/stream/index';

/*
 Implementing general solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> NUMBER | ( E )   // missing | -F   (https://en.wikipedia.org/wiki/Operator-precedence_parser)

 E== expr
 T == subExpr
 E'== optPlusExpr
 T' == optMultExpr
 F == terminal

 expr -> subExpr optPlusExpr'
 optPlusExpr -> ( + then subExpr then F.lazy(optPlusExpr) ).opt()
 subExpr -> terminal then optMultExpr
 optMultExpr -> ( * then terminal then F.lazy(optMultExpr) ).opt()
 F -> F.try( '(' then expr then ')' ).or(N.litteral)    // care of priority !

 */


// tokens
const genlex = getMathGenLex();
const {number, plus, minus, mult, div, open, close} = genlex.tokens();

const priorToken = () => mult.or(div);


function terminal() {
    return parenthesis()
        .or(number)
        .or(negative())
        .or(F.lazy(priorExpr))
}

function negative() {
    return minus.drop().then(F.lazy(terminal)).map(x => -x);
}

function parenthesis() {
    return open.drop().then(F.lazy(priorExpr)).then(close.drop())
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

    const parser = priorExpr();

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
    }



}