/**
 * Written by Nicolas Zozol
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
    array(): Array<T>
    join(string:string): string;
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
    isConsumed(): boolean
    fold(accept, reject?): Response<T>;
    map<Y>(f): Response<Y>;
    flatMap<Y>(f): Response<Y>;
    filter(f: (value) => boolean): Response<T>;
    //value:T
    offset: number;
}


/* Array with different values*/
export interface ArrayParser<T> extends IParser<T> {
    parse<X>(stream: Stream<X>, index?: number): ArrayResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    then(p: VoidParser): ArrayParser<T>;
    map<Y> (f: (T) => Y): ArrayParser<Y>;
    filter(f: (T) => boolean): ArrayParser<T>
    opt():ArrayParser<Option<T>>;
    or<Y, P extends IParser<Y>>(p: P): ArrayParser<T>|P;
}

/* List with same values ; need bo call array() */
export interface ListParser<T> extends IParser<T>{
    parse<X>(stream: Stream<X>, index?: number): ListResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    then(p: VoidParser): ListParser<T>;
    map<Y> (f: (T) => Y): ListParser<Y>;
    opt():ListParser<Option<T>>;
    //
    or<Y, P extends IParser<Y>>(p: P): ListParser<T>|P;
}

export interface SingleParser<T> extends IParser<T> {
    parse<X>(stream: Stream<X>, index?: number): SingleResponse<T>;
    then<Y>(p: SingleParser<Y>): ArrayParser<T | Y>;
    then<Y>(p: ListParser<Y>): ListParser<T | Y>;
    then(p: VoidParser): SingleParser<T>;
    map<Y> (f: (T) => Y): SingleParser<Y>;

    opt():SingleParser<Option<T>>;
    //filter(f: () => boolean): SingleParser<T>
    or<Y, P extends IParser<Y>>(p: P): SingleParser<T>|P;
}

interface VoidParser extends IParser<void> {
    then<Y>(p: SingleParser<Y>): SingleParser< Y>;
    then<Y>(p: ListParser<Y>): ListParser<Y>;
    opt():VoidParser;
    or<Y, P extends IParser<Y>>(p: P): VoidParser|P;
}

/**
 * T is the type of the Response
 */
export interface IParser<T> {
    // Needed because opt() won(t know if we have void, array or single
    //then<Y>(p: IParser<Y>): IParser<any>;
    map<Y> (f: (T) => Y): IParser<Y>;
    flatMap<Y, P extends IParser<Y>>( builder:parserBuilder<Y,P> ):P;
    drop(): VoidParser;
    rep(): ListParser<T>;
    thenReturns<Y>(obj:Y):SingleParser<Y>;
    debug(s:string, b?:boolean);
    //then<Y>(p: IParser<Y>): IParser<T|Y>;

    /*flatMap<Y> (f: () => Y): IParser<Y>;
     filter(f: (T) => boolean): IParser<T>
     match(value: T): IParser<T>;
     thenReturns<Y>(value: Y): SingleParser<Y>;
     opt(): IParser<T>;
     occurrence(n: number): ListParser<T>;
     optrep(): IParser<List<T>>;
     chain<Y>(): IParser<Y>;
     debug(hint?: string, details?: boolean): IParser<T>;
     */
    // parse<X>(stream: Stream<X>, index?: number): Response<T>;
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
 rep(): ListParser<List<T>> ;
 occurrence(n: number): ListParser<T> ;
 optrep(): IParser<List<T>> ;
 chain<Y>(): IParser<Y> ;
 debug(hint?: string, details?: boolean): IParser<T>;
 parse<X>(stream: Stream<X>, index?: number): Response<T> ;
 }*/


interface CharBundle {
    char(string:string): SingleParser<string>;
    string(string:string): SingleParser<string>;
    stringIn(strings:string[]): SingleParser<string>;
    letter(): SingleParser<string>;
}

export type parserBuilder<Y,P extends IParser<Y>> = (...rest:any[])=>P;

type extension<Y,T extends IParser<Y>> = T;

type predicate<V> = (value: V)=>boolean;

interface FlowBundle {
    parse<Y,P extends IParser<Y>>(P):P;
    nop(): VoidParser;
    try<Y,P extends IParser<Y>>(parser:P):P;
    any():SingleParser<any>;
    subStream(length:number):ListParser<any>
    not<Y,P extends IParser<Y>>(P):SingleParser<any>;
    lazy<Y,P extends IParser<Y>>   (builder: parserBuilder<Y,P>, args:any[]): P;
    returns<T>(value:T):SingleParser<T>;
    error():VoidParser;
    eos(): SingleParser<Unit>;
    satisfy<V>(predicate:predicate<V>):SingleParser<any>
    startWith<V>(value:V):SingleParser<V>;
    moveUntil(s:string):SingleParser<string>;
    moveUntil<Y>(p:IParser<Y>):SingleParser<string>;
    dropTo(s:string):VoidParser;
    dropTo<Y>(p:IParser<Y>):VoidParser;

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