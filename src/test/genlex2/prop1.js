import {GenLex} from "../../lib/genlex2/genlex";
import {F,C, N} from "../../lib/parsec";
import unit from "../../lib/data/unit";
import stream from "../../lib/stream";

const genlex = new GenLex();


const tkDate =  genlex.tokenize(date(), 'date', 500);
const tkNumber = genlex.tokenize(N.numberLiteral(), 'number', 700);

let grammar = tkDate.then(tkNumber.rep());


const parser = genlex.use(grammar);

const parsing = parser.parse(stream.ofString('10/12/2013 34 23'));
console.log(parsing);





function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}

function date() {
    return N.digits()
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits())
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits())
        .map(dateValues => dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray => dateArray.join(''));
}