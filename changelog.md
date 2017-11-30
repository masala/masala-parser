Changelog
====

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

* `F.startWith(value)`


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







