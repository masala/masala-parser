import {Streams, F, C} from '@masala/parser'
import { assertTrue} from '../../assert';

function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}


const string = '-MONDAY-';



function combinator() {
    return F.any().then(day()).then(F.nop()).then(F.any()).eos();
}

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertTrue(parsing.isAccepted());
assertTrue(parsing.isEos());

