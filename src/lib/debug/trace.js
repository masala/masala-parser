// lib/debug/trace.js
import atry from '../../lib/data/try.js'

// lib/debug/trace-registry.js
// A tiny global registry for named parser instances.

export const TRACE_REGISTRY = new Set() // holds parser instances
export const TRACE_META = new WeakMap() // parser -> { name, opts }
export const TRACE_NAME_SYM = Symbol('masala.trace.name')

export function registerTrace(parser, name, opts = {}) {
    if (typeof name !== 'string' || !name) {
        throw new Error('Parser.trace(name): name must be a non-empty string')
    }
    TRACE_REGISTRY.add(parser)
    TRACE_META.set(parser, { name, opts })
    // decorate instance for convenient devtools debugging
    try {
        Object.defineProperty(parser, TRACE_NAME_SYM, {
            value: name,
            configurable: true,
            enumerable: false,
            writable: false,
        })
    } catch (_) {
        /* non-fatal */
    }
}

/**
 * Create a tracer that instruments chosen Parser instances.
 *
 * Usage:
 *   const tracer = createTracer({ window: [start, end], includeValues: true })
 *   const traced = tracer.trace(rightText, 'rightText', { showValue: true })(fullParser)
 *   traced.parse(Streams.ofChar(input))
 *   console.log(JSON.stringify(tracer.flush(), null, 2))
 */
export function createTracer({
    window = [0, Number.MAX_SAFE_INTEGER],
    includeValues = true,
    includeRejects = true,
    snippet = true, // include a text snippet for the consumed span
    snippetMax = 80, // truncate long snippets
} = {}) {
    const [winStart, winEnd] = window
    const logs = []
    let depth = 0

    // Keep originals so we can avoid double wrapping or restore later
    const originals = new WeakMap()
    // Track wrapped parsers so we can iterate at restore time
    const wrapped = new Set()

    function overlaps(start, end) {
        // true if [start,end) intersects [winStart,winEnd)
        return Math.max(start, winStart) < Math.min(end, winEnd)
    }

    function takeSubstring(input, from, to) {
        // Best effort: walk the stream using input.get(i)
        const chars = []
        for (let i = Math.max(0, from); i < Math.max(from, to); i++) {
            const t = input.get
                ? input.get(i)
                : atry.failure(new Error('no get'))
            if (!t || !t.isSuccess()) {
                break
            }
            chars.push(t.success())
            if (chars.length >= snippetMax) {
                chars.push('…')
                break
            }
        }
        return chars.join('')
    }

    function record(entry) {
        logs.push({
            ts: Date.now(),
            depth,
            ...entry,
        })
    }

    function wrapOne(targetParser, name, { showValue = includeValues } = {}) {
        if (!targetParser || typeof targetParser.parse !== 'function') {
            throw new Error(`trace(${name}): target is not a Parser instance`)
        }
        if (originals.has(targetParser)) {
            return
        } // already wrapped

        const originalParse = targetParser.parse
        originals.set(targetParser, originalParse)
        wrapped.add(targetParser)

        targetParser.parse = function tracedParse(input, index = 0) {
            const start = input.location(index)

            const shouldEnterLog = start >= winStart && start < winEnd

            // (A) pre-event (only if entering in window start)
            if (shouldEnterLog) {
                depth++
                record({ phase: 'enter', name, start })
            }

            // (B) run the actual parse
            const res = originalParse.call(this, input, index)

            // Compute end/consumption even when rejected
            const end = res.offset
            const spanInWindow = overlaps(start, end) || shouldEnterLog

            // (C) post-event (only if we touched the window, and keep rejects if asked)
            const accepted = res.isAccepted()
            if (spanInWindow && (accepted || includeRejects)) {
                const entry = {
                    phase: 'exit',
                    name,
                    accepted,
                    start,
                    end,
                    consumed: Math.max(0, end - start),
                }
                if (snippet && end > start) {
                    entry.snippet = takeSubstring(input, start, end)
                }
                if (accepted && showValue) {
                    entry.value = res.value
                }
                record(entry)
            }

            if (shouldEnterLog) {
                depth--
            }
            return res
        }
    }

    function resolvePerParserOpts(name, metaOpts, options) {
        let base = { ...metaOpts }
        if (!options) {
            return base
        }
        if (options.byName && options.byName[name]) {
            return { ...base, ...options, ...options.byName[name] }
        }
        // treat options as global defaults if no byName match
        return { ...base, ...options }
    }

    function traceAll(options) {
        for (const parser of TRACE_REGISTRY) {
            const meta = TRACE_META.get(parser)
            if (!meta) {
                continue
            }
            const per = resolvePerParserOpts(meta.name, meta.opts, options)
            wrapOne(parser, meta.name, per)
        }
        return (rootParser) => rootParser // pass-through to keep pipeline style
    }

    return {
        /**
         * Instruments a specific Parser instance and returns a function
         * that simply returns the root parser (so you can use it in a
         * “pipeline” style without rebuilding the grammar).
         *
         * Example:
         *   const traced = tracer.trace(rightText, 'rightText')(fullParser);
         *   // `traced` === `fullParser` but `rightText.parse` is now wrapped
         */
        trace(targetParser, name, opts) {
            wrapOne(targetParser, name, opts)
            return (rootParser) => rootParser
        },

        traceAll,

        /**
         * Remove all wrappers (optional)
         */
        restore() {
            wrapped.forEach((parser) => {
                const orig = originals.get(parser)
                if (orig) {
                    parser.parse = orig
                    originals.delete(parser)
                }
            })
            wrapped.clear()
        },

        /**
         * Return and clear the logs
         */
        flush() {
            return logs.splice(0, logs.length)
        },
    }
}
