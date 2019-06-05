import {Streams, F, C} from '@masala/parser'
import {assertTrue} from '../../assert';


const string = 'The quick brown fox jumps over the lazy dog';


function combinator() {
    return C.letters()
        .then(C.char(' '))
        .then(C.lowerCase().rep())
        .then(C.char(' '))
        .then(C.notString('romane').rep())
        .then(F.eos());
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertTrue(parsing.isAccepted());

