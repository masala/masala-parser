Parser Combinator: Chars Bundle
=====

General Use
----

Using Only Chars

```js
const {Stream, F, C } = require('masala-parser');

const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos.drop()); // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(Stream.ofString('abc'));

assertArrayEquals(['a', 'b', 'c'], parsing.value);
```

Or just using `C.letter` and `rep()`:


```js
const letterParser = C.letter.rep()  // 'Hello'
    .then(C.char(' '))  // space is not a letter
    .then(C.letter.rep()); // 'World'

parsing = letterParser.parse(Stream.ofString('Hello World'));
console.log(parsing.value);
//[ List { value: [ 'H', 'e', 'l', 'l', 'o' ] },' ',List { value: [ 'W', 'o', 'r', 'l', 'd' ] } ]
// Well, complicated value ; Note that rep() returns a masala-List structure
```

We can improve our control by using the right function at the right time. Here,
Using `C.letters` and `C.string`

```js
const helloParser = C.string('Hello')
    .then(C.char(' '))
    .then(C.letters);

parsing = helloParser.parse(Stream.ofString('Hello World'));
assertArrayEquals(['Hello',' ','World'], parsing.value);
```



Detailed functions
----

### `letterAs(symbol)`:

```js
import {Stream, F, C } from 'masala-parser';

assertTrue(C.letterAs().parse(Stream.ofString('a'), 0).isAccepted());
assertTrue(C.letterAs(C.OCCIDENTAL_LETTER).parse(Stream.ofString('a')).isAccepted());
assertTrue(C.letterAs(C.UTF8_LETTER).parse(Stream.ofString('Б')).isAccepted());
assertTrue(!C.letterAs(C.OCCIDENTAL_LETTER).parse(Stream.ofString('÷')).isAccepted());
```

### stringIn

```js
stream = Stream.ofString('James');
const combinator = C.stringIn(['The', 'James', 'Bond', 'series']);
parsing = combinator.parse(stream);
assertEquals('James', parsing.value);
```