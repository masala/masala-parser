import { C } from '../../lib/parsec/index'

export default {
    setUp: function(done) {
        done()
    },

    'expect p.first() to work': function(test) {
        let text = 'abc'
        let parser = C.letter()
            .rep()
            .first()

        test.equal('a', parser.val(text))
        test.done()
    },

    'expect p.last() to work': function(test) {
        let text = 'abc'
        let parser = C.letter()
            .rep()
            .last()

        test.equal('c', parser.val(text))
        test.done()
    },

    'expect p.at() to work': function(test) {
        let text = 'abc'
        let parser = C.letter()
            .rep()
            .map(t => t.at(2))

        test.equal('c', parser.val(text))
        test.done()
    },

    'expect p.array to fail if not a tupleParser': function(test) {
        let text = 'abc'
        let parser = C.letters().array()
        let found = false
        try {
            parser.val(text)
        } catch {
            found = true
        }

        test.ok(found)
        test.done()
    },
}
