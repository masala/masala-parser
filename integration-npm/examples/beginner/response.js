const {Streams, F, C } = require('@masala/parser');
const {assertTrue,assertFalse, assertEquals} = require('../../assert');


let response = C.char('a').rep().parse(Streams.ofString('aaaa'));
assertEquals(response.value.join(''), 'aaaa' );
assertEquals(response.offset, 4 )
assertTrue(response.isAccepted());
assertTrue(response.isEos());

// Partially accepted
response = C.char('a').rep().parse(Streams.ofString('aabb'));
assertEquals(response.value.join(''), 'aa' );
assertEquals(response.offset, 2 )
assertTrue(response.isAccepted());
assertFalse(response.isEos());