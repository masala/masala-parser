import {Streams, F, C, N} from '@masala/parser'
import {assertTrue} from "../../assert";

const combinator =  F.try(N.number())
    .or(C.string('hello'))
    .or(C.string('goodbye'));

let response = combinator.parse(Streams.ofString('goodbye'));
assertTrue(response.isAccepted());


const first = C.char('a').then(C.char('a')).thenEos();

const second = C.string('aa').thenEos();

const successInput = 'aa';

const layer = F.layer(first).and(second);

response = layer.parse(Streams.ofString(successInput));

assertTrue(response.isAccepted());