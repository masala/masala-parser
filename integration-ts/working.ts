import * as masala from './masala';
import {Stream, F, C} from '@masala/parser'

import{assertArrayEquals, assertEquals, assertTrue} from './assert';

let stream: masala.Stream<string> = Stream.ofString('ab');
let parser: masala.SingleParser<string> = C.char('a');
let arrayParser = parser.then(C.char('b'))//.map(x=>x+'yop');
let parsing = arrayParser.parse(stream);

assertArrayEquals(['a', 'b'], parsing.value) ; //compiling, types are almost OK


parser = C.char('a');

let charParsing = parser.parse(Stream.ofString('a'));
let charParsingValue = charParsing.value;
assertTrue(charParsingValue === 'a');


let singleParsing = parser.parse(stream);
assertTrue( 'a' === singleParsing.value); //compiling, types are almost OK


parser = C.char('a');
singleParsing = parser.parse(stream);
assertEquals( 'a' , singleParsing.value); //compiling, types are almost OK
