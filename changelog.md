Changelog
====

0.6 -> 0.7
----

## Export

* Export is a bit better handled; no more doublon
* Exporting `Parser` instead of `parser`
* `ExtractorBundle` and `TokenBundle` are pruned (#96) 

# Functions





0.5 -> 0.6
----

## Response

* Added `response.isCompleted()`

## Parser

* `flatmap()` renamed to `flatMap()`

## Flow Bundle

* `F.lazy(parser, params, self )` accepts a third `this` parameter
* `F.sequence()` is deprecated


Added  to the FlowBundle

* `F.startsWith(value)`
* `F.moveUntil(string|stopParser)`
* `F.dropTo(string|stopParser)`







