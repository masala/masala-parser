/**
 * Written by Nicolas Zozol
 */
export interface Unit {
}


/**
 * Represents an Option/Optional/Maybe/Either type
 */
export interface Option<T> {

    /**
     * The inner value wrapped by the Option
     */
    value: T;


    /**
     * Returns true if value is present
     */
    isPresent(): boolean;

    /**
     * Transform the result
     * @param mapper : the map function
     */
    map<Y>(mapper: (t: T) => Y): Option<Y>;

    /**
     * The flatmap mapper must returns an option
     * @param bindCall
     */
    flatMap<Y>(bindCall: (y: Y) => Option<Y>): Option<Y>;

    filter(f: (value: T) => boolean): T | Option<T>

    /**
     * Returns the inner value when present.
     */
    get(): T

    /**
     * Returns the inner value or another one
     * @param value
     */
    orElse<Y>(value: Y): T | Y;

    /**
     * Accepts a provider function called with no params. Will
     * return the inner value when present, or call the provider.
     * @param provider
     */
    orLazyElse<Y>(provider: () => Y): T | Y;

}

/**
 * The Try interface allow the parser to recover from a parse failure
 * and try backtacking with another parser using for example `or()`.
 * It accepts a value when success, or an error value when failed
 *
 */
export interface Try<V, E> {
    isSuccess(): boolean;

    isFailure(): boolean

    /**
     * Acts like a mapper called only in case of success
     * @param f
     */
    onSuccess<T>(f: (v: V) => void): Try<V, E>;

    /**
     * Acts like a mapper called only in case of failure
     * @param f
     */
    onFailure(f: (e: E) => void): Try<V, E>;

    /**
     * Transform the success value. If `map()` throws an error,
     * then we have a failure.
     * @param bindCall
     */
    map<T>(bindCall: (v: V) => T): Try<T, E>;

    flatMap<T>(bindCall: (v: V) => Try<T, E>): Try<T, E>;

    /**
     * Returns the success value
     */
    success(): V;

    /**
     * Returns the failure value
     */
    failure(): E;

    /**
     * Will provide another value in case of failure
     * @param otherValue
     */
    recoverWith<T>(otherValue: T): V | T;

    /**
     * Will call a provider accepting the error as argument when the
     * try as failed, or the success value.
     * @param recoverFunction
     */
    lazyRecoverWith<T>(recoverFunction: (error?: E) => T): V | T;

    /**
     * Returns a new Try that will succeed only if first is a success
     * AND is the predicate is accepted on the value
     * @param f
     */
    filter(predicate: (value: V) => boolean): Try<V, E>

}

export declare type NEUTRAL = symbol;

/**
 * Represents the sequence of tokens found by the parser.
 * A Tuple accepts a `NEUTRAL` element
 */
export interface Tuple<T> {
    size: number;
    isEmpty: boolean;

    /**
     * Returns the first token. It's up to the coder to know
     * if there is only one token
     *  * ```js
     *  const parser = C.char('a')
     *      .then(C.char('b'))
     *      .drop()
     *      .then(C.char('c')
     *      .single(); // Parsing will return 'c'
     * ```
     * See [[array]]
     */
    single(): T;

    /**
     * Returns all tokens in an array
     * ```js
     *  const parser = C.char('a')
     *      .then(C.char('b'))
     *      .then(C.char('c')
     *      .array(); // Parsing will return ['a','b','c']
     * ```
     * See [[single]]
     */
    array(): Array<T>

    join(string: string): string;

    /**
     * The tuple will not change with the NEUTRAL element.
     * It will concatenate the two tuples as one, or add
     * a single element if it's not a Tuple.
     * Therefore a Tuple can wrap multiple arrays.
     * @param neutral : neutral element
     *
     * See [[TupleParser]]
     */
    append(neutral: NEUTRAL): this;

    append<Y>(other: Tuple<Y>): Tuple<T | Y>;

    append<Y>(element: Y): Tuple<T | Y>;

}

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
    location(index: number): number;

    /**
     * Return the token at the index.
     * @param index
     */
    get(index: number): Try<Data, void>;

    subStreamAt(index: number, stream: Stream<Data>)

}

/**
 * Data parsed by the parser
 */
interface Streams {
    ofString(string: string): Stream<string>;

    ofArray<X>(): Stream<Array<X>>;

    ofParser<T, D>(tokenParser: IParser<T>, lowerStream: Stream<D>): Stream<IParser<T>>;

    /**
     * Creates a bufferedStream that checks into a cache
     * @param source
     */
    buffered<D>(source: D): Stream<D>;
}

/**
 * When a Parser parses a Stream, it produces a Response.
 * This response can be an Accept, or a Reject
 */
export interface Response<T> {

    /**
     * The value built by the parsing
     */
    value: T;

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
    fold(accept:()=>Response<T>, reject?:()=>Response<T>): Response<T>;

    /**
     * Transform the response **in case of** success. Won't touch a Reject.
     * @param f
     */
    map<Y>(f:(v:T)=>Y): Response<Y>;

    /**
     * ```js
     * Response.accept('a')
     *      .flatMap(a=>Response.accept(a))
     *      .isAccepted(),
     * ```
     *
     * @param f mapping function
     */
    flatMap<Y>(f:(v:T)=>Response<Y>): Response<Y>;

    filter(predicate: (value) => boolean): Response<T>;

    /**
     * Index in the stream. See [[location]].
     */
    offset: number;

    /**
     * Index in the final text. Is equal to
     * [[offset]] for low level parsers.
     */
    location(): number;
}

/**
 * Response rejected. Can be transformed in
 * `Accept` using [[fold]]
 */
export interface Reject<T> extends Response<T>{

}

export interface Accept<T> extends Response<T>{

}


/* Array with different values*/
export interface TupleParser<T> extends IParser<Tuple<T>> {

    /**
     * Combine two parsers for reading the stream
     * ```js
     * const parser = C.char('a')
     *   .then(C.char('b')) // first TupleParser
     *   .then(C.char('c'));
     * const value = parser.parse(Streams.ofString('abc')).value;
     * test.deepEqual(value, new Tuple(['a','b','c']));
     * ```
     * @param p next parser
     */
    then<Y>(p: IParser<Y>): TupleParser<T | Y>;
    then(p: VoidParser): TupleParser<T>;

    /**
     * Map the response value as an array
     * ```js
     * const parser = C.char('a')
     *   .then(C.char('b'))
     *   .array();
     * const value = parser.parse(Streams.ofString('abcd')).value;
     * test.deepEqual(value, ['a','b']); // parsing stopped at index 2
     * ```
     *
     */
    array(): SingleParser<T[]>


    /**
     * Map the response value as the first Tuple element
     * ```js
     * const parser = C.char('a')
     *    // 'b' is dropped, but we still have a Tuple
     *   .then(C.char('b').drop())
     *   .single();
     * const value = parser.parse(Streams.ofString('ab')).value;
     * test.equal(value, 'a');
     * ```
     *
     */
    single(): SingleParser<T>;

    /**
     * Map the response value as the last value
     * ```js
     * const parser = C.char('a')
     *   .then(C.char('b'))
     *   .then(C.char('c'))
     *   .last();
     * const value = parser.parse(Streams.ofString('abc')).value;
     * test.deepEqual(value, ['a','b']); // parsing stopped at index 2
     * ```
     *
     */
    last(): SingleParser<T>;
}

declare type MASALA_VOID_TYPE = symbol;

/**
 * Special case of a [[SingleParser]], but easier to write.
 * Note that `VoidParser.then(VoidParser)` will produce a [[TupleParser]] where
 * inner value is `[]`. Same result with `optrep()` and `rep()`
 */
export interface VoidParser extends SingleParser<any> {

    /**
     * Combine two parsers for reading the stream
     * ```js
     * const parser = C.char('a').drop()
     *   .then(C.char('b').drop());
     *   const value = parser.parse(Streams.ofString('ab')).value;
     *   test.ok(value.size() === 0 );
     * ```
     * @param p next parser
     */
    then<Y>(p: IParser<Y>): TupleParser<Y>;
    then(p: VoidParser): TupleParser<any>;

    /**
     * Accepted with zero or more occurrences. Will produce an empty Tuple
     */
    optrep(): TupleParser<any[]>;

    /**
     * Accepted with one or more occurrences.Will produce an empty Tuple
     */
    rep(): TupleParser<any[]>;
}

export interface SingleParser<T> extends IParser<T> {

    /**
     * Combine two parsers for reading the stream
     * ```js
     * const parser = C.char('a')
     *   .then(C.char('b'));
     *   const value = parser.parse(Streams.ofString('ab')).value;
     *   test.equal(value.size(), 2 );
     * ```
     * @param p next parser
     */
    then(p: VoidParser): TupleParser<T>;
    then<Y>(p: IParser<Y>): TupleParser<T | Y>;

}


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
    parse<D>(stream: Stream<D>, index?: number): Response<T>;

    /**
     * Creates a sequence of tokens accepted by the parser
     * ```js
     * const abParser = C.char('a').then(C.char('b'))
     * ```
     * @param p
     */
    then(p: VoidParser): TupleParser<T>;

    map<Y>(f: (T) => Y): SingleParser<Y>;

    flatMap<Y, P extends IParser<Y>>(builder: parserBuilder<Y, P>): P;


    drop(): VoidParser;

    returns<Y>(value: Y): SingleParser<Y>;

    debug(s: string, b?: boolean): this;

    filter(f: (T) => boolean): this

    thenEos(): TupleParser<T>;

    or<Y, P extends IParser<Y>>(p: P): this | P;

    and<Y, P extends IParser<Y>>(p: P): this | P;

    opt(): IParser<Option<T>>

    //TODO: Tuple or array ?
    occurrence(n: number): TupleParser<T>;

    /*
     match(value: T): IParser<T>;
     occurrence(n: number): TupleParser<T>;

     chain<Y>(): IParser<Y>;
     */
}

type parseFunction<X,T> = (stream: Stream<X>, index?: number)=> Response<T>;
interface Parser<T> extends IParser<T>{

}
export class Parser<T>{
    new<D> (f:parseFunction<D,T>);
}

/*
 export declare class Parser<T> implements IParser <T> {

 then<Y>(p: IParser<Y>): IParser<any>;
 flatMap<Y>(f: () => Y): IParser<Y> ;
 map<Y>(f: (T: any) => Y): IParser<Y>;
 filter(f: (T: any) => boolean): IParser<T> ;
 match(value: T): IParser<T> ;
 drop(): VoidParser ;
 thenReturns<Y>(value: Y): SingleParser<Y> ;
 or<Y>(p: IParser<Y>): IParser<T | Y> ;
 opt(): IParser<T> ;
 rep(): TupleParser<Tuple<T>> ;
 occurrence(n: number): TupleParser<T> ;
 optrep(): IParser<Tuple<T>> ;
 chain<Y>(): IParser<Y> ;
 debug(hint?: string, details?: boolean): IParser<T>;
 parse<X>(stream: Stream<X>, index?: number): Response<T> ;
 }*/


interface CharBundle {
    UTF8_LETTER: symbol,
    OCCIDENTAL_LETTER: symbol,
    ASCII_LETTER: symbol,

    utf8Letter(): SingleParser<string>;

    letter(): SingleParser<string>;

    letterAs(s: symbol): SingleParser<string>;

    letters(): SingleParser<string>;

    lettersAs(s: symbol): SingleParser<string>;

    emoji(): SingleParser<string>;

    notChar(c: string): SingleParser<string>;

    char(string: string): SingleParser<string>;

    charIn(strings: string): SingleParser<string>;

    string(string: string): SingleParser<string>;

    stringIn(strings: string[]): SingleParser<string>;

    notString(string: string): SingleParser<string>;

    charLiteral(): SingleParser<string>;

    stringLiteral(): SingleParser<string>;

    lowerCase(): SingleParser<string>;

    upperCase(): SingleParser<string>;

}

type parserBuilder<Y, P extends IParser<Y>> = (...rest: any[]) => P;

type extension<Y, T extends IParser<Y>> = T;

type Predicate<V> = (value: V) => boolean;

interface FlowBundle {
    parse<Y, P extends IParser<Y>>(parser: P): P;

    nop(): VoidParser;

    layer<Y>(parser: IParser<Y>): IParser<Y>;

    try<Y, P extends IParser<Y>>(parser: P): P;

    any(): SingleParser<any>;

    subStream(length: number): VoidParser;

    not<Y, P extends IParser<Y>>(P): SingleParser<any>;

    lazy<Y, P extends IParser<Y>>(builder: parserBuilder<Y, P>, args?: any[]): P;

    returns<T>(value: T): SingleParser<T>;

    error(): VoidParser;

    eos(): SingleParser<Unit>;

    satisfy<V>(predicate: Predicate<V>): SingleParser<any>

    startWith<V>(value: V): SingleParser<V>;

    moveUntil(s: string): VoidParser;

    moveUntil<Y>(p: IParser<Y>): VoidParser;

    dropTo(s: string): VoidParser;

    dropTo<Y>(p: IParser<Y>): VoidParser;

}

interface NumberBundle {
    number(): SingleParser<number>;

    integer(): SingleParser<number>;

    digit(): SingleParser<number>;

    digits(): SingleParser<number>;
}

type ParserOrString<T> = IParser<T> | string;

interface Token<T> extends SingleParser<T> {

}

type TokenCollection = {
    [key: string]: Token<any>
}

interface GenLex {
    tokenize<T>(parser: ParserOrString<T>, name: string, precedence?: number): Token<T>;

    use<T>(grammar: IParser<T>): IParser<T>;

    tokens(): TokenCollection;
}


export declare const F: FlowBundle;
export declare const C: CharBundle;
export declare const N: NumberBundle;
export declare const Streams: Streams;
