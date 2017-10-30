const {Stream, F, N, C, X} = require('@masala/parser');
const {assertFalse} = require('../../assert');


function A() {
    return C.char('A').map(x=>{console.log(x);return x;}).flatmap(B);
}

function B(aVal) {
    return C.char('B').map(bVal=>aVal+'-'+bVal).or(F.lazy(A));
}



const parser = A();

const str = 'AAAB';
const stream = Stream.ofString(str);
const parsing = parser.parse(stream);

console.log(parsing.offset === str.length? true:parsing.offset);
console.log(parsing.value);

//F.startsWith()
//F.dropTo()
//F.moveUntil()
// rename F.nop() to F.nop
// parsing.isCompleted()