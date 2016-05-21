# Parser Combinators

[![Build Status](https://travis-ci.org/d-plaindoux/parsec.svg)](https://travis-ci.org/d-plaindoux/parsec) 
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/parsec/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/parsec?branch=master) 
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Javascript parser combinator implementation inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf).

## Parsers description

### Parsers for generic stream 

- *returns* : &forall; a c . a &rarr; Parser a c
- *error* : &forall; a c . unit &rarr; Parser a c
- *eos* : &forall; c . unit &rarr; Parser unit c
- *satisfy* : &forall; a . (a &rarr; bool) &rarr; Parser a a
- *try* : &forall; a c . unit &rarr; Parser a c

### Parsers for char stream 

- *digit* : unit &rarr; Parser char char
- *lowerCase* : unit &rarr; Parser char char
- *upperCase* : unit &rarr; Parser char char
- *letter* : unit &rarr; Parser char char
- *notChar* : char &rarr; Parser char char
- *char* : char &rarr; Parser char char
- *charLitteral* : unit &rarr; Parser char char
- *stringLitteral* : unit &rarr; Parser char char
- *numberLitteral* : unit &rarr; Parser char char
- *string* : string &rarr; Parser char char

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




