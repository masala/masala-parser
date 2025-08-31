import stream from '../../lib/stream/index'
import C from '../../lib/parsec/chars-bundle'
import N from '../../lib/parsec/numbers-bundle'
import Streams from '../../lib/stream'
import unit from '../../lib/data/unit'

export default {
    setUp: function(done) {
        done()
    },

    'endOfStream for empty stream': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
        test.ok(
            stream.ofParser(p, stream.ofString('')).endOfStream(0),
            'should be endOfStream.',
        )
        test.done()
    },

    'endOfStream for non empty stream': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
        test.ok(
            stream.ofParser(p, stream.ofString('1')).endOfStream(1),
            'should be endOfStream.',
        )
        test.done()
    },

    'no endOfStream for non empty stream': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
        test.equal(
            stream.ofParser(p, stream.ofString('1')).endOfStream(0),
            false,
            'should be endOfStream.',
        )
        test.done()
    },

    'get from stream': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
        test.equal(
            stream
                .ofParser(p, stream.ofString('1'))
                .get(0)
                .isSuccess(),
            true,
            'should be a success.',
        )
        test.done()
    },

    'do not get from empty stream': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
        test.equal(
            stream
                .ofParser(p, stream.ofString('1'))
                .get(1)
                .isSuccess(),
            false,
            'should be a failure.',
        )
        test.done()
    },

    'get from stream number 123': function(test) {
        var p = C.char(' ')
            .optrep()
            .thenRight(N.number())
            .single()
        test.equal(
            stream
                .ofParser(p, stream.ofString('123'))
                .get(0)
                .success(),
            123,
            'should be a 123.',
        )
        test.done()
    },

    'Offset are found in series of numbers': function(test) {
        const p = N.number()
            .then(
                C.char(' ')
                    .optrep()
                    .drop(),
            )
            .single()

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'))
        // index: ^0    ^6

        const first = parserStream.get(0).success() //>> 123
        test.equal(first, 123)

        const second = parserStream.get(1).success() //>> 114
        test.equal(second, 14137)
        test.deepEqual(parserStream.offsets, [0, 6, 11])

        // Offset after reading start (1) is related to index after 123 (3)
        // Offset after reading at 6 (7) is related to index after '123   14137'(11)

        test.done()
    },

    'failing series of numbers': function(test) {
        const p = N.number()
            .then(
                C.char(' ')
                    .optrep()
                    .drop(),
            )
            .single()
        const parserStream = stream.ofParser(p, stream.ofString('123   a'))
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success() //>> 123
        test.equal(first, 123)
        test.deepEqual(parserStream.offsets, [0, 6])

        const second = parserStream.get(1) // try 'a'
        test.ok(second.isFailure())

        test.deepEqual(parserStream.offsets, [0, 6])

        test.done()
    },

    'having correct location when success': function(test) {
        const p = N.number()
            .then(
                C.char(' ')
                    .optrep()
                    .drop(),
            )
            .single()

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'))
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success() //>> 123
        test.equal(first, 123)
        test.equal(0, parserStream.location(0))

        const second = parserStream.get(1).success() //>> 114
        test.equal(second, 14137)
        test.equal(6, parserStream.location(1))

        test.done()
    },

    'searching illegal location will fail': function(test) {
        const p = N.number()
            .then(
                C.char(' ')
                    .optrep()
                    .drop(),
            )
            .single()

        const parserStream = stream.ofParser(p, stream.ofString('123   14137'))
        //                                                index: ^0    ^6

        const first = parserStream.get(0).success() //>> 123
        test.equal(first, 123)
        let foundError = false

        try {
            test.equal(0, parserStream.location(4))
        } catch {
            foundError = true
        }

        test.ok(foundError)

        test.done()
    },

    'having correct location when fail': function(test) {
        const p = N.number()

        const parserStream = stream.ofParser(p, stream.ofString('1234   14137'))
        //                                                index: ^0  ^4

        const first = parserStream.get(0).success() //>> 123
        test.equal(first, 1234)
        test.equal(0, parserStream.location(0))

        parserStream.get(1) //>> fail
        test.equal(4, parserStream.location(1))

        test.done()
    },

    'unsafe_get can see next element': function(test) {
        const lower = N.number()
            .then(
                spaces()
                    .opt()
                    .drop(),
            )
            .single()

        const lowerStream = Streams.ofString('10 12 44')
        const parserStream = Streams.ofParser(lower, lowerStream)

        parserStream.unsafeGet(0)

        let value = parserStream.unsafeGet(1)

        test.equal(12, value)

        test.done()
    },

    'unsafe_get cannot see beyond next element': function(test) {
        const lower = N.number().then(
            spaces()
                .opt()
                .drop(),
        )

        const lowerStream = Streams.ofString('10 12 44')
        const parserStream = Streams.ofParser(lower, lowerStream)

        let found = false

        try {
            parserStream.unsafeGet(1)
        } catch {
            found = true
        }
        test.ok(found)

        test.done()
    },
}

function spaces() {
    return C.charIn(' \r\n\f\t')
        .optrep()
        .map(() => unit)
}
