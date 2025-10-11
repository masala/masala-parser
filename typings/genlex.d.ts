import {
    GenLex,
    IParser,
    MixedParser,
    SingleParser,
    TupleParser,
} from '../masala-parser.js'
import { GenlexTracer, ParsingLog, Tracer } from './debugger.js'

export interface TokenParser<T> extends SingleParser<Token<T>> {}

export type TokenCollection = {
    [key: string]: TokenParser<any>
}

export interface Token<T> {
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
    tokenize(
        keyword: string,
        name: string,
        priority?: number,
    ): TokenParser<string>
    tokenize<T>(
        parser: IParser<T>,
        name: string,
        priority?: number,
    ): TokenParser<T>

    use<T>(grammar: SingleParser<T>): SingleParser<T>
    use<T>(grammar: TupleParser<T>): TupleParser<T>
    use<First, Last>(
        grammar: MixedParser<First, Last>,
    ): MixedParser<First, Last>
    use<T>(grammar: IParser<T>): IParser<T>

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
    keywords(tokens: string[]): Array<TokenParser<string>>

    get(tokenName: string): TokenParser<any>
}

export interface ITracingGenLex extends IGenLex {
    tracer: GenlexTracer
    flush(): ParsingLog[]
    flushForAi(): ParsingLog[]
}
