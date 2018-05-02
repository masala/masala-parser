import response from "../parsec/response";
import {F, C, N} from "../parsec";
import unit from "../data/unit";
import option from "../data/option";


class TokenDefinition {
    // value will be determined at runtime while parsing
    constructor(parser, name, precedence) {
        this.parser = parser;
        this.name = name;
        this.precedence = precedence;
    }
}

class Token {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.precedence = 1000;
    }

    // Or for Parser ?
    withPrecedence(precedence) {
        this.precedence = precedence;
        return this;
    }

    accept(name) {
        return this.name === name ? option.some(this.value) : option.none();
    }
}

export class GenLex {

    constructor() {

        this.spaces = defaultSpaces();
        this.definitions = [];
        this.tokensMap = {}
    }

    keyword(keyword, precedence = 500) {
        // create a new token
        return this.tokenize(C.string(keyword), keyword, precedence);
    }

    tokenize(parser, name, precedence = 1000) {

        if(typeof parser ==='string'){
            if (name === undefined){
                name = parser;
            }
            return this.tokenize(C.string(parser), name, precedence);
        }

        const definition = new TokenDefinition(parser, name, precedence)
        this.definitions.push(definition);

        const token = literal(token => token.accept(name));
        this.tokensMap[name] = token;
        return token;
    }


    withSpaces(spacesParser) {
        this.spaces = spacesParser;
    }

    updatePrecedence(tokenName, precedence) {
    }

    buildTokenizer() {
        const tokens = this.getAllTokenParsers();
        return this.spaces.drop()
            .then(tokens)
            .then(this.spaces.drop());
    }

    use(grammar) {
        return this.buildTokenizer().chain(grammar);
    }

    getAllTokenParsers() {
        const sortedDefinitions = this.definitions
            .sort((d1, d2) => d2.precedence - d1.precedence);

        return sortedDefinitions.reduce(
            (combinator, definition) =>
                F.try(getTokenParser(definition)).or(combinator),
            F.error()
        );
    }

    remove(tokenName) {
        // find definitions
        this.definitions=this.definitions
            .filter(d => d.name !== tokenName);
        delete this.tokensMap[tokenName];
    }

    // type: { [key: string]: Parser }
    tokens() {
        return this.tokensMap;
    }

    get(tokenName){
        return this.tokensMap[tokenName];
    }

    clone(){}
}


function getTokenParser(def) {
    return def.parser.map(value => new Token(def.name, value));
}


function literal(tokenize) {

    return F.parse((input, index) => {
            return input
                .get(index)
                .map(value => {
                        return tokenize(value)
                            .map(token =>
                                response.accept(token, input, index + 1, true)
                            )
                            .orLazyElse(() =>
                                response.reject(input.location(index), false)
                            )
                    }
                )
                .lazyRecoverWith(() =>
                    response.reject(input.location(index), false)
                )
        }
    );
}


function defaultSpaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}


export function getBasicGenLex() {
    const basicGenlex = new GenLex();

    // We try first to have digits
    basicGenlex.tokenize(N.digits(), 'digits', 1000);
    basicGenlex.tokenize(N.numberLiteral(), 'number', 1100);

    return basicGenlex;
}

