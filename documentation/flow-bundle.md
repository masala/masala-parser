Parser Combinator: Flow Bundle
=====



### List

rep() will produce a List of values. You can get the more standard array value by calling `list.array()` 




Lazy
-----


`F.Lazy(parser, [params], self)` is used in case of recursion. Parsers are combined before parsing, 
so immediate recursion is not possible: we need Lazyness().
 
```js

function A(){
    return C.char('A').then(B());
}

function B(){
    return C.char('B').or(F.lazy(A));
}

```
 
Some parameters might be needed. In this case, params must be **packed in an array.

```js
function A(param){
    return C.char(param).then(B());
}

function B(){
    return C.char('B').or(F.lazy(A), ['A']);
}

```


In some case, your parser is a function of a class, and this class must access to `this`.
A third parameter allows you to define who is `this`.

```js
class SomeLazyParser{

    constructor(char){
        this.char = char;
    }

    // first needs to know who is 'this'
    first(){
        return C.char(this.char).then(this.second().opt().map(opt=>opt.orElse('')));
    }

    // Lazy call
    second(){
        return C.char('B').then(F.lazy(this.first, ['A'], this));
    }

}

const combinator = new SomeLazyParser('A').first().then(F.eos().drop());
```






Extraction
---


```js
const line = Streams.ofString('I write until James Bond appears');

const combinator = F.moveUntil(C.string('James'))
    .then(F.dropTo('appears'))
    .then(F.eos().drop());
const value = combinator.parse(line).value;

test.equals(value, 'I write until ');

```




### Repeat Danger

First thing to know: a good solution is to use the Genlex: You will parse a streams of token, and
it will often removes these spaces problem. 

Two parsers with same repeat can causes problems.
Suppose we parse `(x) OR y`, which must be equivalent to `(  x  )   OR  y` 
 
* let say  parenthesis is acceptable for : `    )    ` with any space
* and 'OR' is acceptable for : `    OR    ` with **a least** one space before `OR`

Then `    )    OR    ` will fail because ')' will take `    )    `, leaving the parser at the `OR    `
which needs at least a space before.

So it logically fails, and unfortunately these types of failures are pretty hard to debug.



Moreover repeating an optional repeat can cause never-ending running code: https://github.com/d-plaindoux/masala-parser/issues/81


F.try().or()
----

Masala is a low level library. It's up to you to mix these functions. It's very common for some kind
of job to mix `F.try(x).or(F.try(y)).or(z)`

A useful snippet is this `tryAll` function

```javascript
function tryAll(array){
    if (array.length === 0){
        return F.nop();
    }
    let parser = F.try(array[0]);
    for (let i=1; i < array.length; i++){
        parser  = parser.or(F.try(array[i]));
    }

    return parser;
}
```

