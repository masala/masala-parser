Parser Combinator: Flow Bundle
=====





### Repeat Danger

Two parsers with same repeat can causes problems.
Suppose we parse `(x) OR y`, which must be equivalent to `(  x  )   OR  y` 
 
* let say  parenthesis is acceptable for : `    )    ` with any space
* and 'OR' is acceptable for : `    OR    ` with **a least** one space

Then `    )    OR    ` will fail because ')' will take `    )    `, leaving the parser at the `OR    `
which needs at least a space before.

So it logically fails, and unfortunately these types of failures are pretty hard to debug.