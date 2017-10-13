import * as masala from './masala';
import {Stream, F, C} from '../src/lib/index'



let stream:masala.Stream<string> = Stream.ofString('abc');
let parser:masala.Parser<string> = C.char('a');
const parsing = parser.parse(stream);
const x  = ['a', 'b', 'c'] === parsing.value; //compiling, types are almost OK

