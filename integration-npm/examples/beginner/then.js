const {Streams,  C}= require('@masala/parser');
const {assertArrayEquals} = require('../../assert');

// thenLeft, thenRight
const parser = C.string("Hello")
    .then(C.char(' ').rep())
    .then(C.char("'"))
    .thenRight(C.letter.rep())
    .thenLeft(C.char("'"));

var parsing = parser.parse(Streams.ofString("Hello 'World'"));
assertArrayEquals(['W','o','r','l','d'], parsing.value.array(), "Hello World joined");