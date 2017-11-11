Changelog
====

0.6 -> 0.7
----

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







