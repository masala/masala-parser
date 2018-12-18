import response from "../parsec/response";
import {F, C, N} from "../parsec";
import unit from "../data/unit";
import option from "../data/option";


export class TokenDefinition {
    // value will be determined at runtime while parsing
    constructor(parser, name, precedence) {
        this.parser = parser;
        this.name = name;
        this.precedence = precedence;
    }
}

// a Token object is instantiated at runtime, with a value given by the parsed text
export class Token {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    accept(name) {
        return this.name === name ? option.some(this.value) : option.none();
    }
}

export class GenLex {

    constructor() {

        this.spaces = defaultSpaces();
        // definitions keep trace of all: parser, precedence and name
        this.definitions = [];
        // get a token, but not directly its precedence
        this.tokensMap = {}
    }


    tokenize(parser, name, precedence = 1000) {

        if (typeof parser === 'string') {
            if (name === undefined) {
                name = parser;
            }
            return this.tokenize(C.string(parser), name, precedence);
        }


        const definition = new TokenDefinition(parser, name, precedence)
        this.definitions.push(definition);

        // probably a bad name
        const token = literal(token => token.accept(name));
        this.tokensMap[name] = token;
        return token;
    }

    keywords(keys, precedence = 1000) {
        return keys.reduce((acc, key) =>
                acc.concat(this.tokenize(key, key, precedence))
            , []);
    }


    setSeparators(spacesCharacters) {
        if (typeof spacesCharacters !== 'string') {
            throw "setSeparators needs a string as separators, such as ' \r\n\f\t' ;" +
            " use  setSeparatorsParser to declare a parser";
        }
        this.spaces = C.charIn(spacesCharacters).optrep().map(() => unit);
    }

    /**
     * Set separator Parser. It's up to the parser to accept or not
     * optional repetition
     * @param spacesParser
     */
    setSeparatorsParser(spacesParser) {
        this.spaces = spacesParser.map(() => unit);
    }

    updatePrecedence(tokenName, precedence) {
        this.definitions.find(def=>def.name === tokenName)
            .precedence = precedence;
    }

    buildTokenizer() {
        const tokens = this.getAllTokenParsers();
        return this.spaces.drop()
            .then(tokens)
            .then(this.spaces.drop())
            .single();
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
        this.definitions = this.definitions
            .filter(d => d.name !== tokenName);
        delete this.tokensMap[tokenName];
    }

    // type: { [key: string]: Parser }
    tokens() {
        return this.tokensMap;
    }

    get(tokenName) {
        return this.tokensMap[tokenName];
    }


}


function getTokenParser(def) {
    return def.parser.map(value => new Token(def.name, value));
}


function literal(tokenize) {

    return F.parse((input, index) => {
            return input
                .get(index)
                // FIXME= value is the token, token is the value
                .map(value => {
                        return tokenize(value)
                            .map(token =>{
                                    //console.log('accept:', token,index, input.location(index));
                                    return response.accept(token, input, index + 1, true)
                            }

                            )
                            .orLazyElse(() =>{

                                   // console.log('reject:',index, input.source.offsets[index],input,'>>>', value,
                                    //  input.location(index));
                                return    response.reject(input, index, false)
                            }

                            )
                    }
                )
                .lazyRecoverWith(() =>{
                        //console.log('lazyRecover with offset:', input.location(index));
                        return response.reject(input, index, false)
                }

                )
        }
    );
}


function defaultSpaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}


export function getMathGenLex() {
    const basicGenlex = new GenLex();

    // We try first to have digits
    basicGenlex.tokenize(N.number(), 'number', 1100);
    basicGenlex.tokenize(C.char('+'), 'plus', 1000);
    basicGenlex.tokenize(C.char('-'), 'minus', 1000);
    basicGenlex.tokenize(C.char('*'), 'mult', 800);
    basicGenlex.tokenize(C.char('/'), 'div', 800);
    basicGenlex.tokenize(C.char('('), 'open', 1000);
    basicGenlex.tokenize(C.char(')'), 'close', 1000);

    return basicGenlex;
}






