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
 T' -> * FT'  |  eps
 F -> NUMBER | ID | ( T )


 Translated to :
 expr -> terminal subExpr.opt()
 subExpr -> F.try(operator terminal subExpr )
 terminal -> DAY | ( expr )

 */


function day() {
    const x = new X()
    return x.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}


function operation() {
    return F.try(C.string(' AND ').debug('AND operator')).or(C.string(' OR ').debug('OR operator'))
}


function parenthesis(par) {
    return C.char(' ').optrep().drop().then(C.char(par)).then(C.char(' ').optrep().drop());
}

function parenthesisExpr() {
    return parenthesis('(').debug('(').drop().then(expr().debug('inside parenthesis expression')).then(parenthesis(')').drop());
}



function expr() {
    return terminal().debug('expr terminal').then(subExpr().opt())
}

function subExpr() {
    return F.try(operation().then(terminal()).debug('terminal after operation').then(F.lazy(subExpr).opt().debug('optionnel subExpr')));
}


function terminal() {
    return day().debug('day').or(F.lazy(parenthesisExpr).debug('parenthesis expression')).debug('after terminal OR');
}


function combinator() {
    return expr().debug('expr');
}


const string = 'TUESDAY AND (WEDNESDAY OR FRIDAY)';

let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);

console.log(parsing);


