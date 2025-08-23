import response from '../parsec/response.js'
import { F, C, N } from '../parsec/index.js'
import unit from '../data/unit.js'
import { EventTracer } from './genlex-tracer.js'
import { TokenDefinition, TokenValue } from './genlex.js'

// Hidden metadata on token instances to correlate layers
const META = Symbol('token.meta')
function defaultSpaces() {
    return C.charIn(' \r\n\f\t').map(() => unit)
}

export class TracingGenLex {
    constructor(tracer = null) {
        this.spaces = defaultSpaces()
        // definitions keep trace of all: parser, precedence and name
        this.definitions = []
        // get a token, but not directly its precedence
        this.tokensMap = {}
        this._ordinal = 0 // token index in token stream
        if (tracer === undefined) {
            throw 'TracingGenLex needs a tracer (EventTracer) to be useful'
        }
        this.tracer = tracer

        if (!tracer) {
            // Tracer with default options
            this.tracer = new EventTracer()
        }
    }

    tokenize(parser, name, precedence = 1000) {
        if (typeof parser === 'string') {
            if (name === undefined) {
                name = parser
            }
            return this.tokenize(C.string(parser), name, precedence)
        }

        const definition = new TokenDefinition(parser, name, precedence)
        this.definitions.push(definition)

        const tokenParser = expectTokenTraced(
            tokenValue => tokenValue.accept(name),
            name,
            this.tracer,
        )
        this.tokensMap[name] = tokenParser
        tokenParser.__token__name = name
        return tokenParser
    }

    keywords(keys, precedence = 1000) {
        return keys.reduce(
            (acc, key) => acc.concat(this.tokenize(key, key, precedence)),
            [],
        )
    }

    setSeparators(spacesCharacters) {
        if (typeof spacesCharacters !== 'string') {
            throw "setSeparators needs a string as separators, such as ' \r\n\f\t' ;" +
                ' use  setSeparatorsParser to declare a parser'
        }
        this.spaces = C.charIn(spacesCharacters).map(() => unit)
    }

    /**
     * Set separator Parser. It's up to the parser to accept or not
     * optional repetition
     * @param spacesParser
     */
    setSeparatorsParser(spacesParser) {
        this.spaces = spacesParser.map(() => unit)
    }

    updatePrecedence(tokenName, precedence) {
        this.definitions.find(
            def => def.name === tokenName,
        ).precedence = precedence
    }

    buildTokenizer() {
        const nextTokenFinder = this._findTokenByPrecedenceTraced()
        const leftSpaces = this.spaces.optrep().drop()
        const rightSpaces = this.spaces.optrep().drop()

        // Custom parse to capture char positions and attach token metadata
        return F.parse((input, index = 0) => {
            // consume leading spaces
            const responseLeft = leftSpaces.parse(input, index)
            if (!responseLeft.isAccepted()) {
                // as spaces are optional, this should not happen
                return response.reject(input, index, false)
            }

            const startChar = responseLeft.offset

            //console.log('#2 - emitting lex-start', { startChar, index })
            this.tracer.emit({ type: 'lex-start', startChar, index })

            // parse token (already traced per-candidate internally)
            const responseToken = nextTokenFinder.parse(input, startChar)
            if (!responseToken.isAccepted()) {
                /*console.log('#3 - !! Not any valid token found', {
                    snippet: getSnippet(input, startChar),
                    startChar,
                    index,
                })*/
                this.tracer.emit({
                    type: 'lex-fail',
                    startChar,
                    index,
                    snippet: getSnippet(input, startChar),
                })
                return response.reject(input, index, false)
            }

            const tokenValue = responseToken.value // TokenValue
            const endChar = responseToken.offset // end of token (before trailing spaces)

            // trailing spaces
            const resR = rightSpaces.parse(input, endChar)
            const finalOffset = resR.isAccepted() ? resR.offset : endChar

            // Attach metadata to the token value
            const tokenIndex = this._ordinal++
            tokenValue[META] = { tokenIndex, startChar, endChar }

            // Emit final commit event (includes tokenIndex and trailing info)

            this.tracer.emit({
                // follows lex-taken, with trailing spaces
                type: 'lex-commit',
                name: tokenValue.name,
                tokenIndex,
                startIndex: index,
                startChar,
                endChar,
                value: tokenValue.value,
                // counts how many trailing spaces were consumed
                trailing: finalOffset - endChar,
            })
            this.tracer.setLastTokenMeta(tokenValue[META])

            /*console.log('#5 - accepted token', {
                name: tokenValue.name,
                tokenIndex,
                startChar,
                endChar,
                value: tokenValue.value,
                index,
                consumed: true,
            })*/

            // Return the single token (spaces are dropped)
            return response.accept(tokenValue, input, finalOffset, true)
        })
    }

    use(grammar) {
        return this.buildTokenizer().chain(grammar)
    }

    _findTokenByPrecedenceTraced() {
        const sortedDefinitions = this.definitions
            .slice()
            .sort((d1, d2) => d2.precedence - d1.precedence)

        return sortedDefinitions.reduce(
            (combinator, definition) =>
                F.try(
                    this.getWrappedTokenParser(definition).debug(
                        definition.name,
                    ),
                )
                    //    .or (F.error('no match for '+definition.name))
                    .or(combinator),
            F.error(),
        )
    }

    getWrappedTokenParser(def) {
        // Build the original candidate that yields TokenValue
        const base = def.parser.map(value => new TokenValue(def.name, value))

        // Wrap to emit lex-try / accept / reject at char layer
        return F.parse((input, index = 0) => {
            //console.log({ try: def.name, index })
            this.tracer.emit({
                type: 'lex-try',
                name: def.name,
                precedence: def.precedence,
                startChar: index,
            })

            const res = base.parse(input, index)
            if (res.isAccepted()) {
                //console.log({ taken: def.name, index })
                const endChar = res.offset
                const tokenValue = res.value
                this.tracer.emit({
                    type: 'lex-taken',
                    name: def.name,
                    precedence: def.precedence,
                    startChar: index,
                    endChar,
                    value: tokenValue.value,
                })
                return res
            } else {
                // console.log({ no_match: def.name, index })
                // This token candidate did not match, but maybe another will
                this.tracer.emit({
                    type: 'lex-no-match',
                    name: def.name,
                    precedence: def.precedence,
                    startChar: index,
                })
                return res
            }
        })
    }

    remove(tokenName) {
        // find definitions
        this.definitions = this.definitions.filter(d => d.name !== tokenName)
        delete this.tokensMap[tokenName]
    }

    // type: { [key: string]: Parser }
    tokens() {
        return this.tokensMap
    }

    get(tokenName) {
        return this.tokensMap[tokenName]
    }
}

function getTokenParser(def) {
    return def.parser.map(value => new TokenValue(def.name, value))
}

function expectTokenTraced(tokenize, expectedName, tracer) {
    // Equivalent shape to your expectToken, but instrumented and simplified

    return F.parse((input, index) => {
        return input
            .get(index)
            .map(value => {
                //TODO: keep for logger
                let streamTokenValue = value

                try {
                    /*console.log('1: in map', {
                            value: JSON.stringify(value),
                            name,
                            index,
                        })*/
                    //console.log('tokenizing', tokenize(token))
                } catch (e) {
                    console.error('failed', e)
                }
                return tokenize(value) // Option
                    .map(tokenValue => {
                        // CASE 'grammar-accept'
                        const type = 'grammar-accept'
                        const meta = tokenValue && tokenValue[META]
                        const foundName = tokenValue?.name

                        console.log('##', {
                            type,
                            expectedName,
                            tokenValue,
                            streamTokenValue,
                            meta,
                            foundName,
                        })
                        tracer.emit({
                            type: 'grammar-accept',
                            name: expectedName,
                            tokenIndex: meta?.tokenIndex,
                            startChar: meta?.startChar,
                            endChar: meta?.endChar,
                            value: tokenValue.value,
                        })
                        tracer.setLastTokenMeta(meta || null)
                        return response.accept(
                            tokenValue,
                            input,
                            index + 1,
                            true,
                        )
                    })
                    .orLazyElse(() => {
                        const type = 'grammar-reject'
                        const meta = streamTokenValue && streamTokenValue[META]
                        const foundName = streamTokenValue?.name
                        console.log('####### GRAMMAR REJECT #########')
                        console.log('##', {
                            type,
                            expectedName,
                            streamTokenValue,
                            meta,
                            foundName,
                        })
                        tracer.emit({
                            type: 'grammar-reject',
                            expected: expectedName,
                            found: foundName ?? null,
                            tokenIndex: meta?.tokenIndex,
                            startChar: meta?.startChar,
                            endChar: meta?.endChar,
                        })
                        // CASE : 'grammar-mismatch',
                        // TODO logger console.log('lazyElse failed with ', name, index);
                        // console.log('reject:',index, input.source.offsets[index],input,'>>>', value,
                        //  input.location(index));
                        return response.reject(input, index, false)
                    })
            })
            .lazyRecoverWith(() => {
                // try with empty string
                // No token at all (empty string or only spaces)
                console.log('####### GRAMMAR LAZY RECOVER #########')
                tracer.emit({
                    type: 'grammar-eos', // TODO: not sure of this name
                    expected: expectedName,
                    tokenIndex: null,
                    index,
                })
                // CASE 'grammar-eos' ?
                // TODO logger console.log('failed with ', name, index);
                //console.log('lazyRecover with offset:', input.location(index));
                return response.reject(input, index, false)
            })
    })
}

export function getSnippet(input, startChar, maxLength = 16) {
    if (!input.__is__string__stream) {
        return
    }

    if (startChar === undefined) return ''
    const snippet = input.source.slice(startChar)
    if (snippet.length <= maxLength) {
        return snippet
    }
    return snippet.slice(0, maxLength) + '...'
}
