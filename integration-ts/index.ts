/**
 * Created by Nicolas Zozol on 13/10/2017.
 */

import * as masala from './masala';
import {Stream, C, F} from '../src/lib/index'
import {assertArrayEquals, assertEquals} from '../integration-npm/assert';


// Only char
let stream:masala.Stream<string> = Stream.ofString('abc');
let start:masala.Parser<string> = C.char('a');

const charsParser = start
    .then(C.char('b'))
    .then(C.char('c'));
    //.then(F.eos.drop()); // End Of Stream ; droping its value, just checking it's here
let parsing = charsParser.parse(stream);

const x  = ['a', 'b', 'c'] === parsing.value;





