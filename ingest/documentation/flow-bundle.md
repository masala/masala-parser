# Parser Combinator: Flow Bundle

## regex

F.regex(rgx) turns a JavaScript RegExp into a primitive parser. It supports
flags, look-ahead and all native JavaScript regex features.

```js
function assignParser() {
    const identifier = F.regex(/[a-zA-Z_][a-zA-Z0-9_]*/)
    const space = F.regex(/\s+/)
    const assign = C.string(':=')
    return identifier
        .then(space.optrep().drop())
        .then(assign)
        .then(space.optrep().drop())
        .then(identifier)
}
```

## Lazy

In functional programming, we call a lazy function a function that does not
evaluate immediately its argument. It's called lazy because it will run only
when needed.

In masala-parser, we use this concept to avoid infinite recursion. When we build
the parser, we don't know what is the input. And the recursion will end
depending on the input offset.

In that example, we would have an infinite recursion without lazy:

```js
function A() {
    return C.char('A').then(B())
}

function B() {
    return C.char('B').or(F.lazy(A))
}
```

Some parameters might be needed. In this case, params must be \*\*packed in an
array.

```js
function A(param) {
    return C.char(param).then(B())
}

function B() {
    return C.char('B').or(F.lazy(A), ['A'])
}
```

In some case, your parser is a function of a class, and this class must access
to `this`. A third parameter allows you to define who is `this`.

```js
class SomeLazyParser {
    constructor(char) {
        this.char = char
    }

    // first needs to know who is 'this'
    first() {
        return C.char(this.char).then(
            this.second()
                .opt()
                .map((opt) => opt.orElse('')),
        )
    }

    // Lazy call
    second() {
        return C.char('B').then(F.lazy(this.first, ['A'], this))
    }
}

const combinator = new SomeLazyParser('A').first().then(F.eos().drop())
```

## Extraction

`F.moveUntil(string|string[]|parser, include=false)` allows to quickly find data
in a document. `F.dropTo(string|parser)` will do the same, but dropping the
content.

```js
const line = Stream.ofChars('I write until James Bond appears')

const combinator = F.moveUntil(C.string('James'))
    .then(F.dropTo('appears'))
    .then(F.eos().drop())
const value = combinator.parse(line).value

test.equals(value, 'I write until ') // include set to false by default
```
