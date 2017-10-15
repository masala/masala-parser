import * as masala from './masala';
import {Stream, F, C} from '../src/lib/index'

import{ assertTrue} from '../integration-npm/assert';

let stream: masala.Stream<string> = Stream.ofString('abc');
let parser: masala.SingleParser<string> = C.char('a');
let arrayParser = parser.then(C.char('b'))//.map(x=>x+'yop');
let parsing = arrayParser.parse(stream);

assertTrue(['a', 2] === parsing.value[0]) ; //compiling, types are almost OK


parser = C.char('a');

let charParsing = parser.parse(Stream.ofString('a'));
let charParsingValue = charParsing.value;
assertTrue(charParsingValue === 'a');


let singleParsing = parser.parse(stream);
assertTrue( 'a' === singleParsing.value); //compiling, types are almost OK


parser = C.char('a');
singleParsing = parser.parse(stream);
assertTrue( ['a', 'b', 'c'] === parsing.value); //compiling, types are almost OK
