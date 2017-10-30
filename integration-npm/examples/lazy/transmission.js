const {Stream, F, N, C, X} = require('@masala/parser');
const {assertTrue} = require('../../assert');


/**
 * A gives its VALUE to B using flatMap
 */
function A(char) {
    return C.char(char.toUpperCase()).rep().flatmap(B);
}


/**
 * There is recursion, and we call A with lazy. We send PARAMETERS to A
 * within an array
 */
function B(aVal) {
    console.log('>>>>',aVal);
    return C.char('B').map(bVal=> aVal.join('')+'-'+bVal).or(F.lazy(A, ['a']));
}



const parser = A('a');

const str = 'AAAB';
const stream = Stream.ofString(str);
const parsing = parser.parse(stream);

assertTrue(parsing.offset === str.length);

//F.startsWith()
//F.dropTo()
//F.moveUntil()
// rename F.nop() to F.nop
// parsing.isCompleted()