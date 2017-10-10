const {stream, F, N, C, X} = require('parser-combinator');


function day() {
    const x = new X()
    return x.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
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
        .then(separator()
        .then(optAlternative().debug('we pass the option'))
        .then(emptyTry().debug('we pass the try')))
        .then(day());

}

const string = 'TUESDAY      THURSDAY  TUESDAY  ---FRIDAY';

let myStream = stream.ofString(string);
let parsing = combinator().parse(myStream);
console.log('length', string.length);
console.log(parsing);

/**
 Conclusion:

 Using emptyTry, it fails. We try, but the try leads to nothing.
 Using optAlternative(), there is obviously a success
 */