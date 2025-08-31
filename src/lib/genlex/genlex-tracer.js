// lib/debug/tracer.js
export class EventTracer {
    constructor({
        window = [0, Number.MAX_SAFE_INTEGER],
        includeRejects = true,
        snippetMax = 80,
    } = {}) {
        this.window = window
        this.includeRejects = includeRejects
        // TODO: it seems no snippet is used or needed
        this.snippetMax = snippetMax
        this.events = []
    }
    _inWindow(charIndex) {
        const [a, b] = this.window
        return charIndex >= a && charIndex < b
    }
    _push(e) {
        // filter by char start if present
        if (typeof e.startChar === 'number' && !this._inWindow(e.startChar))
            return
        if (!this.includeRejects && /reject|mismatch/i.test(e.type)) return
        this.events.push({ ts: Date.now(), ...e })
    }
    emit(e) {
        this._push(e)
    }
    flush() {
        return this.events.splice(0, this.events.length)
    }

    setLastTokenMeta(meta) {
        this._lastTokenMeta = meta
    }
    getLastTokenMeta() {
        return this._lastTokenMeta
    }
}
