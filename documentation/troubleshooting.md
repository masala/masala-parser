# Troubleshooting

## Debug

- Every Parser has a `debug(comment, showValue)` function
- If the parser is Accepted at this point, the debug comment shows off

```js
const floorCombinator = C.string('Hello')
    .then(C.string(' World'))
    .debug('Found')
    .then(C.string('fail'))
    .debug('wont be displayed', true)

const parsing = floorCombinator.parse(Streams.ofChar('Hello World !!!'))
assertFalse(parsing.isAccepted(), 'Testing debug')
```

## Stack Overflow

RangeError: Maximum call stack size exceeded at Try.lazyRecoverWith
(/Users/nicorama/code/products/parsec/parsec/src/lib/data/try.js:83:20)

???
