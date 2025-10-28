# Masala Parser: Javascript Parser Combinators

[![npm version](https://badge.fury.io/js/%40masala%2Fparser.svg)](https://badge.fury.io/js/%40masala%2Fparser)
[![Coverage Status](https://coveralls.io/repos/d-plaindoux/masala-parser/badge.png?branch=master)](https://coveralls.io/r/d-plaindoux/masala-parser?branch=master)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Masala Parser is inspired by the paper titled:
[Direct Style Monadic Parser Combinators For The Real World](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf).

Masala Parser is a Javascript implementation of the Haskell **Parsec**. It is
plain Javascript that works in the browser, is tested with more than 500 unit
tests, covering 100% of code lines.

### Use cases

- It can create a **full parser from scratch**
- It can extract data from a big text and **replace complex regexp**
- It works in any **browser**
- There is a **incredible typescript** api
- It can validate complete structure with **variations**
- It's a great starting point for parser education. It's **way simpler than Lex
  & Yacc**.
- It's designed to be written in other languages (Python, Java, Rust) with the
  same interface
- Masala Parser has some **good performances** in speed and memory

Masala Parser shines for **simplicity**, **variations** and **maintainability**
of your parsers. You won't need theoretical bases on languages for extraction or
validation use cases.

Masala Parser has relatively good performances, however, Javascript is obviously
not the fastest machine.

# Usage

With Node Js or modern build

        npm install -S @masala/parser

Or in the browser

- [download Release](https://github.com/d-plaindoux/masala-parser/releases)
- `<script src="masala-parser.min.js"/>`

Check the [Change Log](./changelog.md) if you can from a previous version.

# Reference

You will find an
[Masala Parser online reference](http://www.robusta.io/masala-parser/ts/modules/_masala_parser_d_.html),
generated from typescript interface.

# Quick Examples

## Hello World

Let's parse `Hello World`

```js
const helloParser = C.string('Hello')
const white = C.char(' ')
const worldParser = C.string('World')
const combinator = helloParser.then(white.rep()).then(worldParser)
```

## Floor notation

`|4.2|` is a mathematical notation that removes the digits after `.` So |4.2|
== 4.

```js
// N: Number Bundle, C: Chars Bundle
import { Stream, N, C } from '@masala/parser'

const stream = Stream.ofChars('|4.6|')
const floorCombinator = C.char('|')
    .drop()
    .then(N.number()) // we have ['|', 4.6], we drop '|'
    .then(C.char('|').drop()) // we have [4.6, '|'], we keep [4.6]
    .single() // we had [4.6], now just 4.6
    .map((x) => Math.floor(x))

// The parser parses a stream of characters
const parsing = floorCombinator.parse(stream)
assertEquals(4, parsing.value, 'Floor parsing')
```

## Parsing tokens

You can parse a stream of tokens, not only characters. Let's parse a date from
tokens.

```js
import { Stream, C, F, GenLex } from '@masala/parser'

const genlex = new GenLex()

const [slash] = genlex.keywords(['/'])
// 1100 is the precedence of the token
const number = genlex.tokenize(N.digits(), 'number', 1100)

let dateParser = number
    .then(slash.drop())
    .then(number)
    .then(slash.drop())
    .then(number)
    .map(([day, , month, year]) => ({
        day: day,
        month: month,
        year: year,
    }))
```

You will then be able to combine this date parser with other parsers that use
the tokens.

Overall, using GenLex and tokens is more efficient than using characters for
complex grammars.

## Explanations

We create small simple parsers, with a set of utilities (`C`, `N`, `optrep()`,
`map()`, ...), then we create a more complex parser that combine them.

According to Wikipedia _"in functional programming, a parser combinator is a
higher-order function that accepts several parsers as input and returns a new
parser as its output."_

## The Parser

Let's say we have a document :

> > > The James Bond series, by writer Ian Fleming, focuses on a fictional
> > > British Secret Service agent created in 1953, who featured him in twelve
> > > novels and two short-story collections. Since Fleming's death in 1964,
> > > eight other authors have written authorised Bond novels or novelizations:
> > > Kingsley Amis, Christopher Wood, John Gardner, Raymond Benson, Sebastian
> > > Faulks, Jeffery Deaver, William Boyd and Anthony Horowitz.

The parser could fetch every name, ie two consecutive words starting with
uppercase. The parser will read through the document and aggregate a Response,
which contains a value and the current offset in the text.

This value will evolve when the parser will meet new characters, but also with
some function calls, such as the `map()` function.

![](./documentation/parsec-monoid.png)

## The Response

By definition, a Parser takes text as an input, and the Response is a structure
that represents your problem. After parsing, there are two subtypes of
`Response`:

- `Accept` when it found something.
- `Reject` if it could not.

```js
let response = C.char('a').rep().parse(Stream.ofChars('aaaa'))
assertEquals(response.value.join(''), 'aaaa')
assertEquals(response.offset, 4)
assertTrue(response.isAccepted())
assertTrue(response.isConsumed())

// Partially accepted
response = C.char('a').rep().parse(Stream.ofChars('aabb'))
assertEquals(response.value.join(''), 'aa')
assertEquals(response.offset, 2)
assertTrue(response.isAccepted())
assertFalse(response.isConsumed())
```

## Building the Parser, and execution

Like a language, the parser is built then executed. With Masala, we build using
other parsers.

```js
const helloParser = C.string('hello')
const white = C.char(' ')
const worldParser = C.char('world')
const combinator = helloParser.then(white.rep()).then(worldParser)
```

There is a compiling time when you combine your parser, and an execution time
when the parser runs its `parse(stream)` function. You will have the `Response`
after parsing.

So after building, the parser is executed against a stream of token. For
simplicity, we will use a stream of characters, which is a text :)

## Hello Gandhi

The goal is to check that we have Hello 'someone', then to grab that name

```js
// Plain old javascript
import { Stream, C } from '@masala/parser'

var helloParser = C.string('Hello')
    .then(C.char(' ').rep())
    .then(C.letters()) // succession of A-Za-z letters
    .last() // keeping previous letters

var value = helloParser.val('Hello Gandhi') // val(x) is a shortcut for parse(Stream.ofChars(x)).value;

assertEquals('Gandhi', value)
```

# Parser Combinations

Let's use a real example. We combine many functions that return a new Parser.
And each new Parser is a combination of Parsers given by the standard bundles or
previous functions.

```js
import { Stream, N, C, F } from '@masala/parser'

const blanks = () => C.char(' ').optrep()

function operator(symbol) {
    return blanks()
        .drop()
        .then(C.char(symbol)) // '+' or '*'
        .then(blanks().drop())
        .single()
}

function sum() {
    return N.integer()
        .then(operator('+').drop())
        .then(N.integer()) // then(x) creates a tuple - here, one value was dropped
        .map((tuple) => tuple.at(0) + tuple.at(1))
}

function multiplication() {
    return N.integer()
        .then(operator('*').drop())
        .then(N.integer())
        .array() // we can have access to the value of the tuple
        .map(([left, right]) => left * right) // more modern js
}

function scalar() {
    return N.integer()
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication())) // or() will often work with try()
        .or(scalar())
}

function parseOperation(line) {
    return combinator().parse(Stream.ofChars(line))
}

assertEquals(4, parseOperation('2   +2').value, 'sum: ')
assertEquals(6, parseOperation('2 * 3').value, 'multiplication: ')
assertEquals(8, parseOperation('8').value, 'scalar: ')
```

A curry paste is a higher-order ingredient made from a good combination of
spices.

![](./documentation/images/curry-paste.jpg)

## Precedence

Precedence is a technical term for priority. Using:

```js
function combinator() {
    return F.try(sum())
        .or(F.try(multiplication())) // or() will often work with try()
        .or(scalar())
}

console.info('sum: ', parseOperation('2+2').value)
```

We will give priority to sum, then multiplication, then scalar. If we had put
`scalar()` first, we would have first accepted `2`, then what could we do with
`+2` alone ? It's not a valid sum ! Moreover `+2` and `-2` are acceptable
scalars.

## try(x).or(y)

`or()` will often be used with `try()`, that makes
[backtracking](https://en.wikipedia.org/wiki/Backtracking) : it saves the
current offset, then tries an option. And as soon that it's not satisfied, it
goes back to the original offset and use the parser inside the `.or(P)`
expression.`.

Like Haskell's Parsec, Masala Parser can parse infinite look-ahead grammars but
performs best on predictive LL(1) grammars.

Let see how with `try()`, we can look a bit ahead of next characters, then go
back:

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

We have the same problem with pure text. Let's parse `monday` or `money`

    const parser = C.string('monday').or('money')
    const result = parser.val('money')
                                  ^will stop ready `monday` at `e`

The result will be undefined, because the parser will not find `monday` neither
`money`. The good parser is:

    const parser = F.try(C.string('monday')).or('money')

When failing reading `monday`, the parser will come back to `m`

# Recursion

Masala-Parser (like Parsec) is a top-down parser and doesn't like
[Left Recursion](https://cs.stackexchange.com/a/9971).

However, it is a resolved problem for this kind of parsers, with a lot of
documentation. You can read more on
[recursion with Masala](./documentation/recursion.md), and checkout examples on
our Github repository (
[simple recursion](https://github.com/d-plaindoux/masala-parser/blob/master/integration-npm/examples/recursion/aaab-lazy-recursion.js),
or
[calculous expressions](https://github.com/d-plaindoux/masala-parser/blob/master/integration-npm/examples/operations/plus-minus.js)
).

# Simple documentation of Core bundles

## Core Parser Functions

Here is a link for
[Core functions documentation](./documentation/parser-core-functions.md).

It will explain `then()`, `drop()`, `map()`, `rep()`, `opt()` and other core
functions of the Parser with code examples.

###

## The Chars Bundle

Example:

```js
C.char('-').then(C.letters()).then(C.char('-'))
// accepts  '-hello-' ; value is ['-','hello','-']
// reject '-hel lo-' because space is not a letter
```

[General use](./documentation/chars-bundle.md)

- `letter()`: accept a european letter (and moves the cursor)
- `letters()`: accepts many letters and returns a string
- `letterAs(symbol)`: accepts a european(default), ascii, or utf8 Letter.
  [More here](./documentation/chars-bundle.md)
- `lettersAs(symbol)`: accepts many letters and returns a string
- `emoji()`: accept any emoji sequence.
  [Opened Issue](https://github.com/d-plaindoux/masala-parser/issues/86).
- `notChar(x)`: accept if next input is not `x`
- `char(x)`: accept if next input is `x`
- `charIn('xyz')`: accept if next input is `x`, `y` or `z`
- `charNotIn('xyz')`: accept if next input is not `x`, `y` or `z`
- `subString(length)`: accept any next _length_ characters and returns the
  equivalent string
- `string(word)`: accept if next input is the given `word`
- `stringIn(words)`: accept if next input is the given `words`
  [More here](./documentation/chars-bundle.md)
- `notString(word)`: accept if next input is _not_ the given `word`
- `charLiteral()`: single quoted char element in C/Java : `'a'` is accepted
- `stringLiteral()`: double quoted string element in java/json: `"hello world"`
  is accepted
- `lowerCase()`: accept any next lower case inputs
- `upperCase()`: accept any next uppercase inputs

Other example:

```js
C.string('Hello').then(C.char(' ')).then(C.lowerCase().rep().join(''))

// accepts Hello johnny ; value is ['Hello', ' ', 'johnny']
// rejects Hello Johnny : J is not lowercase ; no value
```

## The Numbers Bundle

- `number()`: accept any float number, such as -2.3E+24, and returns a float
- `digit()`: accept any single digit, and returns a **number**
- `digits()`: accept many digits, and returns a **number**. Warning: it does not
  accept **+-** signs symbols.
- `integer()`: accept any positive or negative integer

## The Flow Bundle

The flow bundle will mix ingredients together.

For example, if you have a Parser `p`, `F.not(p)` will accept anything that does
not satisfy `p`

All of these functions will return a brand new Parser that you can combine with
others.

Most important:

- `F.try(parser).or(otherParser)`: Try a parser and come back to `otherParser`
  if failed
- `F.any()`: Accept any character (and so moves the cursor)
- `F.not(parser)`: Accept anything that is not a parser. Often used to accept
  until a given _stop_
- `F.eos()`: Accepted if the Parser has reached the **E**nd **O**f **S**tream
- `F.moveUntil(string|stopParser)`: Alternative for **regex**. Will traverse the
  document **until** the _stop parser_
    - returns `undefined` if _stop_ is not found
    - returns all characters if _stop_ is found, and set the cursor at the spot
      of the stop
- `F.dropTo(string|stopParser)`: Will traverse the document **including** the
  _stop parser_

Others:

- `F.lazy(parser, ?params)`: Makes a lazy evaluation. May be used for Left
  recursion (difficult)
- `F.parse(parserFunction)`: Create a new Parser from a function. Usually, you
  won't start here.
- `F.subStream(length)`: accept any next characters
- `F.returns(value)`: forces a returned value
- `F.error()`: returns an error. Parser will never be accepted
- `F.satisfy(predicate)`: check if condition is satisfied
- `F.startsWith(value)`: create a no-op parser with initial value

## License

Copyright (C)2016-2025 Didier Plaindoux & Nicolas Zozol

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free
Software Foundation; either version 2, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along
with this program; see the file COPYING. If not, write to the Free Software
Foundation, 675 Mass Ave, Cambridge, MA 02139, USA.
