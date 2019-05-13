const {Streams, F, N, C, X} = require('@masala/parser');
const {assertTrue} = require('../../assert');


function A() {
    return C.char('A').then(B());
}

function B() {
    return C.char('B').or(A());
}


let hasException =false;

try {
    const parser = A();
} catch (error) {
    hasException = true;
}

assertTrue(hasException);