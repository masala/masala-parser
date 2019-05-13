Changelog
====

0.7 ->0.8: Using Tuples with then
---

* Any then() and thenXYZ() function call will return a `Tuple` . This tuple has `single()` and `array()` methods to get value.
`Parser.drop()`, `F.nop()` methods will produce a *Neutral element* for that Tuple : it will be ignored.
* Therefore `thenReturns()` is renamed `returns()`.
* `rep()` and `optrep()` will also produce a Tuple
    - combination of `rep()` and `then()` will produce one unique Tuple
    - you can *break apart* this tuple using `Parser.array()` at any point if needed
* `GenLex` has been totally refactored and simplified for high level parsers on tokens.
* Typescript interface is operational and `masala-parser.d.ts` documentation will generate Masala Parser reference.

Less important :

* `F.layer()` along with `Parser.and()` produces an array of results when all parsers are satisfied.
    - it makes backtracking like `F.try()` with `Parser.or()`
    - warning: it's still experimental for side cases
* Bug correction on offset for high level parsers.
    - Random Access in `ParserStream` will result in unpredicted value. Don't do it.



0.6 -> 0.7: Typescript support
----

This release has been focused on typescript support.

## Export

* Export is a bit better handled; no more doublon
* Exporting `Parser` instead of `parser`
* `ExtractorBundle` and `TokenBundle` are pruned (#96) 

# Functions

Every parser in CharBundle, FlowBundle and NumberBundle need to be called as a function
    
        //Previously
        const p = C.letter.then(N.integer).then(F.eos);
        
        // Now:
        const p = C.letter().then(N.integer()).then(F.eos());
        
It's less funky, but it avoids construction of Parsers at import statement, before writing the first line code.        

### FlowBundle

* `F.startWith(value)`: Creates a Parser with a defined value
* `F.sequence()` is pruned


### Typescript and @types

Automated types are enabled with a partial declaration file. Basically, all functions of Parser, CharBundle, 
NumberBundle and FlowBundle are supported, but Genlex is not yet. 0.8 release will be focused on Genlex.



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







