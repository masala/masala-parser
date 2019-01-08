import {Streams, F, C, N} from '@masala/parser'
import {assertEquals, assertFalse, assertTrue} from '../../assert';

let combinator = C.charNotIn('abc').rep();
// will accept x, y, and z but will stop at 'b'
let response = combinator.parse(Streams.ofString('xyzb'));


assertEquals(response.offset,3 );
assertEquals(response.value.join(), 'xyz');


combinator = C.charIn('abc').rep().thenEos();
response = combinator.parse(Streams.ofString('acbaba'));
assertEquals(response.value.join(), 'acbaba');

