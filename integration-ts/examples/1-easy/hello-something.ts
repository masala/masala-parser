import {Streams, C} from '@masala/parser'
import {assertEquals, assertArrayEquals, assertTrue} from '../../assert';



const helloParser = C.string("Hello")
                    .then(C.char(' ').rep())
                    .then(C.char("'")).drop()
                    .then(C.letter().rep()) // keeping repeated ascii letters
                    .then(C.char("'").drop());    // keeping previous letters

const parsing = helloParser.parse(Streams.ofString("Hello 'World'"));
// C.letter.rep() will giv a array of letters



assertArrayEquals(['W','o','r','l','d'], parsing.value.array(), "Hello World joined");


// Note that helloParser will not reach the end of the stream; it will stop at the space after People
const peopleParsing = helloParser.parse(Streams.ofString("Hello 'People' in 2017"));

assertEquals("People", peopleParsing.value.join(''), "Hello People joined");
assertTrue(peopleParsing.offset < "Hello People in 2017".length, "Bad Offset for Hello People");

