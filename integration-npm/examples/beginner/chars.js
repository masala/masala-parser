const {C, Stream} = require('parser-combinator');
const {assertEquals} = require('../../assert');

const letters = C.letter.rep().map(letterArray => letterArray.join(''));
const helloParser = C.string("Hello").then(C.char(' ').rep()).thenRight(letters);

const parsing = helloParser.parse(Stream.ofString("Hello World"));
assertEquals('World', parsing.value);

