import {
    GenLex,
    IParser,
    MixedParser,
    SingleParser,
    TupleParser,
} from '../masala-parser.js'

export interface Token<T> extends SingleParser<TokenResult<T>> {}

export type TokenCollection = {
    [key: string]: Token<any>
}

export interface TokenResult<T> {
    name: string
    value: T
    __token: true
}

export interface IGenLex {
    // TODO: make overload here
    /**
     *
     * @param parser parser of the token
     * @param name token name
     * @param priority the token with higher numeric priority is tried before others.
     *
     * Choice with grammar is made after token selection !
     */
    tokenize<T, P extends IParser<T>>(
        parser: P,
        name: string,
        priority?: number,
    ): Token<T>

    use<T>(grammar: SingleParser<T>): SingleParser<T>
    use<T>(grammar: TupleParser<T>): TupleParser<T>
    use<First, Last>(
        grammar: MixedParser<First, Last>,
    ): MixedParser<First, Last>
    use<T, P extends IParser<T>>(grammar: P): P

    tokens(): TokenCollection

    setSeparators(spacesCharacters: string): GenLex

    /**
     * Select the parser used by genlex. It will be used as `separator.optrep().then(token).then(separator.optrep())`.
     * So the separator must not be optional or it will make an infinite loop.
     * The separation in your text can't be a strict one-time separation with Genlex.
     * @param parser
     */
    setSeparatorsParser<T>(parser: IParser<any>): GenLex

    /**
     * Should separators be repeated ?
     *
     * `separators.optrep().then(myToken()).then(separators.optrep())`
     * @param repeat default is true
     */
    setSeparatorRepetition(repeat: boolean): GenLex

    /**
     * tokenize all items, given them the name of the token
     * Example: keywords(['AND', 'OR']) will create the tokens named 'AND' and 'OR' with C.string('AND'), C.string('OR)
     * @param tokens
     */
    keywords(tokens: string[]): Array<Token<string>>

    get(tokenName: string): Token<any>
}
