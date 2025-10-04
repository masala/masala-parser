const { F, N, Streams } = require('@masala/parser')
const { assertEquals, assertTrue } = require('../../assert')

// Parsec needs a stream of characters
const document = '12'
const s = Streams.ofChar(document)

// numberLitteral defines any int or float number
// We expect a number, then eos: End Of Stream
// We use drop() because we don't need the value of F.eos(), we only want 12
const numberParser = N.number().then(F.eos().drop()).single()
const parsing = numberParser.parse(s)

// If the parser reached the end of stream (F.eos()) without rejection, parsing is accepted
assertTrue(parsing.isAccepted())
// The parser has a 12 value inside the monoid
assertEquals(12, parsing.value)
