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
    get():Data;
    subStreamAt(index:number, stream:Stream<Data>)

}

export interface Parser{
    flatmap (f: ()=>any): Parser;
    map (f: ()=>any): Parser;
    filter(f :()=>boolean):Parser
    match(value:any):Parser;
    then(p:Parser):Parser;
    concat: Parser;
    drop:Parser;
    thenLeft: Parser;
    thenRight:Parser;
    thenReturns(value:any): Parser;
    or(p:Parser):Parser;
    opt():Parser;
    rep():Parser;
    occurrence(n:number):Parser;
    optrep():Parser;
    chain():Parser;
    debug(hint?:string, details?:boolean);
    parse(stream:Stream<any>, index:number):Response;
}

export interface Response{
    isAccepted():boolean
    fold(accept, reject?):Response;
    map(f):Response;
    flatmap(f):Response;
    filter(f:(value)=>boolean):Response;
}