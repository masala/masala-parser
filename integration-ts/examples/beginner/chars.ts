import {Streams, F, C, N} from '@robusta/trash'
import {assertEquals} from '../../assert';


/**
 * Created by Nicolas Zozol on 05/11/2017.
 */
const stream = Streams.ofString('abc');
const charsParser = C.char('a')
    .then(C.char('b'))
    .then(C.char('c'))
    .then(F.eos().drop()); // End Of Stream ; droping its value, just checking it's here
let charsParsing = charsParser.parse(stream);
assertEquals('abc', charsParsing.value.join(''), 'Chars parsing');

