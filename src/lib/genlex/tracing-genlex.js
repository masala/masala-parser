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
            (tokenValue) => tokenValue.accept(name),
            name,
            this.tracer,
        )
        this.tokensMap[name] = tokenParser
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
            throw (
                "setSeparators needs a string as separators, such as ' \r\n\f\t' ;" +
                ' use  setSeparatorsParser to declare a parser'
            )
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
        this.definitions.find((def) => def.name === tokenName).precedence =
            precedence
    }

    buildTokenizer() {
        /*const token = this._findTokenByPrecedenceTraced()
        return this.spaces
            .optrep()
            .drop()
            .then(token)
            .then(this.spaces.optrep().drop())
            .single()*/

        const token = this._findTokenByPrecedenceTraced()
        const leftSpaces = this.spaces.optrep().drop()
        const rightSpaces = this.spaces.optrep().drop()

        // Custom parse to capture char positions and attach token metadata
        return F.parse((input, index = 0) => {
            // consume leading spaces
            const responseLeft = leftSpaces.parse(input, index)
            if (!responseLeft.isAccepted()) {
                console.log('#0 - failed to parse leading spaces', {
                    index,
                })
                return response.reject(input, index, false)
            }
            console.log('#1 - leading spaces parsed', {
                offset: responseLeft.offset,
                index,
            })
            const startChar = responseLeft.offset

            console.log('#2 - emitting lex-start', { startChar, index })
            this.tracer.emit({ type: 'lex-start', startChar })

            // parse token (already traced per-candidate internally)
            const responseToken = token.parse(input, startChar)
            if (!responseToken.isAccepted()) {
                console.log('#3 - failed to parse token', {
                    startChar,
                    index,
                })
                return response.reject(input, index, false)
            }

            const tokenValue = responseToken.value // TokenValue
            const endChar = responseToken.offset // end of token (before trailing spaces)

            // trailing spaces
            const resR = rightSpaces.parse(input, endChar)
            const finalOffset = resR.isAccepted() ? resR.offset : endChar

            console.log('#4 - trailing spaces parsed', {
                finalOffset,
                rightSpacesAccepted: resR.isAccepted(),
                endChar,
            })

            // Attach metadata to the token value
            const ord = this._ordinal++
            tokenValue[META] = { tokenIndex: ord, startChar, endChar }

            // Emit final commit event (includes tokenIndex and trailing info)

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

            // Return the single token (spaces are dropped)
            console.log('#5 - accepting token', {
                tokenValue,
                finalOffset,

                index,
                consumed: true,
            })
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
        const base = def.parser.map((value) => new TokenValue(def.name, value))

        // Wrap to emit lex-try / accept / reject at char layer
        return F.parse((input, index = 0) => {
            console.log({ try: def.name, index })
            this.tracer.emit({
                type: 'lex-try',
                name: def.name,
                precedence: def.precedence,
                startChar: index,
            })

            const res = base.parse(input, index)
            if (res.isAccepted()) {
                console.log({ taken: def.name, index })
                const endChar = res.offset
                const tokenValue = res.value
                this.tracer.emit({
                    type: 'lex-accept',
                    name: def.name,
                    precedence: def.precedence,
                    startChar: index,
                    endChar,
                    value: tokenValue.value,
                })
                return res
            } else {
                console.log({ no_match: def.name, index })
                this.tracer.emit({
                    type: 'lex-reject',
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
        this.definitions = this.definitions.filter((d) => d.name !== tokenName)
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
    return def.parser.map((value) => new TokenValue(def.name, value))
}

// name is for easier debugging
// expectToken consumes exactly one token of this name and give me its value.
// eslint-disable-next-line
function expectToken(tokenize, name) {
    return F.parse((input, index) => {
        // TODO logger console.log('testing ', {name, input:input.get(index), index});
        //console.log('trying ', { index, name, input })

        return (
            input
                .get(index)
                // FIXME= value is the token, token is the value
                .map((value) => {
                    //TODO: keep for logger
                    let token = value

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

                    return tokenize(value)
                        .map((tokenValue) => {
                            // TODO logger console.log('accept with ', name, index);
                            /*console.log(
                                '### accept:',
                                tokenValue,
                                index,
                                input.location(index),
                            )*/
                            return response.accept(
                                tokenValue,
                                input,
                                index + 1,
                                true,
                            )
                        })
                        .orLazyElse(() => {
                            // TODO logger console.log('lazyElse failed with ', name, index);
                            // console.log('reject:',index, input.source.offsets[index],input,'>>>', value,
                            //  input.location(index));
                            return response.reject(input, index, false)
                        })
                })
                .lazyRecoverWith(() => {
                    // TODO logger console.log('failed with ', name, index);
                    //console.log('lazyRecover with offset:', input.location(index));
                    return response.reject(input, index, false)
                })
        )
    })
}

function expectTokenTraced(tokenize, expectedName, tracer) {
    // Equivalent shape to your expectToken, but instrumented and simplified
    return F.parse((input, index) => {
        return input
            .get(index)
            .map((value) => {
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
                    .map((tokenValue) => {
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
                tracer.emit({
                    type: 'grammar-eos',
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
