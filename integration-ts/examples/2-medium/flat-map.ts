import {Streams,  C, N} from '@masala/parser'
import {assertTrue} from '../../assert';




// Next char must be the double of the previous
function doubleNumber(param:number){
    return C.string(''+ (param*2) );
}

const combinator = N.digit()
                    .flatMap(doubleNumber);
let response = combinator.parse(Streams.ofString('12'));
assertTrue(response.isAccepted());

