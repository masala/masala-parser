const {Stream, N, C, F, T} = require('../../build/lib/index');

const test = require('./test');



function operator(symbol) {
    return T.blank().thenRight(C.char(symbol)).thenLeft(T.blank());
}

function sum() {
    return N.integer.thenLeft(operator('+')).then(N.integer)
        .map(values => values[0] + values[1]);
}

function multiplication() {
    return N.integer.thenLeft(operator('*')).then(N.integer)
        .map(values => values[0] * values[1]);
}

function scalar() {
    return N.integer;
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());
}



function parseOperation(line) {
    return combinator().parse(Stream.ofString(line), 0);
}




test('sum: ', 4, parseOperation('2   +2').value);
test('multiplication: ', 6, parseOperation('2 * 3').value);
test('scalar: ', 8, parseOperation('8').value);


