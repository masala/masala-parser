/**
 * Written by Nicolas Zozol
 * Inspired by https://github.com/jon-hanson/parsecj
 */

// Not needed
export interface Option<Type> {
    isPresent(): boolean;
    map(bindCall: () => any): any;
    flatmap (bindCall: () => any): Type;
    filter (f: (value: Type) => boolean): Type | Option<Type>
    get(): Type
    orElse<X>(v: X): Type | X;
    orLazyElse<X>(v: X): Type | X;

}

export interface Try<V, E> {
    isSuccess(): boolean;
    isFailure(): boolean;
    onSuccess(f: () => any): Try<V, E>;
    onFailure(f: () => any): Try<V, E>;
    map(bindCall: () => any): Try<V, E>;
    flatmap (bindCall: () => any): Try<V, E>;
    success(): V;
    failure(): E;
    recoverWith<X>(X): V | X;
    lazyRecoverWith<X>(X): V | X;
    filter(f: (value: V) => boolean): Try<V, E>

}
// Not needed
export interface List<T> {
    size: number;
    isEmpty: boolean;
    array: Array<T>
}


export interface Stream<Data> {
    location(index: number): number;
    get(index: number): Try<Data, void>;
    subStreamAt(index: number, stream: Stream<Data>)

}

export interface StreamFactory {
    ofString(string: string): Stream<string>;
    ofArray<X>(): Stream<Array<X>>;
}


export interface ArrayResponse<T> extends Response<T> {
    value: Array<T>
}

export interface ListResponse<T> extends Response<T> {
    value: List<T>
}

export interface OptionResponse<T> extends Response<T> {
    value: Option<T>
}


export interface SingleResponse<T> extends Response<T> {
    value: T
}

export interface VoidResponse<T>extends Response<T> {
    value: void
}

export interface Response<T> {
    isAccepted(): boolean
    fold(accept, reject?): Response<T>;
    map<Y>(f): Response<Y>;
    flatmap<Y>(f): Response<Y>;
    filter(f: (value) => boolean): Response<T>;
    //value:any
}

/* Array with different values*/
export interface ArrayParser<T> extends Parser<T> {
    parse<X>(stream: Stream<X>, index?: number): ArrayResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    map<Y> (f: (T) => Y): ArrayParser<T>;
    flatmap<Z> (f: () => Z): ArrayParser<T>;
    filter(f: (T) => boolean): ArrayParser<T>
}

/* List with same values ; need bo call array() */
export interface ListParser<T> {
    parse<X>(stream: Stream<X>, index?: number): Response<List<T>>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
}

interface SingleParser<T> extends Parser<T> {
    parse<X>(stream: Stream<X>, index?: number): SingleResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    map<Y> (f: () => Y): SingleParser<Y>;
    filter(f: () => boolean): SingleParser<T>
}

interface VoidParser extends Parser<void> {
    then<Y>(p: Parser<Y>): SingleParser<Y>;
}

interface Parser<T> {
    // Needed because opt() won(t know if we have void, array or single
    then<Y>(p:Parser<Y>):Parser<any>;
    flatmap<Y> (f: () => Y): Parser<Y>;
    map<Y> (f: (T) => Y): Parser<Y>;
    filter(f: (T) => boolean): Parser<T>
    match(value: T): Parser<T>;
    drop(): VoidParser;
    thenReturns<Y>(value: Y): SingleParser<Y>;
    or<Y>(p: Parser<Y>): Parser<T | Y>;
    opt(): Parser<T>;
    rep(): ListParser<List<T>>;
    occurrence(n: number): ListParser<T>;
    optrep(): Parser<List<T>>;
    chain<Y>(): Parser<Y>;
    debug(hint?: string, details?: boolean): Parser<T>;
    parse<X>(stream: Stream<X>, index?: number): Response<T>;
}

export interface Response<T> {
    isAccepted(): boolean
    fold(accept, reject?): Response<T>;
    map(f): Response<T>;
    flatmap(f): Response<T>;
    filter(f: (value) => boolean): Response<T>;
}

export interface CharBundle {
    char(string):SingleParser<string>;
}
export interface FlowBundle {
}

export interface NumberBundle {
}

declare const MasalaBundles : {
    Stream?: StreamFactory,
    C?: CharBundle,
    F?: FlowBundle,
    N?:NumberBundle,
};

export default MasalaBundles;