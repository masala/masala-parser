var parsec = require('parser-combinator');
var S = require('parser-combinator').stream;
var P = parsec.parser;

const letters = P.letter.rep().map(letterArray => letterArray.join(''));

var helloParser = P.string("Hello").then(P.char(' ').rep()).thenRight(letters);

var assertWorld = helloParser.parse(S.ofString("Hello World")).value === "World";
console.info('assertWorld', assertWorld);