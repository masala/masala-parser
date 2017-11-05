


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