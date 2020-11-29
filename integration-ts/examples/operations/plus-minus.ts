import {Streams, F, C, SingleParser, Option} from '@masala/parser'
import {assertEquals} from "../../assert";


/*
 Implementing general solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> U | ( E )

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


const MULT = 'MULT';
const PLUS = 'PLUS';



function text() {
    return (F.not(anyOperation().or(C.charIn('()'))))
        .rep()
        .map(v => parseInt(v.join('').trim()));
}


function blank() {
    return C.char(' ').rep().returns(' ');
}


function anyOperation() {
    return C.string('*').returns(MULT)
        .or(C.string('+').returns(PLUS));
}


function andOperation() {
    return C.string('*').returns(MULT)
}

function plusOperation() {
    return C.string('+').returns(PLUS)
}


function parenthesis(par:string) {
    return C.char(' ').optrep().drop().then(C.char(par));
}

function parenthesisExpr():SingleParser<number> {
    return parenthesis('(').then(blank().opt()).drop()
        .then(F.lazy(expr))
        .then(parenthesis(')').then(blank().opt()).drop())
        .single();
}

function expr():SingleParser<number> {
    return subExpr().then(optionalPlusExpr())
        .array()
        .map(([left,right]) =>  left + right.orElse(0));
}


function optionalPlusExpr():SingleParser<Option<number>> {
    return plusExpr().opt();
}

function plusExpr() {
    return plusOperation().drop().then(subExpr())
        .then(F.lazy(optionalPlusExpr))
        .array()
        .map(([left,right])=>left+right.orElse(0));
}

function subExpr() {
    return terminal().then(optionalMultExpr())
        .array()
        .map(([left,right]) => left * right.orElse(1));
}

function optionalMultExpr():SingleParser<Option<number>> {
    return multExpr().opt();
}

function multExpr() {
    return andOperation().drop().then(terminal())
        .then(F.lazy(optionalMultExpr))
        .array()
        .map(([left,right]) => left * right.orElse(1));
}



function terminal() {
    return F.try(parenthesisExpr()).or(text());
}

function combinator() {
    return expr().eos()
}

const string = '2 + 3 * (  (   4  +   10) + ( 4) ) + 1 * -3';

let stream = Streams.ofString(string);
let response = combinator().parse(stream);

assertEquals(53,response.value );

