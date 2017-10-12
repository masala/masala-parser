const {Stream, F, C } = require('parser-combinator');
const {assertArrayEquals, assertEquals} = require('../../assert');


// Only char
let stream = Stream.ofString('abc');
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos.drop()); // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream);

assertArrayEquals(['a', 'b', 'c'], parsing.value);


// Using letter and rep() ;
stream = Stream.ofString('Hello World');
const letterParser = C.letter.rep()  // 'Hello'
    .then(C.char(' '))  // space is not a letter
    .then(C.letter.rep()); // 'World'

parsing = letterParser.parse(stream);
// console.log(parsing.value);
//[ List { value: [ 'H', 'e', 'l', 'l', 'o' ] },' ',List { value: [ 'W', 'o', 'r', 'l', 'd' ] } ]
// Well, complicated value ; Note that rep() returns a masala-List structure


// Using C.letters and C.string
stream = Stream.ofString('Hello World');
const helloParser = C.string('Hello')
    .then(C.char(' '))
    .then(C.letters);

parsing = helloParser.parse(stream);
assertArrayEquals(['Hello',' ','World'], parsing.value);


// Using C.stringIn
stream = Stream.ofString('James');
const combinator = C.stringIn(['The', 'James', 'Bond', 'series']);
parsing = combinator.parse(stream);
assertEquals('James', parsing.value);