import { describe, it, expect } from 'vitest'
import { Worker } from 'node:worker_threads'

/**
 * Nested .optrep() is known to loop forever.  We detect that by
 * running the parse in a worker-thread and terminating it after
 * 300 ms.  The test EXPECTS that termination (i.e. the promise
 * rejects with “timeout”); if the parser ever returns normally
 * the assertion will fail – which is exactly what we want once
 * the bug is fixed.
 */
describe('should parse optrep().optrep() forever, but we stop it', () => {
    it('should throw after 0.3 s when nested optrep() hangs', async () => {
        const worker = new Worker(
            new URL('./forever-parse.worker.mjs', import.meta.url),
            // { type: 'module' }
        )

        const parsePromise = new Promise((_, reject) => {
            const timer = setTimeout(() => {
                worker.terminate().then(() => reject(new Error('timeout')))
            }, 200)

            worker.once('message', (msg) => {
                clearTimeout(timer)
                reject(
                    new Error(
                        typeof msg === 'string'
                            ? `unexpected worker completion: ${msg}`
                            : `worker error: ${msg.error}`,
                    ),
                )
            })

            worker.once('error', (err) => {
                clearTimeout(timer)
                reject(err)
            })
        })

        await expect(parsePromise).rejects.toThrow('timeout')
    }, 1_000)
})
