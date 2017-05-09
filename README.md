# Masala Parser: Javascript Parser Combinators

[![npm version](https://badge.fury.io/js/parser-combinator.svg)](https://badge.fury.io/js/parser-combinator)
[![Build Status](https://travis-ci.org/d-plaindoux/parsec.svg)](https://travis-ci.org/d-plaindoux/parsec)
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/parsec/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/parsec?branch=master)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Masala Parser is inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf).

Masala Parser is a Javascript implementation of the Haskell **Parsec**.
 It is plain Javascript that works in the browser, is tested with more than 400 unit tests, covering 100% of code lines.

### Use cases

* It can create a full parser from scratch as an alternative for Lex & yacc
* It can extract data from a big text and replace complex regexp
* It can validate complete structure with variations

Masala Parser keywords are **variations** and **maintainability**. You won't
need theoretical bases on languages for extraction or validation use cases.



# Quick Examples


## Floor notation

```js
// N: Number Bundle, C: Chars Bundle
import {stream, N,C} from 'parser-combinator';
const document = '|4.6|';

const floorCombinator= C.char('|').drop()
                        .then( N.numberLiteral )    // we had [ '|' , 4.6], we keep 4.6
                        .then( C.char('|').drop() )   // we had [ 4.6 , '|' ], we keep 4.6
                        .map(x => Math.floor(x)); // we transform selected value in meaningful value

// Parsec needs a stream of characters
const parsing = floorCombinator.parse(stream.ofString(document));

console.log( parsing.value === 4 );
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

The goal of a parser is to find out. The goal of Parsec is to make this easy.

## The Monoid structure

A monoid is an object with functions and one single encapsulated value. Have you heard of jQuery ? The `$` object is a monoid, where
 the value is the DOM selection.
The parser will read through the document and aggregate values. The single value of the monoid will be modified by the document stream,
  but can also be modified by function calls, such as the `map()` function.

![](./documentation/parsec-monoid.png)


## Hello 'X'

The goal is check that we have Hello 'something', then to grab that *something*

```js
// Plain old javascript
var parsec = require('parser-combinator');
var stream = parsec.stream;
var C = parsec.C;

var helloParser = C.string("Hello")
                    .then(C.char(' ').rep())
                    .then(C.char(`'`)).drop()
                    .then(C.letter.rep()) // keeping repeated ascii letters
                    .then(C.char(`'`).drop());    // keeping previous letters

var parsing = helloParser.parse(stream.ofString("Hello 'World'"));
// C.letter.rep() will give an array of letters
console.log(parsing.value.array().toString() == ['W','o','r','l','d'].toString());
```

## Improvement with Extractor Bundle

We have used a complex combinator that shows us how to parse character by character. But you can build or use
 higher level parsers to do the same job. **Masala Parser** offers an Extractor Bundle that could replace
  all of your regexp extractions.


```js
import {stream, X} from 'parser-combinator'

const line = stream.ofString("Hello 'World'");

// Adding a `'` as a word separator;  
const x = new X({moreSeparators: `'`});

const helloParser = x.words(false) // false because we don't keep separators
                     .map(x.last); // We had "Hello" and "World"

const value = helloParser.parse(line).value;

test.equals(value, 'World');
```



# Parser Combinations

Let's use a real example. We combine many functions that returns a new Parser. And each new Parser
is a combination of Parsers given by the standard bundles or previous functions.

```js
import  {stream, N,C, F, T} from 'parser-combinator';

function operator(symbol) {
    return T.blank().thenRight(C.char(symbol)).thenLeft(T.blank());
}

function sum() {
    return N.integer.thenLeft(operator('+')).then(N.integer)  // thenLeft will avoid symbol in resulting values
        .map(values=>values[0] + values[1]);
}

function multiplication() {
    return N.integer.thenLeft(operator('*')).then(N.integer)
        .map(values=>values[0] * values[1]);
}

function scalar(){
    return N.integer;
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());;
}

function parseOperation(line) {
    return combinator().parse(stream.ofString(line), 0);
}

console.info('sum: ',parseOperation('2   +2').value);  // 4
console.info('multiplication: ',parseOperation('2 * 3').value); //6
console.info('scalar: ',parseOperation('8').value);  // 8
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

`or()` will often be used with `try()`. Like Haskell's Parsec, Masala-Parser can parse infinite look-ahead grammars but
 performs best on predictive (LL[1]) grammars.

With `try()`, we can look a bit ahead of next characters, then go back:

        F.try(sum()).or(F.try(multiplication())).or(scalar())
        // try(sum()) parser in action
        2         *2
        ..ok..ok  ↑oups: go back and try multiplication. Should be OK.


Suppose we do not `try()` but use `or()` directly:

        sum().or(multiplication()).or(scalar())
        // testing sum()
        2         *2
        ..ok..ok  ↑oups: cursor is not going back. Having now to test '*2' ;
                                                   Is it (multiplication())? No ; or(scalar()) ? neither

`try()` has some benefits, but costs more in memory and CPU, as you test things twice.
 You should avoid long sequences of `try()` if memory is constrained. If possible, you can use `or()` without `try()`
  when there is no *starting ambiguity*.

`N.integer.or(C.letter())` doesn't require a `try()`.




# Simple documentation of Core bundles

## Core Parser Functions

Here is a link for [Core functions documentation](./documentation/parser-core-functions.md).

It will explain `then()`, `drop()`, `thenLeft()`, `thenRight()`, `map()`, `rep()`, `opt()` and other core functions of the Parser
with code examples.

## The Flow Bundle

The flow bundle will mix ingredients together.

For example if you have a Parser `p`, `F.not(p)` will accept anything
that does not satisfy `p`

All of these functions will return a brand new Parser that you can combine with others.

Most important:

* `F.try(parser).or(otherParser)`: Try a parser and come back to `otherParser` if failed
* `F.any`: Accept any character (and so moves the cursor)
* `F.not(parser)`: Accept anything that is not a parser. Often used to accept until a given *stop*  
* `F.eos`: Accepted if the Parser has reached the **E**nd **O**f **S**tream

Others:

* `F.lazy`: Makes a lazy evaluation. May be used for Left recursion (difficult)
* `F.parse(parserFunction)`: Create a new Parser from a function. Usually, you won't start here.
* `F.subStream(length)`: accept any next characters  
* `F.returns`: forces a returned value
* `F.error`: returns an error. Parser will never be accepted
* `F.satisfy`: check if condition is satisfied
* `F.sequence`:  Shorcut method. accept a given sequence or parsers.

## The Chars Bundle

* `letter`: accept an ascii letter ([opened issue for other languages](https://github.com/d-plaindoux/parsec/issues/43))
    (and so moves the cursor)
* `letters`: accepts many letters and returns a string
* `notChar(x)`: accept if next input is not `x`
* `char(x)`: accept if next input is `x`
* `charIn('xyz')`: accept if next input is `x`, `y` or `z`
* `charNotIn('xyz')`: accept if next input is not `x`, `y` or `z`
* `subString(length)`: accept any next *length* characters and returns the equivalent string
* `string(word)`: accept if next input is the given `word`  
* `notString(word)`: accept if next input is *not* the given `word`
* `charLiteral`: single quoted char element in C/Java : `'a'` is accepted
* `stringLiteral`: double quoted string element in java/json: `"hello world"` is accepted
* `lowerCase`: accept any next lower case inputs
* `upperCase`: accept any next uppercase inputs


## The Numbers Bundle


* `numberLiteral`: accept any float number, such as -2.3E+24, and returns a float    
* `digit`: accept any single digit, and return a **single char** (or in fact string, it's just javascript)
* `digits`: accept many digits, and return a **string**. Warning: it does not accept **+-** signs symbols.
* `integer`: accept any positive or negative integer


# The Standard bundles

Masala Parser offers a generic Token Bundle, a data Extractor, a Json parser, and an experimental
and incomplete markdown parser.

## The Token Bundle


* `email`: accept a very large number of emails
* `date`: accept a very small number of dates (2017-03-27 or 27/03/2017)
* `blank(nothing|string|parser)`: accept standard blanks (space, tab), or defined characters, or a combined Parser
* `eol`: accept **E**nd **O**f **L**ine `\n` or `\r\n`

## The Extractor Bundle

The Extractor will help you to find valuable data in complex text (emails sent by platforms, website crawling...)

`Parser` is a `class`, but you never use `new Parser()`. Other bundles are simple JS objects. The `X` extractor is a
class to make customization easy. So you can extend it to override methods, or use its constructor to change options.

### X constructor

`const x = new X(options)` with default options to:

        {
            spacesCharacters:' \n',
            wordSeparators:C.charIn(' \n:-,;'),
            letter : C.letter,
            moreSeparators: null
        }

* `spacesCharacters`: series of chars. Use `x.spaces()` to accept given spaces
* `wordSeparators`: Parser. Use `x.words()` to select words separated with `wordSeparators`
* `letter`: Parser. Original `C.letter` are only ascii letters. See [opened issue](https://github.com/d-plaindoux/parsec/issues/43).
* `moreSeparator`: series of chars. You don't have to redefine `wordSeparators` when using `{moreSeparator:'$£€'}`

### X functions

* `x.spaces()`: accept spaces defined in `options.spacesCharacters`
* `x.digits()`: accept many digits and returns a string
* `x.word()`: accept a word that satisfies repetition of `options.letter`. Returns the word as a string
* `x.words(keepSpaces=true)`: accept repetition of previous words. Set `keepSpaces=false` to removes spaces from result
* `x.wordsIn(arrayOfStrings, keepSpaces = true)`: accept given words, separated by previously defined `wordSeparators`
* `x.stringIn(arrayOfStrings)`: lower level parser. Accept one string that could be found in given `arrayOfStrings`
* `x.wordsUntil(stopParser)`: Probably the most valuable method. Will traverse the document until the **stop combinator**
    - returns `undefined` if *stop* is not found
    - returns all characters if *stop* is found, and set the cursor at the spot of the stop
    - Use `x.wordsUntil(valueStuffParser).thenRight(valueStuffParser)` to extract *valueStuff*
* `x.first`, `x.last`: mappers to pick first or last word  
    - example: `x.words().map(x.first)` will pick the first word of the document



## JSON Bundle and Markdown Bundle

The JSON bundle offers an easy to use JSON parser. Obviously you could use native `JSON.parse()` function. So it's more
  a source of examples to deal with array structure.

**Warning: The Markdown bundle is under active development and will move a lot !**

The Markdown parser will not compile Markdown in HTML, but it will gives you a Javascript object (aka JSON structure).
The Markdown bundle offers a series of Markdown tokens to build your own **meta-markdown** parser.

Tokens are:

* `blank`: blanks in paragraphs, including single end of line
* `eol`: `\n` or `\r\n`
* `lineFeed`: At least two EOL
* `fourSpacesBlock`: Four spaces or two tabs (will accept option for x spaces and/or y tabs)
* `stop`: End of pure text
* `pureText`: Pure text, which is inside italic or bold characters
* `italic`: italic text between `*pureText*` or `_pureText_`
* `bold`: bold text between `**pureText**`
* `code`: code text between `` `pureText` `` (double backticks for escape not yet supported)
* `text (pureTextParser)`: higher level of pureText, if you need to redefine what is pureText
* `formattedSequence (pureText, stop)`: combination of pureText, italic, bold and code
* `formattedParagraph`: formattedSequence separated by a lineFeed
* `titleLine`: `title\n===` or `title\n---` variant of title
* `titleSharp`: `### title` variant of title
* `title`: titleLine or titleSharp
* `bulletLv1`: Level one bullet
* `bulletLv2`: Level two bullet
* `bullet`: Level one or two bullets
* `codeLine`: Four spaces indented code block line


<!---

### Extension Parser functions

Here is a link for [Extension functions documentation](./documentation/parser-extension-functions.md) of the parser.

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
- *ofArray* : &forall; a . [a] &rarr; Stream a
- *ofParser* : &forall; a c .(Parse a c, Stream c) &rarr; Stream a
- *buffered* : &forall; a .Stream a &rarr; Stream a

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
- *then* : &forall; a b c . **Parser a c** &odot; Parser b c &rarr; Parser [a,b] c
- *thenLeft* : &forall; a b c . **Parser a c** &odot; Parser b c &rarr; Parser a c
- *thenRight* : &forall; a b c . **Parser a c** &odot; Parser b c &rarr; Parser b c
- *or* : &forall; a c . **Parser a c** &odot; Parser a c &rarr; Parser a c
- *opt* : &forall; a c . **Parser a c** &odot; unit &rarr; Parser (Option a) c
- *rep* : &forall; a c . **Parser a c** &odot; unit &rarr; Parser (List a) c
- *optrep* : &forall; a c . **Parser a c** &odot; unit &rarr; Parser (List a) c
- *match* : &forall; a c . **Parser a c** &odot; Comparable a &rarr; Parser a c

#### Parser manipulation:
- *map* : &forall; a b c . **Parser a c** &odot; (a &rarr; b) &rarr; Parser b c
- *flatmap* : &forall; a b c . **Parser a c** &odot; (a &rarr; Parser b c) &rarr; Parser b c
- *filter* : &forall; a b c . **Parser a c** &odot; (a &rarr; bool) &rarr; Parser a c

#### Chaining parsers by composition:
- *chain* : &forall; a b c . **Parser a c** &odot; Parser b a &rarr; Parser b c

#### Parser Main Function:
- *parse* : &forall; a c . **Parser a c** &odot; Stream c &rarr; number &rarr; Response a

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
- *keyword* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *ident* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *number* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *string* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *char* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *token* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser a char
- *tokens* : &forall; a . **Genlex [String]** &odot; GenlexFactory a &rarr; Parser [a] char

### Tokenizer

#### Tokenizer [String]
- *tokenize* : **Tokenizer [String]** &odot; Stream char &rarr; Try [Token]

-->

## License

Copyright (C)2016-2017 D. Plaindoux.

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
