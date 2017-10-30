const {Stream, F, N, C, X} = require('@masala/parser');
const {assertFalse} = require('../../assert');


function A(){
    return C.char('A').then(B());
}

function B(){
    return C.char('B').or(F.lazy(A));
}


let hasException =false;
console.log('=== Building Parser ====');

try {
    const parser = A();
    console.log('=== GETTING THERE ====');
} catch (error) {
    hasException = true;
}

assertFalse(hasException);