const { Streams, F, N, C, X } = require('@masala/parser')
const { assertFalse } = require('../../assert')

function A() {
    return C.char('A').flatMap(B)
}

function B(aVal) {
    return C.char('B')
        .map((bVal) => aVal + '-' + bVal)
        .or(F.lazy(A))
}

const parser = A()

const str = 'AAAB'
const stream = Streams.ofChar(str)
const parsing = parser.parse(stream)

//F.startsWith()
//F.dropTo()
//F.moveUntil()
// rename F.nop() to F.nop
// parsing.isCompleted()
