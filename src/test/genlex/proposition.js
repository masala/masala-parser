import {GenLex} from "../../lib/genlex/genlex";
import {C, N} from "../../lib/parsec";
import stream from "../../lib/stream";


export default {
    setUp: function (done) {
        done();
    },

    'expect Genlex to be easy to use ': function (test) {


        const genlex = new GenLex();


        const tkDate =  genlex.tokenize(date(), 'date', 500);
        const tkNumber = genlex.tokenize(N.number(), 'number', 700);
        let grammar = tkDate.then(tkNumber.rep());
        const parser = genlex.use(grammar);
        const parsing = parser.parse(stream.ofString('10/12/2013 34 23'));

        test.ok(parsing.isAccepted());
        test.done()
    },

}



function date() {
    return N.digits()
        .then(C.charIn('-/').returns('-'))
        .then(N.digits())
        .then(C.charIn('-/').returns('-'))
        .then(N.digits())
        .array()
        .map(dateValues => dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray => dateArray.join(''));
}