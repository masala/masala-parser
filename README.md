# Parser Combinators

[![Build Status](https://travis-ci.org/d-plaindoux/parsec.svg)](https://travis-ci.org/d-plaindoux/parsec) 
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/parsec/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/parsec?branch=master) 
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Javascript parser combinator implementation inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf).

## Parser specification

#### Basic constructors:
- *returns* : &forall; a c . a &rarr; Parser a c
- *error* : &forall; a c . unit &rarr; Parser a c
- *eos* : &forall; c . unit &rarr; Parser unit c
- *satisfy* : &forall; a . (a &rarr; bool) &rarr; Parser a a
- *try* : &forall; a c . Parser a c &rarr; Parser a c

#### Char sequence constructors:
- *digit* : unit &rarr; Parser char char
- *lowerCase* : unit &rarr; Parser char char
- *upperCase* : unit &rarr; Parser char char
- *letter* : unit &rarr; Parser char char
- *notChar* : char &rarr; Parser char char
- *aChar* : char &rarr; Parser char char
- *charLitteral* : unit &rarr; Parser char char
- *stringLitteral* : unit &rarr; Parser string char
- *numberLitteral* : unit &rarr; Parser number char
- *aString* : string &rarr; Parser string char

#### Parser Combinators:
- *and* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser [a,b] c
- *andLeft* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser a c
- *andRight* : &forall; a b c . **Parser a c** &rArr; Parser b c &rarr; Parser b c
- *or* : &forall; a c . **Parser a c** &rArr; Parser a c &rarr; Parser a c
- *opt* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (Option a) c
- *rep* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (List a) c
- *optrep* : &forall; a c . **Parser a c** &rArr; unit &rarr; Parser (List a) c
- *match* : &forall; a c . **Parser a c** &rArr; Comparable a &rarr; Parser a c

#### Parser manipulation:
- *map* : &forall; a b c . **Parser a c** &rArr; (a &rarr; b) &rarr; Parser b c
- *flatmap* : &forall; a b c . **Parser a c** &rArr; (a &rarr; Parser b c) &rarr; Parser b c
- *filter* : &forall; a b c . **Parser a c** &rArr; (a &rarr; bool) &rarr; Parser a c

#### Parser Main Function:
- *parse* : &forall; a c . **Parser a c** &rArr; Stream 'c &rarr; number &rarr; Response 'a

### Examples

```Javascript
// Mount parser module
var P = require('Parsec').parser;

// Parser number char
var e = P.char('(').thenRight(P.number).thenLeft(P.char(')'));

// Perform parse operation
e.parse(stream.ofCharacters("(12)")) === 12 
```

## Token specification

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




