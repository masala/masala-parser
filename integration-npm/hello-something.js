// Plain old ES
var parsec = require('parser-combinator');
var S = require('parser-combinator').stream;
var P = parsec.parser;

// The goal is check that we have Hello 'something', then to grab that something
// With P.string("Hello").then(P.char(' ').rep()), we expect 'Hello' then some spaces
// With P.letter.rep(), we expect an array of letters, that we'll join to form a string
// We use thenRight, because we keep only the right value : the one we say hello 
var helloParser = P.string("Hello").then(P.char(' ').rep()).thenRight(P.letter.rep());

var assertWorld = helloParser.parse(S.ofString("Hello World")).value.toString() == ['W','o','r','l','d'].toString();
console.info('assertWorld', assertWorld);

// Note that helloParser will not reach the end of the stream; it will stop at the space after People
var peopleParsing = helloParser.parse(S.ofString("Hello People in 2017"));
var peopleAssert = peopleParsing.value.join('') === "People";

console.info('assert: ', peopleAssert);
console.info('assert: ', peopleParsing.offset < "Hello People in 2017".length);