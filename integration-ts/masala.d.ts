/**
 * Written by Nicolas Zozol
 * Inspired by https://github.com/jon-hanson/parsecj
 */

// Not needed
export interface Option<Type>{
    isPresent():boolean;
    map( bindCall: ()=>any ):any;
    flatmap (bindCall: ()=>any): Type;
    filter (f :(value:Type)=>boolean):Type|Option<Type>
    get(): Type
    orElse<X>(v:X): Type|X;
    orLazyElse<X>(v:X): Type|X;

}

export interface Try<V,E>{
    isSuccess(): boolean;
    isFailure(): boolean;
    onSuccess(f : ()=>any):Try<V,E>;
    onFailure(f : ()=>any):Try<V,E>;
    map( bindCall: ()=>any ):Try<V,E>;
    flatmap (bindCall: ()=>any): Try<V,E>;
    success():V;
    failure():E;
    recoverWith<X>(X):V|X;
    lazyRecoverWith<X>(X):V|X;
    filter(f :(value:V)=>boolean):Try<V,E>

}
// Not needed
export interface List<E>{
    size:number;
    isEmpty: boolean;
    array: Array<E>
}



export interface Stream<Data>{
    location(index:number):number;
    get(index:number):Try<Data,void>;
    subStreamAt(index:number, stream:Stream<Data>)

}

export interface StreamFactory{
    ofString(string:string):Stream<string>;
    ofArray<X>():Stream<Array<X>>;
}

export interface Monoid<T>{
    value:T|Array<T>
}

export interface Response<T> extends Monoid<T>{
    isAccepted():boolean
    fold(accept, reject?):Response<T>;
    map(f):Response<T>;
    flatmap(f):Response<T>;
    filter(f:(value)=>boolean):Response<T>;
}

export interface Parser<T>{
    then<Y>(p:Parser<Y>):Parser<T|Y>;
    parse<X>(stream:Stream<X>, index?:number):Response<T>;
    flatmap<Y> (f: ()=>Y): Parser<Y>;
    map<Y> (f: ()=>Y): Parser<Y>;
    filter(f :()=>boolean):Parser<T>
    match(value:T):Parser<T>;
    drop():Parser<void>;
    thenReturns<Y>(value:Y): Parser<Y>;
    or<Y>(p:Parser<Y>):Parser<T|Y>;
    opt():Parser<T>;
    rep():Parser<List<T>>;
    occurrence(n:number):Parser<List<T>>;
    optrep():Parser<List<T>>;
    chain<Y>():Parser<Y>;
    debug(hint?:string, details?:boolean):Parser<T>;
}

export interface Response<T> extends Monoid<T>{
    isAccepted():boolean
    fold(accept, reject?):Response<T>;
    map(f):Response<T>;
    flatmap(f):Response<T>;
    filter(f:(value)=>boolean):Response<T>;
}

export interface CharBundle{}
export interface FlowBundle{}

export interface Bundle{
    Stream:StreamFactory;
    C:CharBundle;
    F:FlowBundle
}

//export default Bundle;