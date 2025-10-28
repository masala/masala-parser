# Recursion

Masala-Parser (like Parsec) is a top-down parser and doesn't like
[Left Recursion](https://cs.stackexchange.com/a/9971). Furthemore, building
naively your combinator parser with recursion would make a stack overflow before
parsing

## Recursion fail

        const {Streams, F, N, C, X} = require('@masala/parser');

        function A(){
            return C.char('A').then(B());
        }

        function B(){
            return C.char('B').or(A()); //   <----- will call A() then B() then A()
        }

        console.log('=== Building Parser ====');
        const parser = A();
        console.log('=== NEVER THERE ====');
        let parsing = parser.parse(Streams.ofChars('AAAAAB'));

## Lazy Recursion

**Masala-Parser** Comes with a `F.lazy( P )` function that will end the loop
while building. It builds the combinator, but P will be called only while
parsing the stream.

        function A(){
            return C.char('A').then(B());
        }

        function B(){
            return C.char('B').or(F.lazy(A));  <--- A() is not called yet !
        }

        console.log('=== Building Parser ====');
        const parser = A();
        console.log('=== GETTING THERE ====');
        let parsing = parser.parse(Streams.ofChars('AAAAAB')); // Accepted :)


## Operations

Operation are logically left-recursive: Let say an expression is `100` or
`(20*5)`, which is also `((4*5)*5)`, or `(((2*2)*5)*5)` ....

There is a general algorithm that
[removes Left recursion](https://en.wikipedia.org/wiki/Left_recursion#Removing_left_recursion).

It can be written it his PEG form:

        E -> T E'
        E' -> + TE'  |  eps
        T -> F T'
        T' -> * FT'  |  eps
        F -> NUMBER | ID | ( E )

Where:

- **E** is an Expression
- **F** is a terminal expression (Final), or a start for recursion
- **E'** and **T'** are optional operation made on **F**
- eps is an empty character

Note that there are two distinct level of precedence, as `+` and `*` doesn't
have the same level of priority. Using only one level of operator, we simplify
to:

        T -> F T'
        T' -> operator FT'  |  eps
        F -> NUMBER | ( T )

Which can be translated in _pseudo masala_:

        expr -> terminal then subExpr
        subExpr -> (operator then terminal then subExpr ).opt()
        terminal -> NUMBER or ( F.lazy(expr) )

It appears that it's simplified with Masala, as you won't have to create a
subExpression per operator. Just call

        const operator = ()=> C.charIn('+-*/');
