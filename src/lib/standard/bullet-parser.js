/**
 * Created by Simon on 24/12/2016.
 */

import P from '../parsec/parser';
import stream from '../../lib/stream/index';
import T from '../../lib/standard/token';




function stop(){
    return P.eos.or(P.char('\n'));
}

function pureText(){
    return P.not(stop()).rep()
        .map(a=>a.join(''))
}

function bullet(){
    return P.string('* ')
        .thenRight(pureText())
        .map(a => ({bullet:a}))
}

function parseBullet( line, offset=0){
    return bullet().parse(stream.ofString(line), offset)
}

export default {
    bullet,

    parse(line){
        return parseBullet(line,0);
    }
}
