const { Streams, N, C } = require('@masala/parser')
const { assertEquals } = require('../../assert')

const stream = Streams.ofChars('|4.6|')
const floorCombinator = C.char('|')
    .drop()
    .then(N.number()) // we have ['|',4.6], we keep 4.6
    .then(C.char('|').drop()) // we have [4.6, '|'], we keep 4.6
    .single()
    .map((x) => Math.floor(x))

// Parsec needs a stream of characters
const parsing = floorCombinator.parse(stream)
assertEquals(4, parsing.value, 'Floor parsing')
