
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
* Change the value inside the monoïde

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

        'expect (then) to be build [a,b]': function(test) {
            test.deepEqual(
                const stream = stream.ofString("ab"); 
                P.char("a").thenLeft(parser.char("b")).parse(stream).value,
                'a',
                'should be accepted.');
        },

### thenReturns

* difficulty : 1
* Shortcut for `thenRight()`

        parser.char("a").thenReturns("b")
        
instead of :         
        
        parser.char("a").then(parser.char("b"))


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

 


Parse() :  







































