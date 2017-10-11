const {Stream,  C}= require('parser-combinator');
const {assertArrayEquals} = require('../../assert');

// thenLeft, thenRight
const parser = C.string("Hello")
    .then(C.char(' ').rep())
    .then(C.char("'"))
    .thenRight(C.letter.rep())
    .thenLeft(C.char("'"));

var parsing = parser.parse(Stream.ofString("Hello 'World'"));
assertArrayEquals(['W','o','r','l','d'], parsing.value.array(), "Hello World joined");