const { Streams, C } = require('@masala/parser')
const { assertFalse } = require('../../assert')

const floorCombinator = C.string('Hello')
    .then(C.string(' World'))
    .then(C.string('fail'))

const parsing = floorCombinator.parse(Streams.ofChar('Hello World !!!'))
assertFalse(parsing.isAccepted(), 'Testing debug')
