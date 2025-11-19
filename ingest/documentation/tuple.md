# Tuple and TupleParser

## Tuple

A tuple is a data structure that contains a sequence of elements, each of which
can be of a different type. In Masala Parser, Tuples are used to group related
data together and are particularly useful for handling parser results.

The very special thing of tuple is that they merge together (see below).

Most examples will show the types, but they are usually automatically inferred.

### Creating Tuples

There are two main ways to create a tuple:

```typescript
// Create an empty tuple
const emptyTuple: EmptyTuple = tuple()

// Create a tuple from an array
const numberTuple: Tuple<number> = tuple([1, 2, 3])

// tuples are immutable. Adding elements will create a new tuple
const more: Tuple<number> = numberTuple.append(4)
```

### Tuple Interface

The Tuple interface provides several methods for working with the contained
values:

```typescript
export interface Tuple<T> {
    // The underlying array of values
    value: T[]

    isEmpty(): boolean
    size(): number

    // Get first element (throws if empty)
    single(): T

    // Get all elements as an array
    array(): T[]

    last(): T
    first(): T
    at(index: number): T

    // Join elements with optional separator
    join(separator?: string): string

    // Append elements or other tuples
    append(neutral: NEUTRAL): this
    append<Y>(other: Tuple<Y>): Tuple<T | Y>
    append<Y>(element: Y): Tuple<T | Y>
}
```

An EmptyTuple is a Tuple that contains the `NEUTRAL` value. It looks unusual,
but this information was needed to ensure proper merging.

### Examples

```typescript
// Basic tuple operations
const t1 = tuple(['a', 'b', 'c'])
console.log(t1.size()) // 3
console.log(t1.first()) // 'a'
console.log(t1.last()) // 'c'
console.log(t1.at(1)) // 'b'
console.log(t1.join('-')) // 'a-b-c'

// Combining tuples
const t2 = tuple(['x', 'y'])
const combined = t1.append(t2)
console.log(combined.array()) // ['a', 'b', 'c', 'x', 'y']

// Single value access
const singleTuple = tuple(['value'])
console.log(singleTuple.single()) // 'value'
```

## Type inference

Thought the library is written in pure javascript, a .d.ts provides the typing
and Tuples are typed as follows:

```typescript
const t = tuple() // Create an EmptyTuple
const nTuple = empty.append(2) // Create a Tuple<number>
const mixedTuple = nTuple.append('a') // Create a MixedTuple<number | string>
```

There are three types of Tuples:

1. **EmptyTuple**: Represents an empty tuple with no elements.
2. **Tuple<T>**: Represents a tuple containing elements of type T.
3. **MixedTuple<FIRST, LAST>**: Specify the first and last element types

Defining correctly MixedTuples is important as Parsers often drop most elements.

Types of `first()` and `last()` are also inferred.

```typescript
const first: number = mixedTuple.first() // number 2
const last = mixedTuple.last() // string 'a', no need to specify type
```

## Tuple merge with Tuple

That's the very power of Tuples.

- Adding a `number` ot a `Tuple<number>` will still be a `Tuple<number>`.
- Adding a string to a `Tuple<number>` will create a
  `MixedTuple<number , string>`.
- Adding a `Tuple<number>` to a `Tuple<number>` NOT be a
  `Tuple<number , Tuple<number>>` but still a `Tuple<number>`.

```typescript
const tuple1: Tuple<number> = tuple([1, 2, 3])
const tuple2: Tuple<number> = tuple([4, 5, 6])
const merged: Tuple<number> = tuple1.append(tuple2)
expect(merged.first()).toBe(1)
expect(merged.last()).toBe(6)
expect(merged.at(3)).toBe(4)
```

Therefore, a Tuple<T> merged with an EmptyTuple will still be a Tuple<T>.
