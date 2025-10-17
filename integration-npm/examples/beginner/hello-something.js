// Plain old ES
const { Streams, C } = require('@masala/parser')
const { assertArrayEquals, assertEquals, assertTrue } = require('../../assert')

// The goal is check that we have Hello 'something', then to grab that something

const helloParser = C.string('Hello')
    .then(C.char(' ').rep())
    .then(C.char("'"))
    .thenRight(C.letter().rep()) // keeping repeated ascii letters
    .thenLeft(C.char("'")) // keeping previous letters

const parsing = helloParser.parse(Streams.ofChars("Hello 'World'"))
// C.letter().rep() will giv a array of letters

assertArrayEquals(
    ['W', 'o', 'r', 'l', 'd'],
    parsing.value.array(),
    'Hello World joined',
)

// Note that helloParser will not reach the end of the stream; it will stop at the space after People
const peopleParsing = helloParser.parse(
    Streams.ofChars("Hello 'People' in 2017"),
)

assertEquals('People', peopleParsing.value.join(''), 'Hello People joined')
assertTrue(
    peopleParsing.offset < 'Hello People in 2017'.length,
    'Bad Offset for Hello People',
)
