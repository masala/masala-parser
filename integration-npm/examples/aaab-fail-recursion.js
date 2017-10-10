const {stream, F, N, C, X} = require('parser-combinator');


function A(){
    return C.char('A').then(B());
}

function B(){
    return C.char('B').or(A());
}



console.log('=== Building Parser ====');
const parser = A();
console.log('=== NEVER THERE ====');
let parsing = parser.parse(stream.ofString('AAAAAB'));
console.log(parsing);

