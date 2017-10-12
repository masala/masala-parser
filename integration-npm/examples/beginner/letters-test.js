const {C, Stream} = require('parser-combinator');
const {assertEquals, assertTrue, assertFalse} = require('../../assert');


charProblems = '÷×'; // ÷247 aka \u00F7 ; x : 215  aka '\u00D7'

let utf8Code = '×'.charCodeAt(0);
let hexString = (215).toString(16);
let number = parseInt('00D7', 16);
console.log(utf8Code, hexString, number);

console.log(/[a-z]{1}/.test('a'));

assertTrue(/^[A-Za-z\u00C0-\u017F]+$/.test('aeARáüñArEœÿ'));
assertFalse(/^(?![\u00F7])[A-Za-z\u00C0-\u017F]+$/.test('÷aeARáüñArEœÿ'));
assertTrue(/^(?![\u00F7])[A-Za-z\u00C0-\u017F]+$/.test('aeARáüñArEœÿ'));

assertTrue(/^[A-Za-z\u00C0-\u017F]+$/.test('×'));

assertTrue(/^(?![\u00F7\u00D7])[A-Za-z\u00C0-\u017F^\u00F7]+$/.test('aeARáüñArEœÿ'));
assertFalse(/^(?![\u00F7\u00D7])[A-Za-z\u00C0-\u017F^\u00F7]+$/.test('÷aeARáüñArEœÿ'));
assertFalse(/^(?![\u00F7\u00D7])[A-Za-z\u00C0-\u017F^\u00F7]+$/.test('×aeARáüñArEœÿ'));




