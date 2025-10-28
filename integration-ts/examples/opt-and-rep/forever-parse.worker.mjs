import { parentPort } from 'node:worker_threads'
import { C, N, Streams } from '@masala/parser'

const blocks = N.number().then(C.char('/')).optrep().optrep() // the forever parse

try {
    const stream = Streams.ofChars('1/2/3/4/5/')
    blocks.parse(stream)
    parentPort.postMessage('finished') // should never happen
} catch (e) {
    parentPort.postMessage({ error: e?.message ?? String(e) })
}
