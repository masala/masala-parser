const parsec = require('parser-combinator');
const F = parsec.F;
const N=parsec.N;


// Parsec needs a stream of characters
const document = '12';
const stream = parsec.stream.ofString(document);

// numberLitteral defines any int or float number
// We expect a number, then eos: End Of Stream
// We use thenLeft because we don't need the value of P.eos, we only want 12
const numberParser = N.numberLiteral.thenLeft(F.eos);
const parsing = numberParser.parse(stream);

// If the parser reached the end of stream (P.eos) without rejection, parsing is accepted
console.info(parsing.isAccepted());
// The parser has a 12 value inside the monoid
if (parsing.value !== 12){
    throw "Illegal value parsed in postpublish integration test";
}else{
    console.log('=== Post publish Integration SUCCESS ! :) ===');
}