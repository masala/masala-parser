

import {Streams, F, C, N} from '@robusta/trash'

import {assertEquals} from '../assert';



let stream= Streams.ofString('|4.6|');
const floorCombinator = C.char('|').drop()
    .then(N.numberLiteral)    // we have ['|',4.6], we keep 4.6
    .then(C.char('|').drop())   // we have [4.6, '|'], we keep 4.6
    .map(x =>Math.floor(x));

// Parsec needs a stream of characters
let parsing = floorCombinator.parse(stream);
assertEquals( 4, parsing.value, 'Floor parsing');



 stream = Streams.ofString('abc');
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos.drop()); // End Of Stream ; droping its value, just checking it's here
let charsParsing = charsParser.parse(stream);
assertEquals( 'abc', charsParsing.value.join(''), 'Chars parsing');