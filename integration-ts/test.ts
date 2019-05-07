import {C} from '@masala/parser'

import{assertArrayEquals,  assertTrue} from './assert';
import {launchMarkdown} from "./examples/markdown/test/markdown-tests";

let parser = C.char('a');
let arrayParser = parser.then(C.char('b'));
assertArrayEquals(['a', 'b'], arrayParser.val('ab').array()) ; //compiling, types are OK


parser = C.char('a');
assertTrue(parser.val('a') === 'a');


launchMarkdown();