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

function subexpr() {
    return terminal()//.or(expr());
}

function expr() {

    return C.char('(').then(subexpr()).then(')').or(subexpr())//.or(expr());

}

function AND() {
    return expr().debug('here').then(C.string(' AND ').debug('and').drop()).then(expr()).map(([day1, day2]) => day1 + day2);
}

function OR() {
    return expr().then(C.string(' OR ').drop()).then(expr()).debug('there').map( ([day1, day2]) => day1);
}

const tryAnd = () => F.try(AND());
const tryOr = () => F.try(OR());

function combinator() {
    return tryAnd().or(tryOr()).or(expr());
}


const string = 'TUESDAY OR WEDNESDAY';

let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);

console.log(parsing);


