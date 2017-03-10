const {stream,F,C,N,} = require('../dist/parser-combinator.min');

const st = stream.ofString('12');
const parsing = N.numberLiteral.thenLeft(F.eos).parse(st);

console.log(parsing.value===12);

/*
//import {F,C,N} from 'parsec/index';
const P = parsec.parser;
const T= parsec.standard.token;




const document = '12';
const stream = parsec.stream.ofString(document);

const parsing = P.numberLiteral.thenLeft(P.eos).parse(stream);
console.log(parsing.value===12);*/