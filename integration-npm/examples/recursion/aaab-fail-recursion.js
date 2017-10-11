const {Stream, F, N, C, X} = require('parser-combinator');
const {assertTrue} = require('../../assert');


function A() {
    return C.char('A').then(B());
}

function B() {
    return C.char('B').or(A());
}


let hasException =false;
console.log('=== Building Parser ====');

try {
    const parser = A();
    console.log('=== NEVER THERE ====');
} catch (error) {
    hasException = true;
}

assertTrue(hasException);