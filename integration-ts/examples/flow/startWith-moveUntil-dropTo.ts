import {Streams, F, C} from '@masala/parser'
import { assertTrue} from '../../assert';

const string = 'The quick brown fox jumps over the lazy dog';



function combinator() {
    return F.startWith('hello: ')
        .then(F.moveUntil('brown'))
        .then(C.string('brown'))
        .then(F.dropTo('dog'))
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertTrue(parsing.isAccepted());
assertTrue(parsing.value.join('') === 'hello: The quick brown');
assertTrue(string.length === parsing.offset);

