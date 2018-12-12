import {Streams, F, C,Option, N, SingleParser} from '@masala/parser'
import {assertFalse} from '../../assert';

function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function blank(){
    return C.char(' ').rep().returns(' ');
}

const separator = () => C.string('---');

function emptyTry() {
    return F.try(C.string('xyz'));
}

function optAlternative() {
    return C.string('xyz').opt()
}

function combinator() {

    return day()
        .then(blank()).rep()
        .then(separator())
        .then(optAlternative().map(x=>x.orElse('12')))//.debug('we pass the option', false)
        .then(emptyTry())//.debug('we pass the try', false)
        .then(day());

}

const string = 'TUESDAY      THURSDAY  TUESDAY  ---FRIDAY';

let stream = Streams.ofString(string);
let parsing = combinator().parse(stream);

assertFalse(parsing.isAccepted());
