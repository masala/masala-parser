const parsec = require('parser-combinator');
const P = parsec.parser;
const T= parsec.standard.token;




const document = '12';
const stream = parsec.stream.ofString(document);

const parsing = P.numberLiteral.thenLeft(P.eos).parse(stream);
console.log(parsing.value===12);