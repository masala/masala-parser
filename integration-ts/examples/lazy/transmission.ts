import {Streams, F, C,  SingleParser} from '@masala/parser'
import {assertTrue} from '../../assert';


/**
 * A gives its VALUE to B using flatMap
 */
function A(char:string):SingleParser<string>{
    return C.char(char.toUpperCase()).rep().flatMap(B);
}


/**
 * There is recursion, and we call A with lazy. We send PARAMETERS to A
 * within an array
 */
function B(aVal:Array<string>) {
    return C.char('B').map(bVal=> aVal.join('')+'-'+bVal).or(F.lazy(A, ['a']));
}



const parser = A('a');

const str = 'AAAB';
const stream = Streams.ofString(str);
const parsing = parser.parse(stream);

assertTrue(parsing.offset === str.length);
