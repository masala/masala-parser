Difference between Parser.then() and Parser.thenRight()

```js
p1.thenRight(p2) === p1.drop().then(p2)
```

Difference between Parser.then() and Parser.thenLeft()

```js
p1.thenLeft(p2) === p1.then(p2.drop())
```
