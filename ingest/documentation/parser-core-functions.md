Parser Object :
=====

* It reads a stream of characters
    - The parser has functions to validate the stream
    - You can build your Parser by adding specific functions
* The Parser is a monoid
    - It wraps one (and only one) **value**
    - It has some functions to work on that value



## Streaming inputs

* The Parser is constructed with a Streaming function
* The Parser will consume **elements** form the stream
* The stream will stop if the Parser can't match the next element
    - state of the Parser will be `Rejected`
* If the Stream finishes, state of the Parser is `Accepted` 
* Once a **element** is **consumed**, the Parser can't go back
    - this allows speed and above all low memory use 



## Parser constructor
 
Usually, you would **NOT** create a Parser from its constructor. You will combine **existing parsers** to create a
 new one. However it can solve specific problems when combining existing parser is too difficult or not efficient. 
 
```js
    const newParser = new Parser(parseFunction);
    // But don't do that, except if you know what you are doing
```
 
* difficulty : 3
* construct a Parser object
* `parseFunction` is a streaming function
    - reads characters at a given index
    - can end the stream
* the `parseFunction` function will determine the behaviour of the Parser


Here is an example of a home-made parser for going back after an Accept: [https://github.com/d-plaindoux/masala-parser/issues/138#issuecomment-49162720 5]

# Essential Parser functions

### then

* Construct a Tuple of values from previous accepted values

```js

let stream = Streams.ofString('abc');
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos().drop()); // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream);
assertEquals(parsing.value, 'abc');
```        

### drop()

* difficulty : 1
* Uses `then()` and returns only the left or right value

```js
const stream = Streams.ofString('|4.6|');
const floorCombinator = C.char('|').drop()
    .then(N.number())    // we have ['|',4.6], we keep 4.6
    .then(C.char('|').drop())   // we have [4.6, '|'], we keep 4.6
    .map(x =>Math.floor(x));

// Masala needs a stream of characters
const parsing = floorCombinator.parse(stream);
assertEquals( 4, parsing.value, 'Floor parsing');
```     

`then()` and `drop()` will often be used to find the right value in your data.
 
 

### map(f)

* difficulty : 0
* Change the value of the response


```js
const stream = Streams.ofString("5x8");
const combinator = N.integer()
                    .then(C.charIn('x*').drop())
                    .then(N.integer())
                    // values are [5,8] : we map to its multiplication
                    .map(values => values[0] * values[1]);
assertEquals(combinator.parse(stream).value, 40)
```

### returns(value)

* difficulty : 1
* Forces the value at a given point
* It's a simplification of map

        
```js
const stream = Streams.ofString("ab");
// given 'ac', value should be ['X' , 'c']
const combinator = C.char('a')
                    .thenReturns('X')
                    .then(C.char('b')); 
assertEquals(combinator.parse(stream).value, ['X', 'b'])
```

It could be done using `map()`:

```js
const combinator = C.char('a')
                    .map(anyVal => 'X')
                    .then(C.char('c'));
```
        


### eos()

* difficulty : 1
* Test if the stream reaches the end of the stream




### any()

* difficulty : 0
* next character will always work
* consumes a character

TODO : There is no explicit test for `any()` 


### opt()

* difficulty : 0
* Allows optional use of a Parser 
* Internally used for `optrep()` function

```js
        const P = parser;
        // ok for 'ac' but also 'abc'    
        C.char('a').opt( C.char('b') ).char('c')
```

### rep()

* difficulty : 0
* Ensure a parser is repeated **at least** one time

```js

const stream = Streams.ofString('aaa');
const parsing = C.char('a').rep().parse(stream);
test.ok(parsing.isAccepted());
// We need to call list.array()
test.deepEqual(parsing.value.array(),['a', 'a', 'a']);

```

`rep()` will produce a `List` of values. You can get the more standard array value by calling `list.array()` 


### optrep

* difficulty : 3
* A Parser can be repeated zero or many times  

```js        

// ok for 'ac' but also 'abbbbbc'    
C.char('a').optrep( C.char('b') ).char('c')

```

There is a MAJOR issue with optrep: optrep().optrep() or optrep().rep() will 
cause an infinite loop.




# Useful but touchy

`try()` and `or()` are useful, and work often together. `or()` alone is not difficult, but it's harder to understand
when it must work with `try()`

### or()

* Essential
* difficulty : 3

`or()` is used to test a parser, and if it fails, it will try the next one

```js
const endLiner = C.char('\n').or(F.eos())
const parser = F.moveUntil(endLiner.drop())
```

This case is straightforward, but it can be more complex when the parser eats while testing or(). 

````js

const eater= C.char('a').then( C.char('a'))
const parser = eater.or( C.char('b'))

const stream = Streams.ofString('ab');
const parsing = parser.parse(stream);
expect(parsing.isAccepted()).toBe(false);
expect(parsing.offset).toBe(1); // ✨ this is the point ! one 'a' is consumed

const nonEater= F.try(eater).or( C.char('b')); // use this to allow backtracking
````

Because Masala is a fast LL(1) parser, it will try to move forward by default.




### partial and full backtracking: F.try().or() and F.tryAll()

* Essential !
* difficulty : 3
* Try a succession of parsers
* If success, then continues
* If not, jump after the succession, and continues with `or()`
 
```js
const typical = F.try(x).or(y) // still no backtrack on or(y)
const manyOr = F.tryAll([x,y,z]) // same as try(x).or(try(y)).or(try(z))
```
         






### flatMap (f )
 
* difficulty : 3
* parameter f is a function
* pass parser.value to `f` function (TODO : better explain)
* f can combine parsers to continue to read the stream, knowing the previous value

        'expect (flatMap) to be return a-b-c': function(test) {
            test.equal(parser.char("a")
                .flatMap(
                    aVal=> parser.char('b').then(parser.char('c'))
                    .map(bcVal=>aVal+'-'+bcVal.join('-')) //--> join 3 letters
                ) 
                .parse(Streams.ofString("abc")).value,
                'a-b-c',
                'should be accepted.');
          },


It can help you to read your document knowing what happen previously

```js
/* We need to parse this:
        name: Nicolas
        hotel: SuperMarriot
        Nicolas: nz@robusta.io
 */
function combinator() {
    return readNextTag('name').map( name =>  {name})
        .then(readNextTag('hotel')).map(([context, hotel]) => Object.assign(context, {hotel}))
        // we don't know that tag is Nicolas. It depends on running context 
        .flatMap(userEmail);
        // now parsing value has name, hotel and email keys
}


// We have Nicolas: nz@robusta.io
function userEmail(context){// context injected is the running value of the parsing
    return readNextTag(context.name).map(email => Object.assign(context, {email}))
}
```

 
### filter (predicate)

* difficulty : 1
* To be used once a value is defined
* `predicate` is a function pVal -> boolean
* Check if the stream satisfies the predicate
    - Parse will be `Rejected` if filter is `false`
 
        'expect (filter) to be accepted': function(test) {
            test.equal(parser.char("a").filter(a => a === 'a')
                  .parse(Streams.ofString("a")).isAccepted(),
                   true,
                   'should be accepted.');
        }

### match (matchValue)

* difficulty : 0
* Simplification of `filter()`
* Check if the stream value is equal to the *matchValue* 
 
 
        //given 123
        N.number().match(123)


### error()

* difficulty : 0
* Forces an error
* The parser will be `rejected`

TODO : Is it possible to have a value for this error ? It would give a 
 live hint for the writer.




### satisfy(predicate)

* difficulty : 2
* Used internally by higher level functions 
* If predicate is true, consumes a element from the stream, and the value is set to the element
* If predicate is false, the element is not consumed

 

