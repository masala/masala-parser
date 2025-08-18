// Exemple: tracer rightText = F.moveUntil(C.char('\n').drop(), true)
import { createTracer } from '../../lib/debug/trace.js'
import { C, F, Streams } from '../../lib/index.js'

const input = `author: Nicolas
purpose: Demo of Masala Parser
year: 2023
---
# Masala Parser rocks!`
const eol = C.char('\n').drop()

const leftText = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
const separator = C.char(':')

const rightText = F.moveUntil(eol, true).map((s) =>
    s.split(',').flatMap((x) => x.trim()),
)
const lineParser = leftText
    .then(separator.drop())
    .then(rightText)
    //.array()
    .map((tuple) => {
        const name = tuple.first()
        const values = tuple.last()
        return {
            name,
            value: values,
        }
    })
const endParser = C.string('---').drop().then(eol)

const fullParser = lineParser.rep().then(endParser)

// Optional:
const start = 0
const end = input.indexOf('---', start)

const tracer = createTracer({ window: [start, end], includeValues: false })
const tracedRightText = tracer.trace(rightText, 'rightText', {
    showValue: true,
})(fullParser)

const stream = Streams.ofString(input)
tracedRightText.parse(stream)

// JSON final
const json = tracer.flush()
console.log(JSON.stringify(json, null, 2))
