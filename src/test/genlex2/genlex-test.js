import {F, C, N} from "../../lib/parsec";
import {GenLex} from '../../lib/genlex2/genlex';
import stream from "../../lib/stream";


export default {
    setUp: function (done) {
        done();
    },

    'expect Genlex to be constructed with spaces ': function (test) {

        const genlex = new GenLex();
        test.ok(genlex.spaces !== undefined);
        test.ok(genlex.definitions.length === 0);
        test.done();

    },

    'expect tokenize() to add on definition': function (test) {
        const genlex = new GenLex();
        genlex.tokenize(N.numberLiteral(), 'number', 500);
        test.ok(genlex.definitions.length === 1);
        test.done();
    },
    'expect use() to sort definitions by revert precedence': function (test) {
        const genlex = new GenLex();
        const tkNumber = genlex.tokenize(N.numberLiteral(), 'number');
        const tkDate = genlex.tokenize(date(), 'date', 800);
        const tkChar = genlex.tokenize(C.charLiteral(), 'char', 1200);
        let grammar = tkDate.then(tkNumber.rep().or(tkChar));

        test.notEqual(genlex.definitions[0].name, 'date');
        genlex.use(grammar);
        test.equal(genlex.definitions[2].name, 'date');
        test.equal(genlex.definitions[0].name, 'char');
        test.done();
    },

    'expect use() to create an easy tokenizer': function (test) {

        const genlex = new GenLex();
        const tkNumber = genlex.tokenize(N.numberLiteral(), 'number');
        const tkDate = genlex.tokenize(date(), 'date', 800);
        let grammar = tkNumber.rep();

        const parser = genlex.use(grammar);
        const parsing = parser.parse(stream.ofString('34 23'));

        test.ok(parsing.isAccepted());
        test.done()


    },
    'expect use() to create an easy tokenizer with precedence': function (test) {

        const genlex = new GenLex();
        const tkNumber = genlex.tokenize(N.numberLiteral(), 'number');
        const tkDate = genlex.tokenize(date(), 'date', 800);
        let grammar = tkDate.then(tkNumber.rep());

        const parser = genlex.use(grammar);
        const parsing = parser.parse(stream.ofString('10/05/2014 34 23'));

        test.ok(parsing.isAccepted());
        test.done()
    },
    'GenLex can tokenize keywords':function(test){
        const genlex = new GenLex();
        const plus = genlex.keyword('+');

        let grammar = plus.rep().then(F.eos().drop());
        const parser = genlex.use(grammar);
        const text = '+++++';
        const parsing = parser.parse(stream.ofString(text));
        test.ok(parsing.isAccepted());
        test.done()
    },
    'tokenize(string) is a shortcut for keywords':function(test){
        const genlex = new GenLex();
        const plus = genlex.tokenize('+');

        let grammar = plus.rep().then(F.eos().drop());
        const parser = genlex.use(grammar);
        const text = '+++++';
        const parsing = parser.parse(stream.ofString(text));
        test.ok(parsing.isAccepted());
        test.done()
    }
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