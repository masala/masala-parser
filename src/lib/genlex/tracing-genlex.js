import response from '../core/response.js'
import { F, C } from '../core/index.js'
import { GenlexEventTracer } from './genlex-event-tracer.js'
import { GenLex, TokenDefinition, Token } from './genlex.js'

// Hidden metadata on token instances to correlate layers
const META = Symbol('token.meta')

export class TracingGenLex extends GenLex {
    constructor(tracer = new GenlexEventTracer()) {
        super()
        this._ordinal = 0 // token index in token stream
        this.tracer = tracer
    }

    tokenize(parser, name, priority = 1000) {
        if (typeof parser === 'string') {
            if (name === undefined) {
                name = parser
            }
            return this.tokenize(C.string(parser), name, priority)
        }

        const definition = new TokenDefinition(parser, name, priority)
        this.definitions.push(definition)

        const tokenParser = expectTokenTraced(name, this.tracer)
        this.tokensMap[name] = tokenParser
        tokenParser.__token__name = name
        return tokenParser
    }

    buildTokenizer() {
        const nextTokenFinder = this._findTokenByPriorityTraced()
        const leftSpaces = this.spaces.optrep().drop()
        const rightSpaces = this.spaces.optrep().drop()

        // Custom parse to capture char positions and attach token metadata
        return F.parse((input, index = 0) => {
            // consume leading spaces
            const responseLeft = leftSpaces.parse(input, index)

            const startChar = responseLeft.offset

            this.tracer.emit({ type: 'lex-start', startChar, index })

            // parse token (already traced per-candidate internally)
            const responseToken = nextTokenFinder.parse(input, startChar)
            if (!responseToken.isAccepted()) {
                this.tracer.emit({
                    type: 'lex-fail',
                    startChar,
                    index,
                    snippet: getSnippet(input, startChar),
                })
                return response.reject(input, index, false)
            }

            const token = responseToken.value // Token found
            const endChar = responseToken.offset // end of token (before trailing spaces)

            // trailing spaces
            const resR = rightSpaces.parse(input, endChar)
            const finalOffset = resR.offset

            // Attach metadata to the token value
            const tokenIndex = this._ordinal++
            token[META] = { tokenIndex, startChar, endChar }

            // Emit final commit event (includes tokenIndex and trailing info)
            this.tracer.emit({
                // follows lex-taken, with trailing spaces
                type: 'lex-commit',
                name: token.name,
                tokenIndex,
                startIndex: index,
                startChar,
                endChar,
                value: token.value,
                // counts how many trailing spaces were consumed
                trailing: finalOffset - endChar,
                snippet: getSnippet(input, startChar),
            })
            this.tracer.setLastTokenMeta(token[META])

            // Return the single token (spaces are dropped)
            return response.accept(token, input, finalOffset, true)
        })
    }

    _findTokenByPriorityTraced() {
        const sortedDefinitions = this.definitions
            .slice()
            .sort((d1, d2) => d2.priority - d1.priority)

        return sortedDefinitions.reduce(
            (combinator, definition) =>
                F.try(this.getWrappedTokenParser(definition)).or(combinator),
            F.error(),
        )
    }

    getWrappedTokenParser(def) {
        // Build the original candidate that yields TokenValue
        const base = def.parser.map((value) => new Token(def.name, value))

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
                    type: 'lex-taken',
                    name: def.name,
                    priority: def.priority,
                    startChar: index,
                    endChar,
                    value: tokenValue.value,
                    snippet: getSnippet(input, index),
                })
                return res
            } else {
                // This token candidate did not match, but maybe another will
                this.tracer.emit({
                    type: 'lex-no-match',
                    name: def.name,
                    priority: def.priority,
                    startChar: index,
                })
                return res
            }
        })
    }

    flush() {
        return this.tracer.flush()
    }

    flushForAi() {
        return this.tracer.flushForAi()
    }
}

function expectTokenTraced(expectedName, tracer) {
    // Equivalent shape to expectToken, but instrumented and simplified

    return F.parse((input, index) => {
        return input
            .get(index)
            .map((token) => {
                let streamTokenValue = token
                const accepted = token.name === expectedName
                if (accepted) {
                    // CASE 'grammar-accept'
                    const type = 'grammar-accept'
                    const meta = token[META]

                    tracer.emit({
                        type,
                        name: expectedName,
                        tokenIndex: meta.tokenIndex,
                        startChar: meta.startChar,
                        endChar: meta.endChar,
                        value: token.value,
                    })
                    tracer.setLastTokenMeta(meta)
                    return response.accept(token, input, index + 1, true)
                } else {
                    // CASE 'grammar-reject'
                    const type = 'grammar-reject'
                    const meta = streamTokenValue[META]
                    const foundName = streamTokenValue.name

                    tracer.emit({
                        type,
                        expected: expectedName,
                        found: foundName,
                        tokenIndex: meta.tokenIndex,
                        startChar: meta.startChar,
                        endChar: meta.endChar,
                    })
                    return response.reject(input, index, false)
                }
            })
            .lazyRecoverWith(() => {
                // No token at all (empty string or only spaces)
                tracer.emit({
                    type: 'grammar-eos',
                    expected: expectedName,
                    tokenIndex: null,
                    index,
                })
                return response.reject(input, index, false)
            })
    })
}

export function getSnippet(input, startChar, maxLength = 16) {
    if (!input.__is__char__stream) {
        return
    }

    if (startChar === undefined) {
        return ''
    }
    const snippet = input.source.slice(startChar)
    if (snippet.length <= maxLength) {
        return snippet
    }
    return snippet.slice(0, maxLength) + '...'
}
