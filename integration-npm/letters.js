var parsec = require('parser-combinator');
var S = parsec.stream;
var C = parsec.C;

const letters = C.letter.rep().map(letterArray => letterArray.join(''));

var helloParser = C.string("Hello").then(C.char(' ').rep()).thenRight(letters);

var assertWorld = helloParser.parse(S.ofString("Hello World")).value === "World";
console.info('assertWorld', assertWorld);