# Javascript Parser Combinators

[![npm version](https://badge.fury.io/js/parser-combinator.svg)](https://badge.fury.io/js/parser-combinator)
[![Build Status](https://travis-ci.org/d-plaindoux/parsec.svg)](https://travis-ci.org/d-plaindoux/parsec) 
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/parsec/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/parsec?branch=master) 
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Javascript parser combinator implementation inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf).

## Tutorial

According to Wikipedia *"in functional programming, a parser combinator is a 
higher-order function that accepts several parsers as input and returns a new 
parser as its output."* 

### Hello World

```
var P = require('parser-combinator').parsec.parser,
    S = require('parser-combinator').stream;

var p = P.string("Hello").then(P.char(' ').rep()).thenRight(P.letter.rep());
            
p.parse(S.ofString("Hello World")).value.join('') === "World"
```

You can also [try it online](https://tonicdev.com/d-plaindoux/parser-combinator-hello-world) !

### Character based parsers

Let `P` be the parser library.

```
P.digit                             (1)
P.lowerCase                         (2)
P.upperCase                         (3)
P.char('h')                         (4)
P.notChar('h')                      (5)
P.string("hello")                   (6)
```

1. Recognize a digit i.e. `'0'` ... `'9'`.
2. Recognize a lower case letter i.e. `'a'` ... `'z'`
3. Recognize a upper case letter i.e. `'A'` ... `'Z'`
4. Recognize the character 'h'
5. Recognize any character except 'h'
6. Recognize the string `"hello"`

### Combinators

Let `P` be the parser library.

```
P.lowerCase.or(P.upperCase)         (1)
P.digit.rep()                       (2)
P.char('-').opt()                   (3)
P.char(' ').optrep()                (4)
P.lowerCase.then(P.letter.optrep()) (5)
```

1. Recognize a letter i.e. `'a'` ... `'z'` **or** `'A'` ... `'Z'`
4. Recognize a number with at least one digit 
3. Recognize the character `'-'` or nothing
4. Recognize a least zero white space
5. Recognize a lowercase then may be letters like `aAaA`

### Transformations

During a parsing process each parsed and captured data can be transformed 
an aggregated with other transformed data. For this purpose the `map` 
function is available.

```
// [ char in {'0'..'9'} ] -> number
function toInteger(digits) {
    return parseInt(digits.join(''));
}

P.digit.rep().map(toInteger)        (1)
```

1. Recognize a sequence of digits and transform it to a number.

## Specifications

### Stream constructors
- *ofString* : string -> Stream char
- *ofArray* : &forall; a . [a] -> Stream a
- *ofParser* : &forall; a c .(Parse a c, Stream c) -> Stream a
- *buffered* : &forall; a .Stream a -> Stream a

### Parser

#### Basic constructors:
- *lazy* : &forall; a c . (unit &rarr; Parser a c) &rarr; Parser a c
- *returns* : &forall; a c . a &rarr; Parser a c
- *error* : &forall; a c . unit &rarr; Parser a c
- *eos* : &forall; c . unit &rarr; Parser unit c
- *satisfy* : &forall; a . (a &rarr; bool) &rarr; Parser a a
- *try* : &forall; a c . Parser a c &rarr; Parser a c
- *not* : &forall; a c . Parser a c &rarr; Parser a c

#### Char sequence constructors:
- *digit* : Parser char char
- *lowerCase* : Parser char char
- *upperCase* : Parser char char
- *letter* : Parser char char
- *notChar* : char &rarr; Parser char char
- *aChar* : char &rarr; Parser char char
- *charLitteral* : Parser char char
- *stringLitteral* : Parser string char
- *numberLitteral* : Parser number char
- *aString* : string &rarr; Parser string char

#### Parser Combinators:
- *then* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser [a,b] c
- *thenLeft* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser a c
- *thenRight* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser b c
- *or* : &forall; a c . **Parser a c** &rArr; Parser a c &rarr; Parser a c
- *opt* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (Option a) c
- *rep* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (List a) c
- *optrep* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (List a) c
- *match* : &forall; a c . **Parser a c** &rArr; Comparable a &rarr; Parser a c

#### Parser manipulation:
- *map* : &forall; a b c . **Parser a c** &rArr; (a &rarr; b) &rarr; Parser b c
- *flatmap* : &forall; a b c . **Parser a c** &rArr; (a &rarr; Parser b c) &rarr; Parser b c
- *filter* : &forall; a b c . **Parser a c** &rArr; (a &rarr; bool) &rarr; Parser a c

#### Chaining parsers by composition:
- *chain* : &forall; a b c . **Parser a c** &rArr; Parser b a &rarr; Parser b c

#### Parser Main Function:
- *parse* : &forall; a c . **Parser a c** &rArr; Stream c &rarr; number &rarr; Response a

### Token

#### Token builder:
- *keyword* : string &rarr; Token 
- *ident* : string &rarr; Token 
- *number* : string &rarr; Token 
- *string* : string &rarr; Token 
- *char* : string &rarr; Token 

#### Token parser:
- *keyword* : Parser Token Token
- *ident* : Parser Token Token
- *number* : Parser Token Token 
- *string* : Parser Token Token 
- *char* : Parser Token Token

### Generic Lexer

#### GenlexFactory data type:
- *keyword* : &forall; a . string &rarr; a
- *ident* : &forall; a .string &rarr; a
- *number* : &forall; a .number &rarr; a
- *string* : &forall; a .string &rarr; a
- *char* : &forall; a .char &rarr; a

#### Genlex generator:
- *keyword* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *ident* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *number* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *string* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *char* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *token* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser a char
- *tokens* : &forall; a . **Genlex [String]** &rArr; GenlexFactory a &rarr; Parser [a] char

### Tokenizer

#### Tokenizer [String]
- *tokenize* : **Tokenizer [String]** &rArr; Stream char &rarr; Try [Token]

## License

Copyright (C)2016 D. Plaindoux.

This program is  free software; you can redistribute  it and/or modify
it  under the  terms  of  the GNU  Lesser  General  Public License  as
published by  the Free Software  Foundation; either version 2,  or (at
your option) any later version.

This program  is distributed in the  hope that it will  be useful, but
WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
MERCHANTABILITY  or FITNESS  FOR  A PARTICULAR  PURPOSE.  See the  GNU
Lesser General Public License for more details.

You  should have  received a  copy of  the GNU  Lesser General  Public
License along with  this program; see the file COPYING.  If not, write
to the  Free Software Foundation,  675 Mass Ave, Cambridge,  MA 02139,
USA.




