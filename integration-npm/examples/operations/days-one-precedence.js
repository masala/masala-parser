const {Streams, F, N, C} = require('@masala/parser');
const {assertTrue} = require('../../assert');
/*
 Implementing stack solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> DAY | ( E )

 Using only one operator, simplified to:

 T -> F T'
 T' -> operator FT'  |  eps
 F -> DAY | ( T )


 Translated as pseudo-masala:

 expr -> terminal subExpr
 subExpr -> (operator terminal F.lazy(subExpr) ).opt()
 terminal -> DAY | ( F.lazy(expr) )
 */



function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function blank(){
    return C.char(' ').rep().returns(' ');
}

function operation() {
    return blank().then(C.string('AND').or(C.string('OR'))).then(blank());
}

function parenthesis(par) {
    return C.char(' ').optrep().drop().then(C.char(par));
}

function parenthesisExpr() {
    return parenthesis('(').drop()
        .then(expr())
        .then(parenthesis(')').drop());
}


function expr() {
    return terminal().then(optionalSubExpr())
}

function subExpr() {
    return   operation().then(terminal()).then(F.lazy(optionalSubExpr));
}

function optionalSubExpr(){
    return subExpr().opt();
}

function terminal() {
    return day().or(F.lazy(parenthesisExpr));
}


function combinator() {
    return expr().then(F.eos());
}


const string = '(TUESDAY OR THURSDAY OR TUESDAY)    OR (WEDNESDAY OR (FRIDAY))';

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertTrue(parsing.isAccepted());


