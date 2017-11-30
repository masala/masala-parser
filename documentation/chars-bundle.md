Parser Combinator: Chars Bundle
=====

General Use
----

Using Only Chars

```js
const {Streams, F, C } = require('@masala/parser');

let stream = Streams.ofString('abc');
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos().drop()); // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream);

assertArrayEquals(['a', 'b', 'c'], parsing.value);
```

Or just using `C.letter` and `rep()`:


```js
stream = Streams.ofString('Hello World');
const letterParser = C.letter.rep()  // 'Hello'
    .then(C.char(' '))  // space is not a letter
    .then(C.letter.rep()); // 'World'

parsing = letterParser.parse(stream);
console.log(parsing.value);
//[ List { value: [ 'H', 'e', 'l', 'l', 'o' ] },' ',List { value: [ 'W', 'o', 'r', 'l', 'd' ] } ]
// Well, complicated value ; Note that rep() returns a masala-List structure
```

We can improve our control by using the right function at the right time. Here,
Using `C.letters` and `C.string`

```js
stream = Streams.ofString('Hello World');
const helloParser = C.string('Hello')
    .then(C.char(' '))
    .then(C.letters);

parsing = helloParser.parse(stream);
assertArrayEquals(['Hello',' ','World'], parsing.value);
```



Detailed functions
----

### `letterAs(symbol)`:

```js
import {Streams, F, C } from 'masala-parser';

assertTrue(C.letterAs().parse(Streams.ofString('a')).isAccepted());
assertTrue(C.letterAs(C.OCCIDENTAL_LETTER).parse(Streams.ofString('a')).isAccepted());
assertTrue(C.letterAs(C.UTF8_LETTER).parse(Streams.ofString('Б')).isAccepted());
assertTrue(!C.letterAs(C.OCCIDENTAL_LETTER).parse(Streams.ofString('÷')).isAccepted());
```

### stringIn

```js
stream = Streams.ofString('James');
const combinator = C.stringIn(['The', 'James', 'Bond', 'series']);
parsing = combinator.parse(stream);
assertEquals('James', parsing.value);
```