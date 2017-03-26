// Plain old ES
var parsec = require('parser-combinator');
var S = require('parser-combinator').stream;
var C = parsec.C;

// The goal is check that we have Hello 'something', then to grab that something

var helloParser = C.string("Hello")
                    .then(C.char(' ').rep())
                    .then(C.char("'"))
                    .thenRight(C.letter.rep()) // keeping repeated ascii letters
                    .thenLeft(C.char("'"));    // keeping previous letters

var parsing = helloParser.parse(S.ofString("Hello 'World'"));
// C.letter.rep() will giv a array of letters
console.log(parsing.value.toString() == ['W','o','r','l','d'].toString());





// Note that helloParser will not reach the end of the stream; it will stop at the space after People
var peopleParsing = helloParser.parse(S.ofString("Hello 'People' in 2017"));
var peopleAssert = peopleParsing.value.join('') === "People";

console.info('assert: ', peopleAssert);
console.info('assert: ', peopleParsing.offset < "Hello People in 2017".length);