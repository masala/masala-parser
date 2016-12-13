
Parser Object :

* It reads a stream of characters
* This is a monoïd
    - It wraps a **value**
    - It has some functions to work on value
    - It has function to validate the stream


## Monoïd definition

TODO 

## Streaming inputs

TODO : link explanations with parser_stream_test.js

## Parser class :

###  constructor (parse)
 
* difficulty : 2
* contruct a Parser object
* `parse` is a streaming function
    - reads characters at a given index
    - can end the stream
* the `parse()` function will determine the behaviour of the Parser

### flatmap (f )
 
* difficulty : 2
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


### map(f)

* difficulty : 0
* Change the value inside the monoïd

        'expect (map) to be return ab': function(test) {
            test.equal(parser.char("a").map(function(a) { return a + "b"; })
                       .parse(stream.ofString("a")).value,
                       'ab',
                       'should be accepted.');
        }
 
 
### filter (predicate)

* difficulty : 0
* To be used once a value is defined
* `predicate` is a function pVal -> boolean
* Check if the stream staisies the predicate
 
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
 

### then

* difficulty : 1
* Construct an array value from **two** previous success values
* If more than two are needed, use `flatmap()`
* `then()` uses internally `flatmap()`

        'expect (then) to be build [a,b]': function(test) {
            test.deepEqual(
                const stream = stream.ofString("ab"); 
                parser.char("a").then(parser.char("b")).parse(stream).value,
                ['a', 'b'],
                'should be accepted.');
        },


### p1.thenLeft(p2), p1.thenRight(p2)

* difficulty : 1
* Uses `then()` and returns only the left or right value

        'expect (thenLeft) to keep only 'a' from ['a','b']': function(test) {
            test.deepEqual(
                const stream = stream.ofString('ab'); 
                P.char('a').thenLeft(parser.char('b')).parse(stream).value,
                'a',
                'should be accepted.');
        },

### thenReturns(value)

* difficulty : 1
* Shortcut for `thenRight()`

        const P = parser;
        const value = 'b'
        P.char('a').thenReturns(value)
        
instead of :         
        
        P.char('a').thenRight(P.char('b'))

TODO : What if value is not a character ?

### error()

* difficulty : 0
* Forces an error


### eos()

* difficulty : 1
* Test if the stream reaches the end of the stream


### satisfy()

* difficulty : 2
* Used internally by higher level functions 


### try() and or()


 
* difficulty : 1
* Try a succession of parsers
* If success, then continues
* If not, jump after the succession, and continues with `or()`
 
         try(   x().then(y())  ).or(...)


TODO : what's the difference with : (  x().then(y())  ).or()
TODO : There is a story of consumed input
    - in tests : 'expect (then.or) left to be consumed'

 
### any()

* difficulty : 0
* next character will always work

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


        'expect (rep) to accepted': function(test) { 
             const stream = stream.ofString("aaa");
             const accepted = parser.char("a").rep().parse(stream,0).isAccepted()
                test.deepEqual(accepted,true);
        }

### optrep

* difficulty : 0
* A Parser can be repeated zero or many times  

        const P = parser;
        // ok for 'ac' but also 'abbbbbc'    
        P.char('a').optrep( P.char('b') ).char('P.c')
























Parse() :  







































