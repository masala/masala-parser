const { Streams, F, N, C, X } = require('@masala/parser')

/*
 Implementing general solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> NUMBER | ( E )

 E== expr
 T == subExpr
 E'== optPlusExpr
 T' == optMultExpr
 F == terminal

 expr -> subExpr optPlusExpr'
 optPlusExpr -> ( + then subExpr then F.lazy(optPlusExpr) ).opt()
 subExpr -> terminal then optMultExpr
 optMultExpr -> ( * then terminal then F.lazy(optMultExpr) ).opt()
 F -> F.try( '(' then expr then ')' ).or(N.litteral)

 */

const MULT = Symbol('MULT')
const PLUS = Symbol('PLUS')

function text() {
    return F.not(anyOperation().or(C.charIn('()')))
        .rep()
        .map((v) => parseInt(v.join('').trim()))
}

function blank() {
    return C.char(' ').rep().returns(' ')
}

function operation() {
    return andOperation().or(plusOperation())
}

function anyOperation() {
    return C.string('*').returns(MULT).or(C.string('+').returns(PLUS))
}

function andOperation() {
    return C.string('*').returns(MULT)
}

function plusOperation() {
    return C.string('+').returns(PLUS)
}

function parenthesis(par) {
    return C.char(' ').optrep().drop().then(C.char(par))
}

function parenthesisExpr() {
    return parenthesis('(')
        .then(blank().opt())
        .drop()
        .then(F.lazy(expr))
        .then(parenthesis(')').then(blank().opt()).drop())
}

function expr() {
    return subExpr()
        .then(optionalPlusExpr())
        .map(([left, right]) => left + right.orElse(0))
}

function optionalPlusExpr() {
    return plusExpr().opt()
}

function plusExpr() {
    return plusOperation()
        .drop()
        .then(subExpr())
        .then(F.lazy(optionalPlusExpr))
        .map(([left, right]) => left + right.orElse(0))
}

function subExpr() {
    return terminal()
        .then(optionalMultExpr())
        .map(([left, right]) => left * right.orElse(1))
}

function optionalMultExpr() {
    return multExpr().opt()
}

function multExpr() {
    return andOperation()
        .drop()
        .then(terminal())
        .then(F.lazy(optionalMultExpr))
        .map(([left, right]) => left * right.orElse(1))
}

function terminal() {
    return F.try(parenthesisExpr()).or(text())
}

function combinator() {
    return expr().then(F.eos().drop())
}

const string = '2 + 3 * (  (   4  +   10) + ( 4) ) + 1 * -3'

let stream = Streams.ofChars(string)
let parsing = combinator().parse(stream)
console.log(string + '=' + parsing.value)
