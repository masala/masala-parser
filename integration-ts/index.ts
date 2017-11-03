/**
 * Created by Nicolas Zozol on 13/10/2017.
 */

import * as masala from './masala';
import Bundles from '@masala/parser';

// Can I get rid of this line ?
let {Stream, F, C}:masala.Bundles = Bundles;

let stream = Stream.ofString('abc');
let parser= C.char('a');
const parsing = parser.parse(stream);
const x  = 'a' === parsing.value; //compiling, types are almost OK






