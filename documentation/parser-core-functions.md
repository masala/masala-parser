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
 
Usually, you should **NOT** create a Parser from its constructor. You will combine **existing parsers** to create a
 new one
 
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


# Essential Parser functions

### then

* difficulty : 1
* Construct an array of values from **two** previous success values
* If more than two are needed, use `flatmap()`
* `then()` uses internally `flatmap()`

        'expect (then) to be build [a,b]': function(test) {
            const stream = stream.ofString("ab");
            test.deepEqual(
                 
                C.char("a").then(C.char("b")).parse(stream).value,
                ['a', 'b']
                );
        }


### p1.thenLeft(p2), p1.thenRight(p2)

* difficulty : 1
* Uses `then()` and returns only the left or right value


        'expect (thenLeft) to returns 'a' from ['a','b']': function(test) {
            test.deepEqual(
                const stream = stream.ofString('ab'); 
                C.char('a').thenLeft(C.char('b')).parse(stream).value,
                'a'
                );
        }
        // thenRight will return 'b'

`thenLeft` and `thenRight` will often be used to find the right value in your data.
 
 A real life example with an addition : `x+y`.
You don't need the value of '+', but you want the value at its left (`x`) and its right (`y`);


        function sum() {
            // there are 3 tokens : x, +, and y 
             return N.number().thenLeft(plusOperator())
                // thenLeft has removed one token
                .then(N.number())
                // then has kept the y token: we have x and y in values
                // because we know there was a plusOperator(), we can make a sum
                .map(values=>values[0] + values[1]);
                
        }
 

### map(f)

* difficulty : 0
* Change the value of the monoid


```js
const stream = parsec.stream.ofString("5x8");
const combinator = N.integer
                    .thenLeft(C.char('x'))
                    .then(N.integer)
                    // values are [5,8] : we map to its multiplication
                    .map(values => values[0]*values[1]);
test.equal(combinator.parse(stream).value, 40)
```

### thenReturns(value)

* difficulty : 1
* Forces the value at a given point
* It's a simplification of map

        
```js
const stream = parsec.stream.ofString("ab"));
// given 'ac', value should be ['X' , 'c']
const combinator = C.char('a')
                    .thenReturns('X')
                    .then(C.char('c'); 
test.deepEquals().parse(stream)
```

It could be done using `map()`:

```js
const combinator = C.char('a')
                    .map(anyVal => 'X')
                    .then(C.char('c');
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

        const P = parser;
        // ok for 'ac' but also 'abc'    
        P.char('a').opt( P.char('b') ).char('P.c')

### rep()

* difficulty : 0
* Ensure a parser is repeated **at least** one time

         const stream = stream.ofString("aaa");
         const accepted = parser.char("a").rep().parse(stream,0).isAccepted()
            test.deepEqual(accepted,true);


### optrep

* difficulty : 0
* A Parser can be repeated zero or many times  

        const P = parser;
        // ok for 'ac' but also 'abbbbbc'    
        P.char('a').optrep( P.char('b') ).char('P.c')



# Useful but touchy

`try()` and `or()` are useful, and work often together. `or()` alone is not difficult, but it's harder to understand
when it must work with `try()`

### try() and or()

* Essential !
* difficulty : 1
* Try a succession of parsers
* If success, then continues
* If not, jump after the succession, and continues with `or()`
 
         try(   x().then(y())  ).or(...)


TODO : what's the difference with : (  x().then(y())  ).or()
TODO : There is a story of consumed input
    - in tests : 'expect (then.or) left to be consumed'
TODO : missing a pertinent test for using try()



### flatmap (f )
 
* difficulty : 3
* parameter f is a function
* pass parser.value to `f` function (TODO : better explain)
* f can combine parsers to continue to read the stream, knowing the previous value

        'expect (flatmap) to be return a-b-c': function(test) {
            test.equal(parser.char("a")
                .flatmap(
                    aVal=> parser.char('b').then(parser.char('c'))
                    .map(bcVal=>aVal+'-'+bcVal.join('-')) //--> join 3 letters
                ) 
                .parse(stream.ofString("abc")).value,
                'a-b-c',
                'should be accepted.');
          },


 
### filter (predicate)

* difficulty : 1
* To be used once a value is defined
* `predicate` is a function pVal -> boolean
* Check if the stream satisfies the predicate
    - Parse will be `Rejected` if filter is `false`
 
        'expect (filter) to be accepted': function(test) {
            test.equal(parser.char("a").filter(a => a === 'a')
                  .parse(stream.ofString("a")).isAccepted(),
                   true,
                   'should be accepted.');
        }

### match (matchValue)

* difficulty : 0
* Simplification of `filter()`
* Check if the stream value is equal to the *matchValue* 
 
 
        //given 123
        P.number().match(123)


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

 






















































