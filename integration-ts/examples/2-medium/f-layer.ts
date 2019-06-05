import {Streams, F, C, N} from '@masala/parser'
import {assertTrue} from "../../assert";

const combinator =  F.try(N.number())
    .or(C.string('hello'))
    .or(C.string('goodbye'));

let response = combinator.parse(Streams.ofString('goodbye'));
assertTrue(response.isAccepted());


const first = C.char('a').then(C.char('a')).eos();

const second = C.string('aa').eos();

const successInput = 'aa';

const layer = F.layer(first).and(second);

let layerResponse = layer.parse(Streams.ofString(successInput));

assertTrue(layerResponse.isAccepted());
