import { isTuple, Tuple } from '../data/tuple.js'
import response from '../parsec/response.js'
import { F, C, N } from '../parsec/index.js'
import unit from '../data/unit.js'

/**
 * And its value is the parsed text
 * Example: C.char(':') -> name = 'colon' or ':', value = ':'
 */
export class TokenDefinition {
    // value will be determined at runtime while parsing
    constructor(parser, name, priority) {
        this.parser = parser
        this.name = name
        this.priority = priority
    }
}

// a Token object is instantiated at runtime, with a value given by the parsed text
export class Token {
    __token = true
    constructor(name, value) {
        this.name = name
        this.value = value
    }
}

export class GenLex {
    constructor() {
        this.spaces = defaultSpaces()
        // definitions keep trace of all: parser, priority and name
        this.definitions = []
        // get a token, but not directly its priority
        this.tokensMap = {}
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

        const tokenParser = expectToken(name)
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

    buildTokenizer() {
        const token = this.findTokenByPriority()
        return this.spaces
            .optrep()
            .drop()
            .then(token)
            .then(this.spaces.optrep().drop())
            .single()
    }

    use(grammar) {
        return this.buildTokenizer().chain(grammar)
    }

    findTokenByPriority() {
        const sortedDefinitions = this.definitions.sort(
            (d1, d2) => d2.priority - d1.priority,
        )

        return sortedDefinitions.reduce(
            (combinator, definition) =>
                F.try(getTokenParser(definition))
                    //    .or (F.error('no match for '+definition.name))
                    .or(combinator),
            F.error(),
        )
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
    return def.parser.map((value) => new Token(def.name, value))
}

// expectToken consumes exactly one token of this name and give me its value.
function expectToken(name) {
    return F.parse((tokenStream, index) => {
        return tokenStream
            .get(index)
            .map((token) => {
                const accepted = token.name === name
                if (accepted) {
                    // CASE 'grammar-accept'
                    return response.accept(token, tokenStream, index + 1, true)
                } else {
                    // CASE 'grammar-reject'
                    return response.reject(tokenStream, index, false)
                }
            })
            .lazyRecoverWith(() => {
                // No token at all (empty string or only spaces)
                // (Or something was thrown)
                return response.reject(tokenStream, index, false)
            })
    })
}

function defaultSpaces() {
    return C.charIn(' \r\n\f\t').map(() => unit)
}

export function anyToken(genlex) {
    const tokenParsers = Object.values(genlex.tokens())
    return F.tryAll(tokenParsers)
}

export function getMathGenLex() {
    const basicGenlex = new GenLex()

    // We try first to have digits
    basicGenlex.tokenize(N.number(), 'number', 1100)
    basicGenlex.tokenize(C.char('+'), 'plus', 1000)
    basicGenlex.tokenize(C.char('-'), 'minus', 1000)
    basicGenlex.tokenize(C.char('*'), 'mult', 800)
    basicGenlex.tokenize(C.char('/'), 'div', 800)
    basicGenlex.tokenize(C.char('('), 'open', 1000)
    basicGenlex.tokenize(C.char(')'), 'close', 1000)

    return basicGenlex
}

export function leanToken(tokenValue) {
    if (tokenValue === undefined || tokenValue === null) {
        return tokenValue
    }
    if (tokenValue.__token) {
        return tokenValue.value
    }
    return tokenValue
}

export function leanTuple(tuple) {
    if (tuple === undefined || tuple === null) {
        return tuple
    }
    if (isTuple(tuple)) {
        return tuple.map(leanToken).array()
    }
    return tuple
}
