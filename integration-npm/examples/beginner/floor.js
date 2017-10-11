const {Stream, N, C}= require('parser-combinator');
const {assertEquals} = require('../../assert');
const document = '|4.6|';

const floorCombinator = C.char('|').drop()
    .then(N.numberLiteral)    // we have ['|',4.6], we keep 4.6
    .then(C.char('|').drop())   // we have [4.6, '|'], we keep 4.6
    .map(x =>Math.floor(x));

// Parsec needs a stream of characters
const parsing = floorCombinator.parse(Stream.ofString(document));
assertEquals( 4, parsing.value, 'Floor parsing');
