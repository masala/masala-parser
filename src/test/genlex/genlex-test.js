import {F, C, N} from "../../lib/parsec";
import {GenLex, getMathGenLex} from '../../lib/genlex/genlex';
import stream from "../../lib/stream";


export default {
    setUp: function (done) {
        done();
    },

    'genlex find offsets when success': function (test) {
        const genlex = new GenLex();

        const plus = genlex.tokenize('+');
        const minus = genlex.tokenize('-');

        let grammar = plus.or(minus).rep().thenEos();

        const parser = genlex.use(grammar);

        const text = '+ + - --';
        const parsing = parser.parse(stream.ofString(text));
        test.ok(parsing.isConsumed(), 'input is consumed');
        test.equal(5, parsing.offset, 'there are 5 keywords');
        test.equal(8, parsing.input.location(parsing.offset), 'there are 8 chars')
        test.done()
    },

    'genlex find offsets when fail': function (test) {
        const genlex = new GenLex();

        const plus = genlex.tokenize('+');
        const minus = genlex.tokenize('-');

        let grammar = plus.or(minus).rep().thenEos();

        const parser = genlex.use(grammar);

        const text = '+  +  +* --';
        //            0  1  23
        const parsing = parser.parse(stream.ofString(text));

        test.ok(! parsing.isConsumed(), 'an error should have occurred');
        test.equal(3, parsing.getOffset(), 'Failed at the third token');
        test.equal(7, parsing.location(), 'fail is not 3: it must be the char offset before the error');

        test.done();
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
        let grammar = tkNumber.rep();

        const parser = genlex.use(grammar);
        const parsing = parser.parse(stream.ofString('34 23'));

        test.ok(parsing.isAccepted());
        test.done()


    },
    'a Genlex can update its precedence': function (test) {

        const genlex = new GenLex();
        const tkNumber = genlex.tokenize(N.numberLiteral(), 'number');
        const tkDate = genlex.tokenize(date(), 'date', 800);

        let content = '10/05/2014 34 23';
        genlex.setSeparators(' /');
        genlex.updatePrecedence('number', 10);

        let grammar = tkDate.or(tkNumber).rep();


        const parser = genlex.use(grammar);
        const parsing = parser.parse(stream.ofString(content));

        test.deepEqual(parsing.value.array(), [10,5,2014,34,23]);
        test.done()
    },

    'GenLex can tokenize keywords': function (test) {
        const genlex = new GenLex();
        const plus = genlex.tokenize('+');

        let grammar = plus.rep().then(F.eos().drop());
        const parser = genlex.use(grammar);
        const text = '+++++';
        const parsing = parser.parse(stream.ofString(text));
        test.ok(parsing.isAccepted(), 'GenLex can tokenize keywords');
        test.done()
    },

    'tokenize mixes with keywords': function (test) {
        const genlex = new GenLex();
        const number = genlex.tokenize(N.numberLiteral(), 'number');
        const plus = genlex.tokenize('+');

        let grammar = plus.or(number).rep().then(F.eos().drop());
        const parser = genlex.use(grammar);
        const text = '++77++4+';
        const parsing = parser.parse(stream.ofString(text));
        test.ok(parsing.isConsumed(), 'tokenize mixes with keywords');
        test.done()
    },
    'getMathGenLex() gives a simple genlex': function (test) {
        const genlex = getMathGenLex();
        const number = genlex.get('number');


        let grammar = number.rep();

        const text = '15 14';
        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));


        test.deepEqual(parsing.value.array(), ['15', '14'], 'getMathGenLex() gives a simple genlex');
        test.done()

    }, 'getMathGenLex can be enhanced with a parser': function (test) {
        const genlex = getMathGenLex();
        genlex.remove('-');
        const number = genlex.get('number');
        //const digits = genlex.get('digits');
        const tkDate = genlex.tokenize(date(), 'date', 800);


        let grammar = tkDate.rep()
            .then(number)
            .then(F.eos());

        const text = '15-12-2018      12-02-2020   12 ';
        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));

        test.ok(parsing.isAccepted());
        test.done()

    }, 'getMathGenLex can be enhanced with a string': function (test) {
        const genlex = getMathGenLex();
        const number = genlex.get('number');
        const dol = genlex.tokenize('$', 'dol');

        let grammar = number.then(dol).rep().then(F.eos());

        const text = '15 $ ';
        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));

        test.ok(parsing.isConsumed());
        test.done()

    }, 'getMathGenLex can be enhanced with a string and no name': function (test) {
        const genlex = getMathGenLex();
        const number = genlex.get('number');
        genlex.tokenize('$');
        const dol = genlex.get('$');

        let grammar = number.then(dol).rep().then(F.eos());

        const text = '15 $ ';
        const parsing = genlex.use(grammar).parse(stream.ofString(text));

        test.ok(parsing.isConsumed());
        test.done()

    },

    'genlex can change separators with a given string': function (test) {
        const genlex = getMathGenLex();
        const number = genlex.get('number');

        let grammar = number.rep().then(F.eos().drop());

        genlex.setSeparators('-');
        const text = '15-12-35--';

        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));

        test.ok(parsing.isAccepted());
        test.deepEqual(parsing.value.array(), [15, 12, 35]);
        test.done()

    },

    'genlex can change separators with a full Parser': function (test) {
        const genlex = getMathGenLex();
        const number = genlex.get('number');

        let grammar = number.rep().then(F.eos().drop());

        const separatorParser = C.char('-')
            .then(C.char('/').opt())
            .optrep();

        genlex.setSeparatorsParser(separatorParser);
        const text = '15-12-/35--10';

        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));

        test.ok(parsing.isAccepted());
        test.deepEqual(parsing.value.array(), [15, 12, 35,10]);
        test.done()

    },

    'genlex provide all named tokens': function (test) {
        const genlex = getMathGenLex();

        const {number, plus, mult, open, close} = genlex.tokens();
        //const number = genlex.get('number');

        let grammar = number.or(plus).or(open).or(close).or(mult).rep().then(F.eos().drop());


        const text = '12+ 35';

        const parser = genlex.use(grammar);

        const parsing = parser.parse(stream.ofString(text));

        test.ok(parsing.isAccepted());
        test.deepEqual(parsing.value.array(), [12, '+', 35]);
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








