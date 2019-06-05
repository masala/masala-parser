const {Streams, N, C, F} = require('../../build/lib/index');

const {assertEquals} = require('../../integration-npm/assert');

const blanks = ()=>C.char(' ').optrep();

function operator(symbol) {
    return blanks().thenRight(C.char(symbol)).thenLeft(blanks()).single();
}

function sum() {
    return N.integer().thenLeft(operator('+')).then(N.integer())
        .array()
        .map(values => values[0] + values[1]);
}

function multiplication() {
    return N.integer().thenLeft(operator('*')).then(N.integer())
        .array()
        .map(values => values[0] * values[1]);
}

function scalar() {
    return N.integer();
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());
}

function parseOperation(line) {
    return combinator().parse(Streams.ofString(line));
}




assertEquals(4, parseOperation('2   +2').value, 'sum: ');
assertEquals(6, parseOperation('2 * 3').value, 'multiplication: ');
assertEquals(8, parseOperation('8').value, 'scalar: ');


