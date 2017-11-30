import {Streams, F, C,Option, N, SingleParser} from '@robusta/trash'
import {assertFalse, assertTrue} from '../../assert';

function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function a(){
    return C.char('a');
}

const string = '-MONDAY-';



function combinator() {
    return F.any().then(day()).then(F.nop()).then(F.any()).then(F.eos());
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertTrue(parsing.isAccepted());
assertTrue(parsing.isConsumed());

