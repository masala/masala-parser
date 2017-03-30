import X from '../../../lib/standard/extractor/extractor-bundle';
import {F, C} from '../../../lib/parsec/index';
import stream from '../../../lib/stream/index';


export default {
    setUp: function (done) {
        done();
    },

    'test spaces': function (test) {

        const line = stream.ofString('    this starts with 4 spaces');

        const x = new X();
        const combinator = x.spaces().thenLeft(F.any.rep());
        const value = combinator.parse(line).value;
        test.equals(value.length, 4);
        test.done();
    },
    'test spaces and line feed': function (test) {

        const line = stream.ofString('    this \n contains line feed');

        const x = new X();
        const combinator = x.spaces()
            .then(x.word())
            .thenRight(x.spaces())
            .thenLeft(F.any);
        const value = combinator.parse(line).value;
        test.equals(value.length, 3);
        test.done();
    },
    'test spaces, tabs and line feed': function (test) {

        const line = stream.ofString('    this \n \t contains line feed');

        const x = new X();
        const combinator = x.spaces()
            .then(x.word())
            .thenRight(x.spaces())
            .thenLeft(F.any);
        const value = combinator.parse(line).value;
        test.equals(value.length, 5);
        test.done();
    },
    'test numbers': function (test) {

        const line = stream.ofString('98');

        const x = new X();
        const combinator = x.number();
        const value = combinator.parse(line).value;
        test.ok(value === 98);
        test.done();
    },
    'test digits': function (test) {

        const line = stream.ofString('98');

        const x = new X();
        const combinator = x.digits();
        const value = combinator.parse(line).value;
        test.ok(value === '98');
        test.done();
    },
    'test single word': function (test) {

        let line = stream.ofString('Parsec-');

        const x = new X();
        const combinator = x.word().thenLeft(C.char('-'));
        const value = combinator.parse(line).value;
        test.ok(value === 'Parsec');
        test.done();
    },

    'test single word hexadecimal': function (test) {

        let line = stream.ofString('10FF-hexadecimal');
        const hexadecimal = C.charIn('0123456789ABCDEF');

        const x = new X({letter: hexadecimal});
        const combinator = x.word().map(x => parseInt(x, 16))
            .thenLeft(C.char('-'))
            .thenLeft(C.string('hexadecimal'));
        const value = combinator.parse(line).value;
        test.equals(value, 4351);
        test.done();
    },
    'single word with bad letters should fail': function (test) {

        let line = stream.ofString('classicWord-notHexadecimal');
        const hexadecimal = C.charIn('0123456789ABCDEF');

        const x = new X({letter: hexadecimal});
        const combinator = x.word().map(x => parseInt(x, 16))
            .thenLeft(C.char('-'))
            .thenLeft(C.string('notHexadecimal'));
        const accepted = combinator.parse(line).isAccepted();
        test.ok(!accepted);
        test.done();
    },

    'test words': function (test) {
        let line = stream.ofString('The James Bond series, by writer Ian Fleming');

        const x = new X();
        const combinator = x.words();
        const value = combinator.parse(line).value;
        test.ok(value[1] === ' ');
        test.ok(_includes(value,'Bond'));
        test.done();
    },

    'test stringIn': function (test) {
        let line = stream.ofString('James Bond');

        const x = new X();
        const combinator = x.stringIn(['The', 'James', 'Bond', 'series']);
        const value = combinator.parse(line).value;
        test.ok(typeof value === 'string');
        test.ok(value === 'James');
        test.done();
    },

    'test stringIn one string sidecase': function (test) {
        let line = stream.ofString('James');

        const x = new X();
        const combinator = x.stringIn(['James']);
        const value = combinator.parse(line).value;
        test.ok(typeof value === 'string');
        test.ok(value === 'James');
        test.done();
    },

    'test stringIn empty sidecase': function (test) {
        let line = stream.ofString('James');

        const x = new X();
        const combinator = x.stringIn([]).then(F.eos);
        const parsing = combinator.parse(line);
        test.ok(!parsing.isAccepted());
        test.done();
    },

    'test wordsIn': function (test) {
        let line = stream.ofString('James Bond by Ian Fleming');

        const x = new X();
        const combinator = x.wordsIn(['James', 'Bond', 'by', 'Ian', 'Fleming'], true);
        const value = combinator.parse(line).value;
        test.ok(value.length === 9);
        test.ok(_includes(value,'James'));
        test.ok(_includes(value,'Bond'));
        test.ok(_includes(value,'Fleming'));
        test.done();
    },

    'test wordsIn without keeping spaces': function (test) {
        let line = stream.ofString('James Bond by Ian Fleming');

        const x = new X();
        const combinator = x.wordsIn(['James', 'Bond', 'by', 'Ian', 'Fleming'], false);
        const value = combinator.parse(line).value;
        test.ok(value.length === 5);
        test.ok(_includes(value,'James'));
        test.ok(_includes(value,'Bond'));
        test.ok(_includes(value,'Fleming'));
        test.done();
    },

    'test wordsIn keeping spaces with alt spaces': function (test) {
        let line = stream.ofString('James%Bond%by Ian=Fleming');

        const x = new X({moreSeparators: '%='});
        const combinator = x.wordsIn(['James', 'Bond', 'by', 'Ian', 'Fleming'], false);
        const value = combinator.parse(line).value;
        test.ok(value.length === 5);
        test.ok(_includes(value,'James'));
        test.ok(_includes(value,'Bond'));
        test.ok(_includes(value,'Fleming'));
        test.done();
    },

    'test wordsIn with custom spaces': function (test) {
        const str = 'JamesSPACEBondSPACEbySPACEIanSPACEFlemingSPACESPACE';
        let line = stream.ofString(str);

        const x = new X({wordSeparators: C.string('SPACE')});
        const combinator = x.wordsIn(['James', 'Bond', 'by', 'Ian', 'Fleming'], false);
        const value = combinator.parse(line).value;
        test.ok(value.length === 5);
        test.ok(_includes(value,'James'));
        test.ok(_includes(value,'Bond'));
        test.ok(_includes(value,'Fleming'));
        test.done();
    },
    'test wordsIn with both custom spaces and more Sep': function (test) {
        const str = 'James=BondSPACEbySPACEIanSPACEFlemingSPACESPACE';
        let line = stream.ofString(str);

        let found = false;
        const original = console.warn;
        console.warn = ()=> {
            found = true
        };
        const x = new X({
            wordSeparators: C.string('SPACE'),
            moreSeparators: '%='
        });


        const combinator = x.wordsIn(['James=Bond', 'by', 'Ian', 'Fleming'], false);


        const value = combinator.parse(line).value;

        test.ok(found);
        test.ok(value.length === 4);
        test.ok(_includes(value,'James=Bond'));
        test.ok(_includes(value,'Fleming'));
        console.warn = original;
        test.done();
    },
    'test wordsUntil': function (test) {

        const line = stream.ofString('I write until James appears');

        const x = new X();
        const combinator = x.wordsUntil(C.string('James')).thenLeft(F.any);
        const value = combinator.parse(line).value;

        test.equals(value, 'I write until ');
        test.done();
    },
    'test first': function (test) {

        const line = stream.ofString("Hello 'World'");
        const x = new X({wordSeparators: C.charIn(" '")});

        const helloParser = x.words().map(x.first);

        const value = helloParser.parse(line).value;

        test.equals(value, 'Hello');
        test.done();
    },
    'test last': function (test) {

        const line = stream.ofString("Hello 'World'");
        const x = new X({moreSeparators: "'"});

        const helloParser = x.words(false).map(x.last);

        const value = helloParser.parse(line).value;

        test.equals(value, 'World');
        test.done();
    }

}


function _includes(array, value){
    for (let i=0 ; i < array.length;i++){
        if (array[i] === value){
            return true;
        }
    }
    return false;
}
