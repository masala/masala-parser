import type { Tracer } from './typings/debugger.d.ts'
import type { FlowBundle } from './typings/flow-bundle.d.ts'
import type { EmptyTuple, Tuple } from './typings/tuple.d.ts'
import type { VoidParser } from './typings/void-parser.d.ts'
import type {
    IGenLex,
    Token,
    TokenCollection,
    TokenResult,
} from './typings/genlex.d.ts'
import type {
    TupleParser,
    SingleParser,
    EmptyTupleParser,
    MixedParser,
} from './typings/tuple-parser.d.ts'

/**
 * Written by Nicolas Zozol
 */
export interface Unit {}

/**
 * Represents an Option/Optional/Maybe/Either type
 */
export interface Option<T> {
    /**
     * The inner value wrapped by the Option
     */
    value: T

    /**
     * Returns true if value is present
     */
    isPresent(): boolean

    /**
     * Transform the result
     * @param mapper : the map function
     */
    map<Y>(mapper: (t: T) => Y): Option<Y>

    /**
     * The flatmap mapper must returns an option
     * @param bindCall
     */
    flatMap<Y>(bindCall: (y: Y) => Option<Y>): Option<Y>

    filter(f: (value: T) => boolean): T | Option<T>

    /**
     * Returns the inner value when present.
     */
    get(): T

    /**
     * Returns the inner value or another one
     * @param value
     */
    orElse<Y>(value: Y): T | Y

    /**
     * Accepts a provider function called with no params. Will
     * return the inner value when present, or call the provider.
     * @param provider
     */
    orLazyElse<Y>(provider: () => Y): T | Y
}

/**
 * The Try interface allow the parser to recover from a parse failure
 * and try backtacking with another parser using for example `or()`.
 * It accepts a value when success, or an error value when failed
 *
 */
export interface Try<V, E> {
    isSuccess(): boolean

    isFailure(): boolean

    /**
     * Acts like a mapper called only in case of success
     * @param f
     */
    onSuccess<T>(f: (v: V) => void): Try<V, E>

    /**
     * Acts like a mapper called only in case of failure
     * @param f
     */
    onFailure(f: (e: E) => void): Try<V, E>

    /**
     * Transform the success value. If `map()` throws an error,
     * then we have a failure.
     * @param bindCall
     */
    map<T>(bindCall: (v: V) => T): Try<T, E>

    flatMap<T>(bindCall: (v: V) => Try<T, E>): Try<T, E>

    /**
     * Returns the success value
     */
    success(): V

    /**
     * Returns the failure value
     */
    failure(): E

    /**
     * Will provide another value in case of failure
     * @param otherValue
     */
    recoverWith<T>(otherValue: T): V | T

    /**
     * Will call a provider accepting the error as argument when the
     * try as failed, or the success value.
     * @param recoverFunction
     */
    lazyRecoverWith<T>(recoverFunction: (error?: E) => T): V | T

    /**
     * Returns a new Try that will succeed only if first is a success
     * AND is the predicate is accepted on the value
     * @param f
     */
    filter(predicate: (value: V) => boolean): Try<V, E>
}

/**
 * Creates an empty or not Tuple, which is the preferred way
 *
 * `const t = tuple().append(x)`
 *
 * `const t = tuple([2, 4, 5])`;
 */
export function tuple(): EmptyTuple
export function tuple<T>(array: T[]): Tuple<T>

/**
 * Represents a **source** of data that will be parsed.
 * These data are characters with Stream<String> of tokens defined
 * by low-level tokens (if, '{', number, class, function}) with Stream<Parser>.
 * There are two types of Streams: low level where source is a text or an array,
 * and high level where source is composed with another source.
 *
 * A source can be parsed multiple times by various parsers. A
 * `Stream` is supposed to be parsed only once.
 *
 */
export interface Stream<Data> {
    /**
     * For high-level stream, returns the index of the low-level source.
     * For low-level, returns the same value as index.
     * @param index
     */
    location(index: number): number

    /**
     * Return the token at the index.
     * @param index
     */
    get(index: number): Try<Data, void>

    subStreamAt(index: number, stream: Stream<Data>): any
}

/**
 * Data parsed by the parser
 */
interface Streams {
    ofString(string: string): Stream<string>

    ofArray<X>(): Stream<X[]>

    ofParser<T, D>(
        tokenParser: IParser<T>,
        lowerStream: Stream<D>,
    ): Stream<IParser<T>>

    /**
     * Creates a bufferedStream that checks into a cache
     * @param source
     */
    buffered<D>(source: D): Stream<D>
}

/**
 * When a Parser parses a Stream, it produces a Response.
 * This response can be an Accept, or a Reject
 */
export interface Response<T> {
    /**
     * The value built by the parsing
     */
    value: T

    /**
     * Index in the stream. See [[location]].
     */
    offset: number

    /**
     * True if the parser succeed all steps, false if parser stopped
     */
    isAccepted(): boolean

    /**
     * Returns true if parser has reached end of stream to build the Response
     */
    isEos(): boolean

    /**
     * Execute accept if response in an Accept, or reject and create a new
     * Response. A Reject could thus lead to a new Accept
     * @param accept
     * @param reject
     */
    fold(accept: () => Response<T>, reject?: () => Response<T>): Response<T>

    /**
     * Transform the response **in case of** success. Won't touch a Reject.
     * @param f
     */
    map<Y>(f: (v: T, r: this) => Y): Response<Y>

    /**
     * ```js
     * Response.accept('a')
     *      .flatMap(a=>Response.accept(a))
     *      .isAccepted(),
     * ```
     *
     * @param f mapping function
     */
    flatMap<Y>(f: (v: T, r: this) => Response<Y>): Y

    filter(predicate: (value: any) => boolean): Response<T>

    /**
     * Index in the final text. Is equal to
     * [[offset]] for low level parsers.
     */
    location(): number
}

/**
 * Response rejected. Can be transformed in
 * `Accept` using [[fold]]
 */
export interface Reject<T> extends Response<T> {}

export interface Accept<T> extends Response<T> {}

/**
 * Parsers are most of the time made by combination of Parsers given by
 * [[CharBundle]] (**C**), [[NumberBundle]] (**N**), and/or [[FlowBundle]] (**F**).
 * You can also create a custom Parser from scratch.
 * T is the type of the Response
 */
export interface IParser<T> {
    /**
     * Parses a stream of items (usually characters or tokens) and returns a Response
     * @param stream
     * @param index optional, index start in the stream
     */
    parse<D>(stream: Stream<D>, index?: number): Response<T>

    /**
     * Mainly designed for quick debugging or unit tests
     * Parses the text and returns the value, or **undefined** if parsing has failed.
     * @param text text to parse
     */
    val(text: string): T

    /**
     * Creates a sequence of tokens accepted by the parser
     * ```js
     * const abParser = C.char('a').then(C.char('b'))
     * ```
     */
    then<Y>(p: IParser<Y>): TupleParser<T | Y>

    /**
     * Transforms the Response value
     *
     * ```js
     * const parser = N.number().map (n => n*2);
     * const value = parser.parse(Streams.ofString('1')).value;
     * test.equal(value, 2 );
     * ```
     *
     * @param f
     */
    map<Y>(f: (value: T, response: Response<T>) => Y): SingleParser<Y>

    /**
     * Create a new parser value *knowing* the current parsing value
     *
     * ```js
     * // Next char must be the double of the previous
     *   function doubleNumber(param:number){
     *      return C.string(''+ (param*2) );
     *   }
     *
     *  const combinator = N.digit()
     *      .flatMap(doubleNumber);
     *  let response = combinator.parse(Streams.ofString('12'));
     *  assertTrue(response.isAccepted());
     * ```
     *
     * @param builder: the function building the parser
     */
    flatMap<Y, P extends IParser<Y>>(builder: parserBuilder<Y, P>): P

    /**
     * The parser will return the Neutral element for the Tuple
     */
    drop(): VoidParser

    /**
     * Verify that the stream is ended
     */
    thenEos(): this

    /**
     * If accepted, the parser will return the given value
     * @param value
     */
    returns<Y>(value: Y): SingleParser<Y>

    /**
     * Will display debug info when the previous parser is accepted.
     *
     * ```js
     * // 'found digit' will be displayed only if N.digit() has been accepted
     * N.digit().debug('found digit', false);
     * ```
     *
     * @param hint: an indication that the previous parser attempted to parse
     * @param showValue: if true, will display the response value given by the previous parser. true by default.
     */
    debug(hint: string, showValue?: boolean): this

    /**
     * Given an accepted parser and a response value, this parser.filter(predicate) could be rejected depending on
     * the predicate applied on the response value.
     * Filtering a rejected parser will always results in a rejected response.
     * @param predicate : predicate applied on the response value
     */
    filter(predicate: (value: T) => boolean): this

    /**
     * If this parser is not accepted, the other will be used. It's often use with `F.try()` to
     * make backtracking, avoiding some input is definitely eaten.
     * @param other
     */
    or(other: IParser<any>): IParser<any>

    /**
     * If all parsers are accepted, the response value will be a Tuple of these values.
     * It's a rare case where a Tuple could contain a Tuple.
     * Warning: still experimental
     * @param p
     */
    and<P extends IParser<T>>(p: P): TupleParser<T>

    and<Y, P extends IParser<Y>>(p: P): TupleParser<T | Y>

    /**
     * When `parser()` is rejected, then `parser().opt()` is accepted with an empty Option as response value.
     * If `parser()` is accepted with a value `X`, then `parser().opt()` is accepted with an `Option.of(X)`
     */
    opt(): IParser<Option<T>>

    /**
     * Accepted with one or more occurrences.Will produce an Tuple of at least one T
     * The TupleParser don't respect same rule as SingleParser.rep() as tuple is flattened, so any is important here
     */
    rep(): TupleParser<any | T>

    /**
     * Accepted with zero or more occurrences. Will produce a Tuple of zero or more T
     * The TupleParser don't respect same rule as SingleParser.rep() as tuple is flattened, so any is important here
     */
    optrep(): TupleParser<any | T>

    /**
     * Search for next n occurrences. `TupleParser.occurence()`  will continue to build one larger Tuple
     * ```js
     * let parser = C.char('a').then (C.char('b')).occurrence(3);
     * let resp = parser.parse(Streams.ofString('ababab'));
     * // ->  Tuple { value: [ 'a', 'b', 'a', 'b', 'a', 'b' ] } }
     * ```
     * @param n
     */
    occurrence(n: number): TupleParser<T>

    /**
     * Specialized version of [[filter]] using `val` equality as predicate
     * @param val the parser is rejected if it's response value is not `val`
     */
    match(val: T): this

    /**
     * Build a new High Level parser that parses a ParserStream of tokens.
     * Tokens are defined by `this` parser.
     * It's internally used by [[GenLex]] which is more easy to work with
     *
     * @highParser high level parser
     */
    chain<Y, P extends IParser<Y>>(highParser: P): P

    /**
     * Accept the end of stream. If accepted, it will not change the response
     */
    eos(): this

    trace(name: string): this
}

/**
 * A `parseFunction` is a function that returns a parser. To build this parser at runtime, any params are available.
 */
export type parseFunction<X, T> = (
    stream: Stream<X>,
    index?: number,
) => Response<T>

/**
 * Note: the documentation shows two parametric arguments `T` for `Parser<T,T>`, but it's really
 * one argument. Looks like the only tooling bug, but sadly on the first line.
 */
export class Parser<D, T> {
    constructor(f: parseFunction<D, T>)
}

interface CharBundle {
    UTF8_LETTER: symbol
    OCCIDENTAL_LETTER: symbol
    ASCII_LETTER: symbol

    /**
     * Accepts any letter, including one character emoji. Issue on two characters emoji
     */
    utf8Letter(): SingleParser<string>

    /**
     * Accepts any occidental letter, including most accents
     */
    letter(): SingleParser<string>

    /**
     * Choose s in [[UTF8_LETTER]], [[OCCIDENTAL_LETTER]], [[ASCII_LETTER]]
     * Ascii letters are A-Za-z letters, excluding any accent
     * @param s
     */
    letterAs(s: symbol): SingleParser<string>

    /**
     * Accepts a sequence of letters, joined as a string text
     */
    letters(): SingleParser<string>

    /**
     * Sequence of letters, joined as a string text. See [[letterAs]]
     */
    lettersAs(s: symbol): SingleParser<string>

    /**
     * Accepts an emoji
     *
     * WARNING: experimental, help needed; Working on emoji is a full-time specialist job.
     */
    emoji(): SingleParser<string>

    /**
     * Accepts any character that is not the `exclude` character
     * @param exclude one character exclude
     */
    notChar(exclude: string): SingleParser<string>

    /**
     * Accepts any character that is not listed in the `exclude` chain
     * @param exclude excluded characters
     *
     * WARNING: might be issues on emoji
     */
    charNotIn(exclude: string): SingleParser<string>

    /**
     * Accepts a char
     * @param c
     */
    char(c: string): SingleParser<string>

    /**
     * Accepts any char listed in
     * @param strings
     */
    charIn(strings: string): SingleParser<string>

    /**
     * Accepts a string
     * @param string
     */
    string(string: string): SingleParser<string>

    /**
     * Accept one of these strings
     * @param strings
     */
    stringIn(strings: string[]): SingleParser<string>

    /**
     * Accept anything that is not this string. Useful to build *stop*. See also [[FlowBundle.moveUntil]],
     * [[FlowBundle.dropTo]]
     * @param string
     */
    notString(string: string): SingleParser<string>

    /**
     * Single character inside single quote, like C/Java characters: `'a'`, `'x'`
     */
    charLiteral(): SingleParser<string>

    /**
     * String characters inside double quotes, like Java strings : `"Hello"`, `"World"`
     */
    stringLiteral(): SingleParser<string>

    /**
     * a-z single letter. WARNING: doesn't work yet on accents or utf-8 characters
     */
    lowerCase(): SingleParser<string>

    /**
     * A-Z single letter. WARNING: doesn't work yet on accents or utf-8 characters
     */
    upperCase(): SingleParser<string>

    inRegexRange(range: string): SingleParser<string>
}

export type parserBuilder<Y, P extends IParser<Y>> = (...rest: any[]) => P

type extension<Y, T extends IParser<Y>> = T

export type Predicate<V> = (value: V) => boolean

interface NumberBundle {
    number(): SingleParser<number>

    integer(): SingleParser<number>

    digit(): SingleParser<number>

    digits(): SingleParser<number>
}

type ParserOrString<T> = IParser<T> | string

export declare const F: FlowBundle
export declare const C: CharBundle
export declare const N: NumberBundle
export declare const Streams: Streams

export declare const GenLex: new () => IGenLex
export declare const TracingGenLex: new (tracer?: Tracer) => IGenLex

export type { Token, TokenCollection, TokenResult }
export type { EmptyTuple, Tuple }
export type {
    VoidParser,
    TupleParser,
    SingleParser,
    EmptyTupleParser,
    MixedParser,
}

/* Debugger */
interface TracerOptions {
    window?: number[]
    includeValues?: boolean
    includeRejects?: boolean
    snippet?: boolean
    snippetMax?: number
}
export declare function createTracer(options?: TracerOptions): Tracer
