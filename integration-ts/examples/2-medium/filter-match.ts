import {Streams, F, C, N} from '@masala/parser'
import {assertEquals, assertFalse, assertTrue} from '../../assert';

let combinator = N.digit().filter(m => m>=5).rep();
// The parser willl accept first 3 numbers
let response = combinator.parse(Streams.ofString('5672'));
assertEquals(response.value.size(), 3);


/**
 * Match allow to find the right number
 */
let parser = N.number().match(55);
// The parser willl accept first 3 numbers
let res = parser.parse(Streams.ofString('55'));
assertEquals(res.value, 55);

res = parser.parse(Streams.ofString('555'));
assertFalse(res.isAccepted());




