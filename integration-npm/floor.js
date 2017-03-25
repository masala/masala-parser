const parsec = require('parser-combinator');
const N = parsec.N;
const C = parsec.C;

// Parsec needs a stream of characters
const document = '|4.6|';
const stream = parsec.stream.ofString(document);

const floorCombinator = C.char('|')
    .thenRight(N.numberLiteral)    // we have ['|',4.6], we keep 4.6
    .thenLeft(C.char('|'))   // we have [4.6, '|'], we keep 4.6
    .map(x =>Math.floor(x));

const parsing = floorCombinator.parse(stream);
// If the parser reached the end of stream (F.eos) without rejection, parsing is accepted
console.info(parsing.isAccepted());
// The parser has a
console.log(parsing.value===4);