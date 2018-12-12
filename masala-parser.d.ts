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

// Warning: Very limited work!
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



export interface Response<T> {

    value:T;
    isAccepted(): boolean
    isConsumed(): boolean
    fold(accept, reject?): Response<T>;
    map<Y>(f): Response<Y>;
    flatMap<Y>(f): Response<Y>;
    filter(f: (value) => boolean): Response<T>;
    offset: number;
    location():number;
}


/* Array with different values*/
export interface ListParser<T> extends IParser<List<T>> {

    then<Y>(p: SingleParser<Y>): ListParser<T | Y>;
    array():SingleParser<T[]>
    optrep():ListParser<T>;
    rep(): ListParser<T>;
    single(): SingleParser<T>;
    last(): SingleParser<T>;
}

// Almost not a special case, but easier to write
export interface VoidParser extends SingleParser<void>{
    then<Y>(p: IParser<Y>): ListParser<Y>;
}

export interface SingleParser<T> extends IParser<List<T>> {

    then<Y>(p: IParser<Y>): ListParser<T | Y>;

    optrep():ListParser<T>;
    rep(): ListParser<T>;
}



/**
 * T is the type of the Response
 * Should use F-bounded polymorphism
 */
export interface IParser<T> {
    parse<X>(stream: Stream<X>, index?: number): Response<T>;

    map<Y> (f: (T) => Y): SingleParser<Y>;
    flatMap<Y, P extends IParser<Y>>( builder:parserBuilder<Y,P> ):P;
    opt():IParser<Option<T>>

    drop(): IParser<void>;

    returns<Y>(value:Y):SingleParser<Y>;
    debug(s:string, b?:boolean):this;

    thenEos():ListParser<T>;

    or<Y, P extends IParser<Y>>(p: P): IParser<T>|P;

    filter(f: (T) => boolean): this
    //TODO: list or array ?
    occurrence(n: number): ListParser<T>;
    /*
     match(value: T): IParser<T>;
     occurrence(n: number): ListParser<T>;

     chain<Y>(): IParser<Y>;
     */
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
    UTF8_LETTER:symbol,
    OCCIDENTAL_LETTER:symbol,
    ASCII_LETTER:symbol,
    utf8Letter():SingleParser<string>;
    letter(): SingleParser<string>;
    letterAs(s:symbol): SingleParser<string>;
    letters(): SingleParser<string>;
    lettersAs(s:symbol): SingleParser<string>;
    emoji(): SingleParser<string>;
    notChar(c:string): SingleParser<string>;
    char(string:string): SingleParser<string>;
    charIn(strings:string): SingleParser<string>;
    string(string:string): SingleParser<string>;
    stringIn(strings:string[]): SingleParser<string>;
    notString(string:string): SingleParser<string>;
    charLiteral(): SingleParser<string>;
    stringLiteral(): SingleParser<string>;
    lowerCase(): SingleParser<string>;
    upperCase(): SingleParser<string>;

}

type parserBuilder<Y,P extends IParser<Y>> = (...rest:any[])=>P;

type extension<Y,T extends IParser<Y>> = T;

type Predicate<V> = (value: V)=>boolean;

interface FlowBundle {
    parse<Y,P extends IParser<Y>>(parser:P):P;
    nop(): VoidParser;
    try<Y,P extends IParser<Y>>(parser:P):P;
    any():SingleParser<any>;
    subStream(length:number):VoidParser;
    not<Y,P extends IParser<Y>>(P):SingleParser<any>;
    lazy<Y,P extends IParser<Y>>   (builder: parserBuilder<Y,P>, args?:any[]): P;
    returns<T>(value:T):SingleParser<T>;
    error():VoidParser;
    eos(): SingleParser<Unit>;
    satisfy<V>(predicate:Predicate<V>):SingleParser<any>
    startWith<V>(value:V):SingleParser<V>;
    moveUntil(s:string):VoidParser;
    moveUntil<Y>(p:IParser<Y>):VoidParser;
    dropTo(s:string):VoidParser;
    dropTo<Y>(p:IParser<Y>):VoidParser;

}

interface NumberBundle {
    number(): SingleParser<number>;
    numberLiteral(): SingleParser<number>;
    digit(): SingleParser<string>;
    digits(): SingleParser<string>;
}

export declare const F: FlowBundle;
export declare const C: CharBundle;
export declare const N: NumberBundle;
export declare const Streams: IStreams;

/*
// TODO: Check if this is needed
interface MasalaBundlesStatic {
    Streams: IStreams,
    C: CharBundle,
    F: FlowBundle,
    N: NumberBundle
}


declare const MasalaBundles: MasalaBundlesStatic;
export default MasalaBundles;
*/