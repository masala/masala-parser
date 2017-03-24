const {stream,F,C,N,} = require('../dist/parser-combinator.min');

const st = stream.ofString('12');
const parsing = N.numberLiteral.thenLeft(F.eos).parse(st);

if (parsing.value !== 12){
    throw "Illegal value parsed in prepublish integration test";
}else{
    console.log("=== Prepublish integration test ok ===")
}
