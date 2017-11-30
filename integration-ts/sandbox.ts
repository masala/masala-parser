


interface IParent{

    add(x:number|string, y:number|string):number|string;

}


class Parent implements IParent{
    add(x: number, y: number): number{

        if (typeof x ==='number' && typeof y === 'number'){
            return x+y;
        }
    }
}


interface Y {
    doStuff():A;
}

class Z implements Y{
    doStuff():B{return new B()}
}

class A {
    stuff(){return 3;}
}

class B extends A{
    stuff(){return 5;}
}



export class Option<T> {
    value:T;
    constructor(x:T){
        this.value = x;
    }
    get(){return this.value}

    orElse(v: T){
        return this.value || v;
    }
}

class Parser<T>{
    value: T

    constructor(x:T){
        this.value = x;
    }

    map<Y>( func: (x:T)=>Y ){
        return func(this.value);
    }
}

const option = new Option(['a', 'b', 'c']);

new Parser(option).map(x => x.orElse(['a'])[0].charAt(1));








