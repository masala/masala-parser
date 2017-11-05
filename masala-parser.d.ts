/**
 * Written by Nicolas Zozol
 * Inspired by https://github.com/jon-hanson/parsecj
 */

export interface Unit {}

// Not needed
export interface Option<Type> {
    isPresent(): boolean;
    map(bindCall: () => any): any;
    flatMap (bindCall: () => any): Type;
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
    flatMap (bindCall: () => any): Try<V, E>;
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

interface IStreams {
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
    flatMap<Y>(f): Response<Y>;
    filter(f: (value) => boolean): Response<T>;
    //value:any
}

/* Array with different values*/
export interface ArrayParser<T> extends IParser<T> {
    parse<X>(stream: Stream<X>, index?: number): ArrayResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    then(p: VoidParser): ArrayParser<T>;
    map<Y> (f: (T) => Y): ArrayParser<Y>;
    flatMap<Z> (f: () => Z): ArrayParser<T>;
    filter(f: (T) => boolean): ArrayParser<T>
}

/* List with same values ; need bo call array() */
export interface ListParser<T> {
    parse<X>(stream: Stream<X>, index?: number): Response<List<T>>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
}

interface SingleParser<T> extends IParser<T> {
    parse<X>(stream: Stream<X>, index?: number): SingleResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    then(p: VoidParser): SingleParser<T>;
    map<Y> (f: (T) => Y): SingleParser<Y>;
    //filter(f: () => boolean): SingleParser<T>
}

interface VoidParser extends IParser<void> {
    then<Y>(p: IParser<Y>): SingleParser<Y>;
}

/**
 * T is the type of the Response
 */
export interface IParser<T> {
    // Needed because opt() won(t know if we have void, array or single
    //then<Y>(p: IParser<Y>): IParser<any>;
    map<Y> (f: (T) => Y): IParser<Y>;
    drop(): VoidParser;
    /*flatMap<Y> (f: () => Y): IParser<Y>;
     filter(f: (T) => boolean): IParser<T>
     match(value: T): IParser<T>;
     thenReturns<Y>(value: Y): SingleParser<Y>;
     or<Y>(p: IParser<Y>): IParser<T | Y>;
     opt(): IParser<T>;
     rep(): ListParser<List<T>>;
     occurrence(n: number): ListParser<T>;
     optrep(): IParser<List<T>>;
     chain<Y>(): IParser<Y>;
     debug(hint?: string, details?: boolean): IParser<T>;
     */
    // parse<X>(stream: Stream<X>, index?: number): Response<T>;
}

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
    rep(): ListParser<List<T>> ;
    occurrence(n: number): ListParser<T> ;
    optrep(): IParser<List<T>> ;
    chain<Y>(): IParser<Y> ;
    debug(hint?: string, details?: boolean): IParser<T>;
    parse<X>(stream: Stream<X>, index?: number): Response<T> ;
}

export interface Response<T> {
    isAccepted(): boolean
    fold(accept, reject?): Response<T>;
    map(f): Response<T>;
    flatMap(f): Response<T>;
    filter(f: (value) => boolean): Response<T>;
}

interface CharBundle {
    char(string): SingleParser<string>;
}

interface FlowBundle {
    nop: () => void;
    eos: SingleParser<Unit>;
}

interface NumberBundle {
    number: SingleParser<number>;
    numberLiteral: SingleParser<number>;
}

export declare const F: FlowBundle;
export declare const C: CharBundle;
export declare const N: NumberBundle;
export declare const Streams: IStreams;


// TODO: Check if this is needed
interface MasalaBundlesStatic {
    Streams: IStreams,
    C: CharBundle,
    F: FlowBundle,
    N: NumberBundle
}


declare const MasalaBundles: MasalaBundlesStatic;
export default MasalaBundles;