import Streams from '../../lib/stream/index'
import { F, C } from '../../lib/parsec'

export default {
    setUp: function(done) {
        done()
    },

    'response ok with a StringStream': function(test) {
        const stream = Streams.ofString('The world is a vampire')

        const parser = C.string('The')
        const response = parser.parse(stream, 0)

        test.ok(response.isAccepted())
        test.ok(!response.isEos())
        test.equal(response.offset, 3)

        test.done()
    },

    'response ok inside a StringStream': function(test) {
        const stream = Streams.ofString('The world is a vampire')

        const parser = C.string('world')
        const response = parser.parse(stream, 4)

        test.ok(response.isAccepted())
        test.ok(!response.isEos())
        test.equal(response.offset, 9)

        test.done()
    },

    'response ok completing a StringStream': function(test) {
        const stream = Streams.ofString('The world is a vampire')

        const parser = C.letter()
            .or(C.char(' '))
            .rep()
        const response = parser.parse(stream)

        test.ok(response.isAccepted())
        test.ok(response.isEos())
        test.equal(response.offset, 22)

        test.done()
    },

    'response fails at StringStream start': function(test) {
        const stream = Streams.ofString('The world is a vampire')

        const parser = C.string('That')
        const response = parser.parse(stream)

        test.ok(!response.isAccepted())
        test.equal(response.offset, 0)

        test.done()
    },

    'response fails inside a StringStream': function(test) {
        const stream = Streams.ofString('abc de')

        const parser = C.string('abc').then(C.string('fails'))
        const response = parser.parse(stream)

        test.ok(!response.isAccepted())
        test.equal(response.offset, 3)

        test.done()
    },

    'response passes the StringStream': function(test) {
        const stream = Streams.ofString('abc de')

        const parser = C.letter()
            .or(C.char(' '))
            .rep()
            .then(C.string('!!!'))
        const response = parser.parse(stream)

        test.ok(!response.isAccepted())

        // because an error has NEVER stream consumed
        test.ok(!response.isEos())
        test.equal(response.offset, stream.source.length)

        test.done()
    },

    'response with a failed try is rejected, and offset is 0': function(test) {
        const stream = Streams.ofString('abc de')

        const parser = F.try(C.string('abc').then(C.char('x'))).or(
            C.string('x'),
        )
        const response = parser.parse(stream)

        test.ok(!response.isAccepted())
        test.equal(response.offset, 0)

        test.done()
    },
}
