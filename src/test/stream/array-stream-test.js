import Streams from '../../lib/stream/index'

export default {
    setUp: function (done) {
        done()
    },

    'We can get a response from ': function (test) {
        const document = ['More', 'XYZ']
        const line = Streams.ofArrays(document)

        let response = line.get(0)
        test.equal(response.value, 'More')

        test.done()
    },

    'We have reached out of stream': function (test) {
        const document = ['More', 'XYZ']
        const line = Streams.ofArrays(document)

        let out = line.endOfStream(3)
        test.ok(out)
        out = line.endOfStream(1)
        test.ok(!out)

        test.done()
    },
}
