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
    return F.try(C.string(' AND ')).or(C.string(' OR '))
}


function parenthesis(par) {
    return C.char(' ').optrep().drop().then(C.char(par)).then(C.char(' ').optrep().drop());
}

function parenthesisExpr() {
    return parenthesis('(').drop().then(expr()).then(parenthesis(')').drop());
}



function expr() {
    return terminal().then(subExpr().opt())
}

function subExpr() {
    return F.try(operation().then(terminal()).then(F.lazy(subExpr).opt()));
}


function terminal() {
    return day().or(F.lazy(parenthesisExpr));
}


function combinator() {
    return expr();
}


const string = '(TUESDAY OR THURSDAY) AND (WEDNESDAY OR (FRIDAY))';
let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);

console.log(parsing);


