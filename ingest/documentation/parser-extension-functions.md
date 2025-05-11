Parser Extensions
=====


These functions allow users to quickly find letters or numbers in 
a standard text


### returns()

* Forces a value 
* Does not consume a character


### lazy(parserFunction)

* The point is that the parserFunction is not called immediately
    - Use `F.lazy( this.text )` and not `F.lazy( this.text() )`
* The parserFunction will be called when needed
* One important use is [when dealing with **recursion**](./recursion.html)


       expression() {
                return F.try(
                    number()
                        .thenLeft(plus())
                        .then(F.lazy(  expression ) )  // <-- function is not called
                        .map(values => values[0]+values[1])
                )
                .or(this.number());
        }

Important : Masala is a streaming parser.
 [The grammar you make a parser for can NOT be left recursive.](https://github.com/d-plaindoux/masala-parser/issues/13) The good news is that any left recursive grammar can be rewritten to a form that masala-parser can handle.
   



### digit()


### letter()

### letters()


### string(value)

### lowerCase()

### upperCase()
