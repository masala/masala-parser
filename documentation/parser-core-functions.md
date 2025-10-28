# Parser Object :

- It reads a stream of characters
    - The parser has functions to validate the stream
    - You can build your Parser by adding specific functions
- The Parser is a monoid
    - It wraps one (and only one) **value**
    - It has some functions to work on that value

## Streaming inputs

- The Parser is constructed with a Streaming function
- The Parser will consume **elements** form the stream
- The stream will stop if the Parser can't match the next element
    - state of the Parser will be `Rejected`
- If the Stream finishes, state of the Parser is `Accepted`
- Once a **element** is **consumed**, the Parser can't go back
    - this allows speed and above all low memory use

## Parser constructor

Usually, you would **NOT** create a Parser from its constructor. You will
combine **existing parsers** to create a new one. However it can solve specific
problems when combining existing parser is too difficult or not efficient.

```js
const newParser = new Parser(parseFunction)
// But don't do that, except if you know what you are doing
```

- construct a Parser object
- `parseFunction` is a streaming function
    - reads characters at a given index
    - can end the stream
- the `parseFunction` function will determine the behaviour of the Parser

Here is an example of a home-made parser for going back after an Accept:
[https://github.com/d-plaindoux/masala-parser/issues/138#issuecomment-49162720
5]

# Essential Parser functions

### then

- Construct a Tuple of values from previous accepted values

```js
let stream = Streams.ofChars('abc')
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos().drop()) // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream)
assertEquals(parsing.value, 'abc')
```

### drop()

- Uses `then()` and returns only the left or right value

```js
const stream = Streams.ofChars('|4.6|')
const floorCombinator = C.char('|')
    .drop()
    .then(N.number()) // we have ['|',4.6], we keep 4.6
    .then(C.char('|').drop()) // we have [4.6, '|'], we keep 4.6
    .map((x) => Math.floor(x))

// Masala needs a stream of characters
const parsing = floorCombinator.parse(stream)
assertEquals(4, parsing.value, 'Floor parsing')
```

`then()` and `drop()` will often be used to find the right value in your data.

### map(f)

- Change the value of the response

```js
const stream = Streams.ofChars('5x8')
const combinator = N.integer()
    .then(C.charIn('x*').drop())
    .then(N.integer())
    // values are [5,8] : we map to its multiplication
    .map((values) => values[0] * values[1])
assertEquals(combinator.val(stream), 40)
```

### returns(value)

- Forces the value at a given point
- It's a simplification of map

```js
const stream = Streams.ofChars('ab')
// given 'ac', value should be ['X' , 'c']
const combinator = C.char('a').returns('X').then(C.char('b'))
assertEquals(combinator.val(stream).array(), ['X', 'b'])
```

It could be done using `map()`, but `returns()` is more direct:

```js
const combinator = C.char('a')
    .map((anyVal) => 'X')
    .then(C.char('c'))
```

### thenEos()

- Test if the stream reaches the end of the stream

```js
const combinator = C.char('a')
C.char('a').thenEos()
```

It's important to note that the value will be moved in a Tuple, which is always
the case in a `thenXYZ` function

So if the parsing is accepted, the value will be `Tuple(['a'])`

### any()

- next character will always work
- consumes a character

### opt()

- Allows optional use of a Parser
- Internally used for `optrep()` function

```js
const P = parser
// ok for 'ac' but also 'abc'
C.char('a').opt(C.char('b')).char('c')
```

### rep()

- Ensure a parser is repeated **at least** one time

```js
const stream = Streams.ofChars('aaa')
const parsing = C.char('a').rep().parse(stream)
test.ok(parsing.isAccepted())
// We need to call list.array()
test.deepEqual(parsing.value.array(), ['a', 'a', 'a'])
```

`rep()` will produce a `List` of values. You can get the more standard array
value by calling `list.array()`

### optrep

- A Parser can be repeated zero or many times

```js
// ok for 'ac' but also 'abbbbbc'
C.char('a').optrep(C.char('b')).char('c')
```

There is a known issue with optrep: optrep().optrep() or optrep().rep() will
cause an infinite loop !

# Useful but touchy

`try()` and `or()` are useful, and work often together. `or()` alone is not
difficult, but it's harder to understand when it must work with `try()`

### or()

- Essential

`or()` is used to test a parser, and if it fails, it will try the next one

```js
const endLiner = C.char('\n').or(F.eos())
const parser = F.moveUntil(endLiner.drop())
```

This case is straightforward, but it can be more complex when the parser eats
while testing or().

```js
const eater = C.char('a').then(C.char('a'))
const parser = eater.or(C.char('b'))

const stream = Streams.ofChars('ab')
const parsing = parser.parse(stream)
expect(parsing.isAccepted()).toBe(false)
expect(parsing.offset).toBe(1) // ✨ this is the point ! one 'a' is consumed

const nonEater = F.try(eater).or(C.char('b')) // use this to allow backtracking
```

Because Masala is a fast LL(1) parser, it will try to move forward by default.

### partial and full backtracking: F.try().or() and F.tryAll()

- Essential !
- Try a succession of parsers
- If success, then continues
- If not, jump after the succession, and continues with `or()`

```js
const typical = F.try(x).or(y) // still no backtrack on or(y)
const manyOr = F.tryAll([x, y, z]) // same as try(x).or(try(y)).or(try(z))
```

### flatMap (f )

`flatMap` lets later parsing depend on earlier results. It runs a parser, then
feeds its value into `f(result)` to build the next parser—ideal for
context-sensitive checks and cross-references

Use `flatMap()` when plain sequencing isn’t enough.

- parameter f is a function
- Used when reading a data depends on previous data

Example of use case, where one author is given a rating

```
authors:Nicolas  # nameParser
Nicolas:5     # ratingParser
```

Here, `Nicolas` must be included in both lines to have a proper parsing.

Suppose we have a general `nameParser`, then a `ratingParser` could be used like
this:

```typescript
const separator = C.char(':')
const end = C.char('\n').opt()

const nameParser: SingleParser<string> = C.string('authors')
    .then(separator.drop())
    .then(C.letters())
    .then(end.drop())
    .last()

const ratingParser = (
    name: string, // name is from previous parsing
) =>
    C.letters()
        .filter((val: string) => val.includes(name)) // check name match
        .then(separator.drop())
        .then(
            F.not(end)
                .rep()
                .map((chars) => chars.join('')),
        )

const parser = nameParser.flatMap(ratingParser)

const string = `authors:Nicolas\nNicolas:5`
const value = parser.val(string)
expect(value.array()).toEqual(['alice', '5'])
```

It can help you to read your document knowing what happen previously

### filter (predicate)

- To be used once a value is defined
- `predicate` is a function pVal -> boolean
- Check if the stream satisfies the predicate
    - Parse will be `Rejected` if filter is `false`

        'expect (filter) to be accepted': function(test) {
        test.equal(parser.char("a").filter(a => a === 'a')
        .parse(Streams.ofChars("a")).isAccepted(), true, 'should be accepted.');
        }

### match (matchValue)

- Simplification of `filter()`
- Check if the stream value is equal to the _matchValue_

                            //given 123
                            N.number().match(123)

### error()

- Forces an error
- The parser will be `rejected`

### satisfy(predicate)

- Used internally by higher level functions
- If predicate is true, consumes a element from the stream, and the value is set
  to the element
- If predicate is false, the element is not consumed
