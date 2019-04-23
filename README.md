# Masala Parser: Javascript Parser Combinators

[![npm version](https://badge.fury.io/js/%40masala%2Fparser.svg)](https://badge.fury.io/js/%40masala%2Fparser)
[![Build Status](https://travis-ci.org/d-plaindoux/masala-parser.svg)](https://travis-ci.org/d-plaindoux/masala-parser)
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/masala-parser/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/masala-parser?branch=master)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Masala Parser is inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf).

Masala Parser is a Javascript implementation of the Haskell **Parsec**.
 It is plain Javascript that works in the browser, is tested with more than 450 unit tests, covering 100% of code lines.

### Use cases

* It can create a full parser from scratch as an alternative for Lex & yacc
* It can extract data from a big text and replace complex regexp
* It works in any browser
* It can validate complete structure with variations
* It can parse and execute custom operations

Masala Parser keywords are **simplicity**, **variations** and **maintainability**. You won't
need theoretical bases on languages for extraction or validation use cases.

Masala Parser has relatively good performances, however Javascript is obviously not the fastest machine.

# Usage

With Node Js or modern build        
        
        npm install -S @masala/parser

Or in the browser 

* [download Release](https://github.com/d-plaindoux/masala-parser/releases)
* `<script src="masala-parser.min.js"/>`

Check the [Change Log](./changelog.md) if you can from a previous version.


# Quick Examples

## Floor notation

```js
// N: Number Bundle, C: Chars Bundle
const {Streams, N, C}= require('@masala/parser');

const stream = Stream.ofString('|4.6|');
const floorCombinator = C.char('|').drop()
    .then(N.number())      // we have ['|', 4.6], we drop '|'
    .then(C.char('|').drop())   // we have [4.6, '|'], we keep [4.6]
    .single() // we had [4.6], now just 4.6
    .map(x =>Math.floor(x));

// The parser parses a stream of characters
const parsing = floorCombinator.parse(stream);
assertEquals( 4, parsing.value, 'Floor parsing');
```

## Explanations

According to Wikipedia *"in functional programming, a parser combinator is a
higher-order function that accepts several parsers as input and returns a new
parser as its output."*

## The Parser

Let's say we have a document :

>>> The James Bond series, by writer Ian Fleming, focuses on a fictional British Secret Service agent created in 1953, who featured him in twelve novels and two short-story collections. Since Fleming's death in 1964, eight other authors have written authorised Bond novels or novelizations: Kingsley Amis, Christopher Wood, John Gardner, Raymond Benson, Sebastian Faulks, Jeffery Deaver, William Boyd and Anthony Horowitz.

There are many way to analyze this document, for example finding names inside. But what is a name ? We can say that it
 is a combination of two following words starting with an uppercase. But what is a word ? What are following words ?
  What is a starting uppercase word ?

The goal of a parser is to find out. The goal of Masala Parser is to make this easy.



## The Response

By definition, a Parser takes text as an input, and the Response is a structure that represents your problem. 
After parsing, there are two subtypes of `Response`:
 
* `Accept` when it found something.    
* `Reject` if it could not.


```js

    let response = C.char('a').rep().parse(Streams.ofString('aaaa'));
    assertEquals(response.value.join(''), 'aaaa' );
    assertEquals(response.offset, 4 );
    assertTrue(response.isAccepted());
    assertTrue(response.isConsumed());
    
    // Partially accepted
    response = C.char('a').rep().parse(Streams.ofString('aabb'));
    assertEquals(response.value.join(''), 'aa' );
    assertEquals(response.offset, 2 );
    assertTrue(response.isAccepted());
    assertFalse(response.isConsumed());

```


## The Monoid structure

A monoid is an object with functions and one single encapsulated value. Have you heard of jQuery ? The `$` object is a monoid, where
 the value is the DOM selection.
The parser will read through the document and aggregate values. The single value of the monoid will be modified by the document stream,
  but can also be modified by function calls, such as the `map()` function. The value is the `Response` of your `Parser`.

![](./documentation/parsec-monoid.png)

A Http Promise is also a good example. It will give you later the value. Masala does the same: it will give you
the `Response` after parsing. 


## Hello 'X'

The goal is check that we have Hello 'someone', then to grab that name

```js
// Plain old javascript
const {Streams,  C}= require('@masala/parser');

var helloParser = C.string("Hello")
                    .then(C.char(' ').rep())
                    .then(C.char(`'`))
                    .drop()
                    .then(C.letters()) // succession of A-Za-z letters
                    .then(C.char(`'`).drop())
                    .single();    // keeping previous letters

var parsing = helloParser.parse(Streams.ofString("Hello 'World'"));

assertEquals(['World'], parsing.value);
```




# Parser Combinations

Let's use a real example. We combine many functions that returns a new Parser. And each new Parser
is a combination of Parsers given by the standard bundles or previous functions.

```js
import  {Streams, N,C, F} from '@masala/parser';

const blanks = ()=>C.char(' ').optrep();

function operator(symbol) {
    return blanks().drop()
        .then(C.char(symbol))   // '+' or '*'
        .then(blanks().drop())
        .single();
}

function sum() {
    return N.integer()
        .then(operator('+').drop())
        .then(N.integer())
        .map(values => values[0] + values[1]); 
        
}

function multiplication() {
    return N.integer()
        .then(operator('*').drop())
        .then(N.integer())
        .map( ([left,right])=> left * right); // more modern js 
}

function scalar() {
    return N.integer();
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());
}

function parseOperation(line) {
    return combinator().parse(Streams.ofString(line));
}

assertEquals(4, parseOperation('2   +2').value, 'sum: ');
assertEquals(6, parseOperation('2 * 3').value, 'multiplication: ');
assertEquals(8, parseOperation('8').value, 'scalar: ');
```

A curry paste is an higher order ingredient made from a good combination of spices.

![](./documentation/images/curry-paste.jpg)

## Precedence

Precedence is a technical term for priority. Using:

```js
function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());
}

console.info('sum: ',parseOperation('2+2').value);
```

We will give priority to sum, then multiplication, then scalar. If we had put `scalar()` first, we would have first
accepted `2`, then what could we do with `+2` alone ? It's not a valid sum !

## try(x).or(y)


`or()` will often be used with `try()`, that makes [backtracking](https://en.wikipedia.org/wiki/Backtracking) 
: it saves the current offset, then tries an option. And as soon that it's not satisfied, it goes back to the original 
offset and use the parser inside the `.or(P)` expression.`.

 Like Haskell's Parsec, Masala Parser can parse infinite look-ahead grammars but
 performs best on predictive (LL[1]) grammars.

Let see how with `try()`, we can look a bit ahead of next characters, then go back:

        F.try(sum()).or(F.try(multiplication())).or(scalar())
        // try(sum()) parser in action
        2         *2
        ..ok..ok  ↑oups: go back and try multiplication. Should be OK.


Suppose we do not `try()` but use `or()` directly:

        sum().or(multiplication()).or(scalar())
        // testing sum()
        2         *2
        ..ok..ok  ↑oups: cursor is NOT going back. So now we must test '*2' ;
                                                   Is it (multiplication())? No ;
                                                   or(scalar()) ? neither




# Recursion

Masala-Parser (like Parsec) is a top-down parser and doesn't like [Left Recursion](https://cs.stackexchange.com/a/9971).

However, it is a resolved problem for this kind of parsers, with a lot of documentation. You can read more on [recursion
with Masala](./documentation/recursion.md), and checkout examples on our Github repository 
( [simple recursion](https://github.com/d-plaindoux/masala-parser/blob/master/integration-npm/examples/recursion/aaab-lazy-recursion.js), 
or [calculous expressions](https://github.com/d-plaindoux/masala-parser/blob/master/integration-npm/examples/operations/plus-minus.js) ).



# Simple documentation of Core bundles

## Core Parser Functions

Here is a link for [Core functions documentation](./documentation/parser-core-functions.md).

It will explain `then()`, `drop()`, `map()`, `rep()`, `opt()` and other core functions of the Parser
with code examples.

### 

## The Chars Bundle

Example: 

```js
C.char('-')
    .then(C.letters())
    .then(C.char('-'))
// accepts  '-hello-' ; value is ['-','hello','-']
// reject '-hel lo-' because space is not a letter    
```

[General use](./documentation/chars-bundle.md)

* `letter()`: accept a european letter (and moves the cursor)
* `letters()`: accepts many letters and returns a string
* `letterAs(symbol)`: accepts a european(default), ascii, or utf8 Letter. [More here](./documentation/chars-bundle.md)
* `lettersAs(symbol)`: accepts many letters and returns a string
* `emoji()`: accept any emoji sequence. [Opened Issue](https://github.com/d-plaindoux/masala-parser/issues/86).
* `notChar(x)`: accept if next input is not `x`
* `char(x)`: accept if next input is `x`
* `charIn('xyz')`: accept if next input is `x`, `y` or `z`
* `charNotIn('xyz')`: accept if next input is not `x`, `y` or `z`
* `subString(length)`: accept any next *length* characters and returns the equivalent string
* `string(word)`: accept if next input is the given `word`  
* `stringIn(words)`: accept if next input is the given `words` [More here](./documentation/chars-bundle.md)
* `notString(word)`: accept if next input is *not* the given `word`
* `charLiteral()`: single quoted char element in C/Java : `'a'` is accepted
* `stringLiteral()`: double quoted string element in java/json: `"hello world"` is accepted
* `lowerCase()`: accept any next lower case inputs
* `upperCase()`: accept any next uppercase inputs

Other example:

```js
C.string('Hello')
    .then(C.char(' '))
    .then(C.lowerCase().rep().join(''))

// accepts Hello johnny ; value is ['Hello', ' ', 'johnny']
// rejects Hello Johnny : J is not lowercase ; no value
// rep() is not easy to handle.
```

## The Numbers Bundle


* `number()`: accept any float number, such as -2.3E+24, and returns a float    
* `digit()`: accept any single digit, and return a **single char** (or in fact string, it's just javascript)
* `digits()`: accept many digits, and return a **string**. Warning: it does not accept **+-** signs symbols.
* `integer()`: accept any positive or negative integer




## The Flow Bundle

The flow bundle will mix ingredients together.

For example if you have a Parser `p`, `F.not(p)` will accept anything
that does not satisfy `p`

All of these functions will return a brand new Parser that you can combine with others.

Most important:

* `F.try(parser).or(otherParser)`: Try a parser and come back to `otherParser` if failed
* `F.any()`: Accept any character (and so moves the cursor)
* `F.not(parser)`: Accept anything that is not a parser. Often used to accept until a given *stop*  
* `F.eos()`: Accepted if the Parser has reached the **E**nd **O**f **S**tream
* `F.moveUntil(string|stopParser)`: Alternative for **regex**. Will traverse the document **until** the *stop parser*
    - returns `undefined` if *stop* is not found
    - returns all characters if *stop* is found, and set the cursor at the spot of the stop
* `F.dropTo(string|stopParser)`: Will traverse the document **including** the *stop parser*
    

Others:

* `F.lazy(parser, ?params)`: Makes a lazy evaluation. May be used for Left recursion (difficult)
* `F.parse(parserFunction)`: Create a new Parser from a function. Usually, you won't start here.
* `F.subStream(length)`: accept any next characters  
* `F.returns(value)`: forces a returned value
* `F.error()`: returns an error. Parser will never be accepted
* `F.satisfy(predicate)`: check if condition is satisfied
* `F.startsWith(value)`: create a no-op parser with initial value 


# The Standard bundles

Masala Parser offers a Json parser, and bricks for custom markdown parser.




## JSON Bundle and Markdown Bundle

The JSON bundle offers an easy to use JSON parser. Obviously you could use native `JSON.parse()` function. So it's more
  a source of examples to deal with array structure.

**Warning: The Markdown bundle is under active development and will move a lot !**

The Markdown parser will not compile Markdown in HTML, but it will gives you a Javascript object (aka JSON structure).
The Markdown bundle offers a series of Markdown tokens to build your own **meta-markdown** parser.

Tokens are:

* `blank()`: blanks in paragraphs, including single end of line
* `eol()`: `\n` or `\r\n`
* `lineFeed()`: At least two EOL
* `fourSpacesBlock()`: Four spaces or two tabs (will accept option for x spaces and/or y tabs)
* `stop()`: End of pure text
* `pureText()`: Pure text, which is inside italic or bold characters
* `italic()`: italic text between `*pureText*` or `_pureText_`
* `bold()`: bold text between `**pureText**`
* `code()`: code text between `` `pureText` `` (double backticks for escape not yet supported)
* `text (pureTextParser)`: higher level of pureText, if you need to redefine what is pureText
* `formattedSequence (pureText, stop)`: combination of pureText, italic, bold and code
* `formattedParagraph()`: formattedSequence separated by a lineFeed
* `titleLine()`: `title\n===` or `title\n---` variant of title
* `titleSharp()`: `### title` variant of title
* `title()`: titleLine or titleSharp
* `bulletLv1()`: Level one bullet
* `bulletLv2()`: Level two bullet
* `bullet()`: Level one or two bullets
* `codeLine()`: Four spaces indented code block line



## License

Copyright (C)2016-2018 D. Plaindoux.

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
