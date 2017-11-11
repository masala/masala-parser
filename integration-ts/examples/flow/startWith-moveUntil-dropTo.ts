import {Streams, F, C,Option, N, SingleParser} from '@robusta/trash'
import {assertFalse, assertTrue} from '../../assert';

const string = 'The quick brown fox jumps over the lazy dog';



function combinator() {
    return F.startWith('hello: ')
        .then(F.moveUntil('brown'))
        .then(C.string('brown'))
        .then(F.dropTo(F.eos()));
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertFalse(parsing.isAccepted());
assertTrue(parsing.offset === 2);
assertTrue(parsing.value.join('') === 'hello: The quick brown');

