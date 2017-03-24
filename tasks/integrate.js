//{stream,F,C,N,}
const parsec = require('../dist/parser-combinator.min');
const stream = parsec.stream;
const F = parsec.F;
const N=parsec.N;


const st = stream.ofString('12');
const parsing = N.numberLiteral.thenLeft(F.eos).parse(st);

if (parsing.value !== 12){
    throw "Illegal value parsed in prepublish integration test";
}else{
    console.log("=== Prepublish integration test ok ===")
}
