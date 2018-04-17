// (Token -> Option 'a) -> Parser 'a Token
import response from "../../lib/parsec/response";
import {F, N} from "../../lib/parsec";
import Option from "../../lib/data/option";
import stream from "../../lib/stream";

function literal(tokenise) {
    return F.parse((input, index) =>
        input
            .get(index)
            .map(value =>
                tokenise(value)
                    .map(token =>
                        response.accept(token, input, index + 1, true)
                    )
                    .orLazyElse(() =>
                        response.reject(input.location(index), false)
                    )
            )
            .lazyRecoverWith(() =>
                response.reject(input.location(index), false)
            )
    );
}

let numberToken = N.numberLiteral()
    .map(value => ({name:'number', value, precedence:500}))
    .debug('low number');

// Token -> Option 'a
let numberAccept = token => { // What is this token ?
    console.log('numberAccept token', token);
    token.name === 'number' ?
        Option.some({name:'number', value:token.value}):
        Option.none();
};

let tkNumber = literal(numberAccept);

console.log('new', tkNumber);

const parsing = tkNumber.parse(stream.ofString('3'));
console.log(parsing);