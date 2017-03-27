import  {stream, N,C, F, T} from '../../dist/parser-combinator.min';

function operator(symbol) {
    return T.blank().thenRight(C.char(symbol)).thenLeft(T.blank());
}

function sum() {
    return N.integer.thenLeft(operator('+')).then(N.integer)
        .map(values=>values[0] + values[1]);
}

function multiplication() {
    return N.integer.thenLeft(operator('*')).then(N.integer)
        .map(values=>values[0] * values[1]);
}

function scalar(){
    return N.integer;
}

function combinator() {
    return F.try(sum())
        .or(F.try(multiplication()))    // or() will often work with try()
        .or(scalar());
}

function parseOperation(line) {
    return combinator().parse(stream.ofString(line), 0);
}

console.info('sum: ',parseOperation('2   +2').value);  // 4
console.info('multiplication: ',parseOperation('2 * 3').value); //6
console.info('scalar: ',parseOperation('8').value);  // 8


