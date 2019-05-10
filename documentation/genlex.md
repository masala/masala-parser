Genlex Todos
=====

* tokens: as seen with other parsers, token functions should not be called to early
 or it will start a lot of unnecessary functions.
* class Token very strange
* each token should have a decent toString()
* 



Equivalence
=====

For simple case

        let genlex = new GenLex();
        genlex.setSeparatorsParser(eol().then(eol().rep()));
        const tkBullets = genlex.tokenize(bulletBlock(), 'bulletBlock',500);
        const parser = F.any().rep();
        
        
Is equivalent to

        let separators = eol().then(eol().rep());                
        let any = separators.optrep().then(bulletBlock()).then(separators.optrep());
        let parser = any.rep();
        

So it might be good to use the second form if stuck when debugging with Genlex. 

GenLex is more interesting when the parser is not `F.any()`.