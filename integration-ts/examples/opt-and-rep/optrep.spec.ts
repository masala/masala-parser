import { C, N, Streams } from "@masala/parser";
import { describe, it, expect } from "vitest";
import { Worker } from "worker_threads";

describe('Optrep parser', () => {

    describe("optrep parser", () => {

        it("should accept *zero* occurrence and still proceed", () => {
            const tp     = C.char("a").optrep();   // ← 0‒∞ “a”
            const mixed  = tp.then(N.number());    // tuple + trailing number

            const data = mixed.val("0");           // no “a”, just the number
            expect(data.size()).toEqual(1);
            expect(data.first()).toBe(0);
        });

        it("should collect many occurrences just like rep() but stay optional", () => {
            const tp     = C.char("a").optrep();
            const mixed  = tp.then(N.number());

            const data = mixed.val("aaa0");
            expect(data.size()).toEqual(4);   // 3 × 'a'  +  1 number
            expect(data.at(0)).toBe("a");
            expect(data.at(2)).toBe("a");
            expect(data.last()).toBe(0);
        });

        it("should merge neutral elements cleanly when dropped", () => {
            const spaces = C.char(" ").drop().optrep();   // skip leading blanks
            const word   = C.letters();

            const mixed  = spaces.then(word);

            const data   = mixed.val("   hello");
            expect(data.size()).toEqual(1);       // blanks vanished
            expect(data.first()).toBe("hello");
        });



        it("should build structured results out of zero-or-more tokens", () => {
            type Token = { word: string; punctuation?: string };

            const punct   = C.charIn(".,!?").opt();    // optional punctuation
            const token   = C.letters()
                .then(punct)
                .array()          // collect all tokens
                .map(([word, p]) => ({ word, punctuation: p.orElse(undefined) } as Token));

            const sentence = token.optrep();           // 0‒∞ tokens

            const data = sentence.val("hello,world!");
            expect(data.size()).toEqual(2);            // h e l l o ,  w o r l d !
            expect(data.at(0).word).toBe("hello");
            expect(data.at(0).punctuation).toBe(",");
            expect(data.last().punctuation).toBe("!");
        });

    });


})


describe("optrep – infinite-loop guard", () => {
    /**
     * Nested .optrep() is known to loop forever.  We detect that by
     * running the parse in a worker-thread and terminating it after
     * 300 ms.  The test EXPECTS that termination (i.e. the promise
     * rejects with “timeout”); if the parser ever returns normally
     * the assertion will fail – which is exactly what we want once
     * the bug is fixed.
     */
    it(
        "should throw after 0.3 s when nested optrep() hangs",
        async () => {
            // Worker source code as a string so we can `eval` it.
            const workerSource = `
        const { parentPort } = require('worker_threads');
        const { C, N, Streams } = require('@masala/parser');

        const blocks = N.number()
          .then(C.char("/"))
          .optrep()
          .optrep(); // ✨ THE FOREVER PARSE

        // If it *ever* finishes we ping back
        try {
          const stream = Streams.ofString("1/2/3/4/5/");
          blocks.parse(stream);
          parentPort.postMessage("finished");   // should never happen
        } catch (e) {
          parentPort.postMessage({ error: e.message });
        }
      `;

            const worker = new Worker(workerSource, { eval: true });

            // Wrap the worker in a promise that rejects after 300 ms.
            const parsePromise: Promise<never> = new Promise((_, reject) => {
                // ❶ Rejection timer
                const timer = setTimeout(() => {
                    // kill the worker and reject with a custom error
                    worker.terminate().then(() => reject(new Error("timeout")));
                }, 300);

                // ❷ Any message from the worker clears the timer and fails the test
                worker.once("message", (msg) => {
                    clearTimeout(timer);
                    // We expect a *timeout*, so any normal completion is a failure
                    reject(
                        new Error(
                            typeof msg === "string"
                                ? `unexpected worker completion: ${msg}`
                                : `worker error: ${msg.error}`
                        )
                    );
                });

                // ❸ Propagate worker runtime errors
                worker.once("error", (err) => {
                    clearTimeout(timer);
                    reject(err);
                });
            });

            // The assertion: the promise **must** reject with “timeout”.
            await expect(parsePromise).rejects.toThrow("timeout");
        },
        1_000 // give the whole test 1 s – plenty beyond the 300 ms guard
    );
});

