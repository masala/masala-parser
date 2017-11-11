


import {Streams, F, C,Option, N, SingleParser} from '@robusta/trash'
import {assertFalse, assertTrue} from '../../assert';

function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function a(){
    return C.char('a');
}

const string = 'Xabx';



function combinator() {
    return F.not(day()).then(F.not(a())).then(F.not(day()));
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertFalse(parsing.isAccepted());
assertTrue(parsing.offset === 2);

