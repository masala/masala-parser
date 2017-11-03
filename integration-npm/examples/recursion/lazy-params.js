const {Streams, F, C} = require('@masala/parser');
const {assertFalse} = require('../../assert');


function A(param){
    return C.char(param).then(B());
}

function B(){
    return C.char('B').or(F.lazy(A), ['A']);
}


let hasException =false;

try {
    const parser = A('A');
} catch (error) {
    hasException = true;
}

assertFalse(hasException);