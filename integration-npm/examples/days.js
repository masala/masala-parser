const {stream, F, N, C, X} = require('parser-combinator');


function day() {
     const x = new X()
    return x.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
    //return C.string('MONDAY').or(C.string('TUESDAY')).or(C.string('WEDNESDAY'));
}


/* Idiomatic recursive expression */
function terminal() {
    return day();
}



function operation(){
        return F.try(C.string(' AND ')).or(C.string(' OR '))
}



function parenthesis(par){
    return C.char(' ').optrep().drop().then(C.char(par)).then(C.char(' ').optrep().drop());
}

function parenthesisExpr(){
    return parenthesis('(').drop().then(expr()).then(parenthesis(')').drop());
}


// Implementing basic solution :
//exp   = sexp (op exp)?
//sexp = number | '(' exp ')'

function subexpr(){
    return terminal().or(parenthesisExpr());
}

function operationThenExpression(){
    return operation().then(expr());
}



function expr() {

    return subexpr().then(operationThenExpression().opt());

}



function combinator() {
    return expr();
}


const string = 'TUESDAY OR WEDNESDAY';

let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);

console.log(parsing);


