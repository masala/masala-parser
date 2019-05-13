const {Streams,  C, F, N}= require('../../build/lib/index');
const test = require('./test');


const st = Streams.ofString('12');
const parsing = N.number().thenLeft(F.eos()).single().parse(st);

test("Simple number parsing", 12, parsing.value);