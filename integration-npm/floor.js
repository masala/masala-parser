const {stream, N,C}= require('parser-combinator');
const document = '|4.6|';

const floorCombinator = C.char('|')
    .thenRight(N.numberLiteral)    // we have ['|',4.6], we keep 4.6
    .thenLeft(C.char('|'))   // we have [4.6, '|'], we keep 4.6
    .map(x =>Math.floor(x));

// Parsec needs a stream of characters
const parsing = floorCombinator.parse(stream.ofString(document));

console.log(parsing.value===4);