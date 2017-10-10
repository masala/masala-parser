const {stream, F, N, C, X} = require('parser-combinator');

/*
 Implementing stack solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> NUMBER | ID | ( E )

 Using only one operator, simplified to:

 T -> F T'
 T' -> operator FT'  |  eps
 F -> NUMBER | ID | ( T )


 Translated to :
 expr -> terminal subExpr.opt()
 subExpr -> F.try(operator terminal subExpr )
 terminal -> DAY | ( expr )
 */



function day() {
    return new X().stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function blank(){
    return C.char(' ').rep().thenReturns(' ');
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
    return expr().then(F.eos);
}


const string = '(TUESDAY OR THURSDAY OR TUESDAY)    OR (WEDNESDAY OR (FRIDAY))';

let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);
console.log('length', string.length);
console.log(parsing);


