Parser Extensions
=====


These functions allow users to quickly find letters or numbers in 
a standard text


### returns()

* Forces a value 
* Does not consume a character


### lazy(parserFunction)

* The point is that the parserFunction is not called immediately
    - Use `P.lazy( this.text )` and not `P.lazy( this.text() )`
* The parserFunction will be called when needed
    - TODO : I have no clear explanation
* One important use is when dealing with **recursion**


       expression() {
                return P.try(
                    number()
                        .thenLeft(plus())
                        .then(P.lazy(  expression ) )  // <-- function is not called
                        .map(values => values[0]+values[1])
                )
                .or(this.number());
        }

Important : Parsec is a streaming parser.
 [Your parser can NOT be left recursive.](https://github.com/d-plaindoux/parsec/issues/13)
   



### digit()


### letter()

### letters()


### string(value)

### lowerCase()

### upperCase()