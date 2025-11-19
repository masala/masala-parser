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

const parsing = floorCombinator.parse(Stream.ofChars('Hello World !!!'))
assertFalse(parsing.isAccepted(), 'Testing debug')
```
