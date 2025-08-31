// lib/genlex-traced.js
import response from '../parsec/response.js'
import { F, C, N } from '../parsec/index.js'
import unit from '../data/unit.js'
import { TokenDefinition, TokenValue } from './genlex.js'

// Hidden metadata on token instances to correlate layers
const META = Symbol('token.meta')

function defaultSpaces() {
    return C.charIn(' \r\n\f\t').map(() => unit)
}

/**
 * TracingGenLex:
 * - keeps the same behavior as GenLex
 * - adds event emission for lexing and grammar consumption
 */
export class TracingGenLex {
    constructor(tracer) {
        this.spaces = defaultSpaces()
        this.definitions = []
        this.tokensMap = {}
        this._ordinal = 0 // token index in token stream
        this.tracer = tracer // EventTracer or null
    }

    setTracer(tracer) {
        this.tracer = tracer
        return this
    }

    tokenize(parser, name, priority = 1000) {
        if (typeof parser === 'string') {
            if (name === undefined) name = parser
            return this.tokenize(C.string(parser), name, priority)
        }
        const definition = new TokenDefinition(parser, name, priority)
        this.definitions.push(definition)

        // Build a GRAMMAR-layer token consumer with tracing
        const tokenParser = this._expectTokenTraced(name)
        this.tokensMap[name] = tokenParser
        return tokenParser
    }

    keywords(keys, priority = 1000) {
        return keys.reduce(
            (acc, key) => acc.concat(this.tokenize(key, key, priority)),
            [],
        )
    }

    setSeparators(spacesCharacters) {
        if (typeof spacesCharacters !== 'string') {
            throw new Error(
                "setSeparators needs a string like ' \\r\\n\\f\\t'; use setSeparatorsParser otherwise",
            )
        }
        this.spaces = C.charIn(spacesCharacters).map(() => unit)
    }

    setSeparatorsParser(spacesParser) {
        this.spaces = spacesParser.map(() => unit)
    }

    remove(tokenName) {
        this.definitions = this.definitions.filter(d => d.name !== tokenName)
        delete this.tokensMap[tokenName]
    }

    tokens() {
        return this.tokensMap
    }
    get(tokenName) {
        return this.tokensMap[tokenName]
    }

    // ===== Core: build tokenizer with tracing (char stream) =====

    buildTokenizer() {
        const token = this._findTokenByPriorityTraced()
        const leftSpaces = this.spaces.optrep().drop()
        const rightSpaces = this.spaces.optrep().drop()

        // Custom parse to capture char positions and attach token metadata
        return F.parse((input, index = 0) => {
            // consume leading spaces
            const resL = leftSpaces.parse(input, index)
            if (!resL.isAccepted()) return response.reject(input, index, false)
            const startChar = resL.offset

            if (this.tracer) {
                this.tracer.emit({ type: 'lex-start', startChar })
            }

            // parse token (already traced per-candidate internally)
            const resTok = token.parse(input, startChar)
            if (!resTok.isAccepted())
                return response.reject(input, index, false)

            const tokenValue = resTok.value // TokenValue
            const endChar = resTok.offset // end of token (before trailing spaces)

            // trailing spaces
            const resR = rightSpaces.parse(input, endChar)
            const finalOffset = resR.isAccepted() ? resR.offset : endChar

            // Attach metadata to the token value
            const ord = this._ordinal++
            tokenValue[META] = { tokenIndex: ord, startChar, endChar }

            // Emit final commit event (includes tokenIndex and trailing info)
            if (this.tracer) {
                this.tracer.emit({
                    type: 'lex-commit',
                    name: tokenValue.name,
                    tokenIndex: ord,
                    startChar,
                    endChar,
                    value: tokenValue.value,
                    trailing: finalOffset - endChar,
                })
                this.tracer.setLastTokenMeta(tokenValue[META])
            }

            // Return the single token (spaces are dropped)
            return response.accept(tokenValue, input, finalOffset, true)
        }).single()
    }

    use(grammar) {
        return this.buildTokenizer().chain(grammar)
    }

    // ====== Priority choice with per-candidate tracing ======

    _findTokenByPriorityTraced() {
        const sorted = this.definitions
            .slice()
            .sort((d1, d2) => d2.priority - d1.priority)

        const chain = sorted.reduce((orAcc, def) => {
            const candidate = this._wrapCandidateToken(def) // traced candidate
                .or(orAcc)
            return candidate
        }, F.error())

        return chain
    }

    _wrapCandidateToken(def) {
        // Build the original candidate that yields TokenValue
        const base = def.parser.map(value => new TokenValue(def.name, value))

        // Wrap to emit lex-try / accept / reject at char layer
        return F.parse((input, index = 0) => {
            this.tracer.emit({
                type: 'lex-try',
                name: def.name,
                priority: def.priority,
                startChar: index,
            })

            const res = base.parse(input, index)
            if (res.isAccepted()) {
                const endChar = res.offset
                const tokenValue = res.value
                this.tracer.emit({
                    type: 'lex-accept',
                    name: def.name,
                    priority: def.priority,
                    startChar: index,
                    endChar,
                    value: tokenValue.value,
                })
                return res
            } else {
                this.tracer.emit({
                    type: 'lex-reject',
                    name: def.name,
                    priority: def.priority,
                    startChar: index,
                })
                return res
            }
        })
    }

    // ====== Grammar-layer consumer with tracing ======
    _expectTokenTraced(expectedName) {
        // Equivalent shape to your expectToken, but instrumented and simplified
        return F.parse((input, index = 0) => {
            const t = input.get(index)
            return t
                .map(tokenValue => {
                    const meta = tokenValue && tokenValue[META]
                    const foundName = tokenValue?.name

                    if (foundName === expectedName) {
                        this.tracer.emit({
                            type: 'grammar-accept',
                            name: expectedName,
                            tokenIndex: meta?.tokenIndex,
                            startChar: meta?.startChar,
                            endChar: meta?.endChar,
                            value: tokenValue.value,
                        })
                        this.tracer.setLastTokenMeta(meta || null)
                        return response.accept(
                            tokenValue.value,
                            input,
                            index + 1,
                            true,
                        )
                    } else {
                        this.tracer.emit({
                            type: 'grammar-mismatch',
                            expected: expectedName,
                            found: foundName ?? null,
                            tokenIndex: meta?.tokenIndex,
                            startChar: meta?.startChar,
                            endChar: meta?.endChar,
                        })
                        return response.reject(input, index, false)
                    }
                })
                .lazyRecoverWith(() => {
                    this.tracer.emit({
                        type: 'grammar-eos',
                        expected: expectedName,
                        tokenIndex: null,
                    })
                    return response.reject(input, index, false)
                })
        })
    }
}
