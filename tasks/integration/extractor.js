// Plain old ES

const {Stream,  X}= require('../../build/lib/index');
// The goal is check that we have Hello 'something', then to grab that something

const line = Stream.ofString("Hello 'World'");

var x = new X({moreSeparators: `'`});
const helloParser = x.words(false) // false because we don't keep spaces
                    .map(x.last);

const value = helloParser.parse(line).value;
// C.letter.rep() will giv a array of letters
if (value !== 'World'){
    throw('Extractor integration failure')
}

