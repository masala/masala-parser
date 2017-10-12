const {Stream, F, C} = require('parser-combinator');
const {assertFalse} = require('../../assert');

function day() {
    return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
}

function blank() {
    return C.char(' ').rep().thenReturns(' ');
}

const separator = () => C.string('---');

function emptyTry() {
    return F.try(C.string('xyz'));
}

function optAlternative() {
    return C.string('xyz').opt();
}

function combinator() {

    return day()
        .then(blank()).rep()
        .then(separator())
        .then(optAlternative())//.debug('we pass the option', false)
        .then(emptyTry())//.debug('we pass the try', false)
        .then(day());

}

const string = 'TUESDAY      THURSDAY  TUESDAY  ---FRIDAY';

let myStream = Stream.ofString(string);
let parsing = combinator().parse(myStream);

assertFalse(parsing.isAccepted());

/**
 Conclusion:

 Using emptyTry, it fails. We try, but the try leads to nothing.
 Using optAlternative(), there is obviously a success
 */