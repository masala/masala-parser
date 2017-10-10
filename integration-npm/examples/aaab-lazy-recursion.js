const {stream, F, N, C, X} = require('parser-combinator');

function A(){
    return C.char('A').then(B());
}

function B(){
    return C.char('B').or(F.lazy(A));
}


console.log('=== Building Parser ====');
const parser = A();
console.log('=== GETTING THERE ====');
let parsing = parser.parse(stream.ofString('AAAAAB'));
console.log(parsing);

