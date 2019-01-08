import {Streams, F, C, N} from '@masala/parser'
import {assertEquals, assertFalse, assertTrue} from '../../assert';

let combinator = N.digit().occurrence(5);
let response = combinator.parse(Streams.ofString('55555'));

assertEquals(response.value.size(),5 );

// we are looking for 5,5,5 then 55
combinator = N.digit().occurrence(3).then(N.number());
response = combinator.parse(Streams.ofString('55555'));

assertTrue(response.isAccepted());
assertEquals(response.value.last(),55);


/**
 * Occurence with a Tuple parser
 */
let parser = C.char('a').then (C.char('b')).occurrence(3);
let resp = parser.parse(Streams.ofString('ababab'));

console.log(resp);

