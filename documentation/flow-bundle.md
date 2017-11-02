Parser Combinator: Flow Bundle
=====



### List

rep() will produce a List of values. You can get the more standard array value by calling `list.array()` 



Extraction
---


```js
const line = Streams.ofString('I write until James Bond appears');

const combinator = F.moveUntil(C.string('James'))
    .then(F.dropTo('appears'))
    .then(F.eos.drop())
const value = combinator.parse(line).value;

test.equals(value, 'I write until ');

```




### Repeat Danger

Two parsers with same repeat can causes problems.
Suppose we parse `(x) OR y`, which must be equivalent to `(  x  )   OR  y` 
 
* let say  parenthesis is acceptable for : `    )    ` with any space
* and 'OR' is acceptable for : `    OR    ` with **a least** one space

Then `    )    OR    ` will fail because ')' will take `    )    `, leaving the parser at the `OR    `
which needs at least a space before.

So it logically fails, and unfortunately these types of failures are pretty hard to debug.



Moreover, it can cause neverending running code: https://github.com/d-plaindoux/masala-parser/issues/81