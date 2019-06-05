const {Streams, F, N, C, X} = require('@masala/parser');
const {assertFalse} = require('../../assert');


function A(){
    return C.char('A').then(B());
}

function B(){
    return C.char('B').or(F.lazy(A));
}


let hasException =false;

try {
    const parser = A();
} catch (error) {
    hasException = true;
}

assertFalse(hasException);