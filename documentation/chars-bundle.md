# Parser Combinator: Chars Bundle

## General Use

Using Only Chars

```js
import { Streams, F, C } from '@masala/parser'

let stream = Streams.ofChars('abc')
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos().drop()) // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream)

assertArrayEquals(['a', 'b', 'c'], parsing.value)
```

Or just using `C.letter` and `rep()`:

```js
stream = Streams.ofChars('Hello World')
const letterParser = C.letter
    .rep() // 'Hello'
    .then(C.char(' ')) // space is not a letter
    .then(C.letter.rep()) // 'World'

parsing = letterParser.parse(stream)
console.log(parsing.value)
//[ List { value: [ 'H', 'e', 'l', 'l', 'o' ] },' ',List { value: [ 'W', 'o', 'r', 'l', 'd' ] } ]
// Well, complicated value ; Note that rep() returns a masala-List structure
```

We can improve our control by using the right function at the right time. Here,
Using `C.letters` and `C.string`

```js
stream = Streams.ofChars('Hello World')
const helloParser = C.string('Hello').then(C.char(' ')).then(C.letters)

parsing = helloParser.parse(stream)
assertArrayEquals(['Hello', ' ', 'World'], parsing.value)
```

## Detailed functions

### `letterAs(symbol)`:

```js
import { Streams, F, C } from 'masala-parser'

assertTrue(C.letterAs().parse(Streams.ofChars('a')).isAccepted())
assertTrue(
    C.letterAs(C.OCCIDENTAL_LETTER).parse(Streams.ofChars('a')).isAccepted(),
)
assertTrue(C.letterAs(C.UTF8_LETTER).parse(Streams.ofChars('Б')).isAccepted())
assertTrue(
    !C.letterAs(C.OCCIDENTAL_LETTER).parse(Streams.ofChars('÷')).isAccepted(),
)
```

### stringIn

```js
stream = Streams.ofChars('James')
const combinator = C.stringIn(['The', 'James', 'Bond', 'series'])
parsing = combinator.parse(stream)
assertEquals('James', parsing.value)
```

### inRegexRange

C.inRegexRange(range) converts one character-class into a single–character
parser. The argument can be either a raw range string `a-zA-Z_` or a RegExp
`/[0-9A-Fa-f]/`. Internally it is anchored with ^…$, so the parser always
consumes exactly one code unit.

```js
let stream = Streams.ofChars('myUser')

//identifier parser-> myUser: ok ; 0myUser: not ok
const firstChar = C.inRegexRange('a-zA-Z_')
const restChars = C.inRegexRange('a-zA-Z0-9_').rep()
const identifier = firstChar.then(restChars)
```

For complex regex, you will probably prefer `F.regex()`.
