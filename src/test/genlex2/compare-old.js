import stream from "../../lib/stream";
import N from "../../lib/parsec/numbers-bundle";
import C from "../../lib/parsec/chars-bundle";
import option from "../../lib/data/option";
import F from "../../lib/parsec/flow-bundle";
import response from "../../lib/parsec/response";
import unit from "../../lib/data/unit";


class Token {
    constructor() {
    }

    keyword() {
        return option.none();
    }

    ident() {
        return option.none();
    }

    number() {
        return option.none();
    }

    string() {
        return option.none();
    }

    char() {
        return option.none();
    }
}

class TKNumber extends Token {
    constructor(value) {
        super();
        this.value = value;
        console.log('creating a tkNumber', value);
    }

    number() {
        console.log('number()', this.value);
        return option.some(this.value);
    }
}

class TKChar extends Token {
    constructor(value) {
        super();
        this.value = value;
        console.log('creating a tkChar', value);
    }

    char() {
        return option.some(this.value);
    }
}


// Exemple of date => value is Date() from js or moment.js
// Token: identifier + parser + mapper


function genlexNumber(f) {
    return N.numberLiteral().map(f.number);
}

// GenLexFactory 'a -> Parser 'a char
function genlexChar(f) {
    return C.charLiteral().map(f.char);
}

function genlexTokens(f) {
    return genlexNumber(f).or(genlexChar(f)).debug('token found');
}
function tokensBetweenSpaces(f) {
    return spaces().drop().then(genlexTokens(f)).then(spaces().drop());
}


const builder = { //mapper ?
    number: value => {
        console.log('creating the tkNumber', value);
        return new TKNumber(value)
    },
    char: value => new TKChar(value)
};

const tokenizer = tokensBetweenSpaces(builder);
console.log('===== tokenizer generated ====', tokenizer);

const parser = {
    number: literal(token => token.number()),
    char: literal(token => token.char()),
};

const grammar = parser.number.debug('parsed number').rep();


console.log('grammar', grammar);

const parsing = tokenizer.chain(grammar.then(F.eos().drop())).parse(stream.ofString('34 23'));
console.log(parsing);




function literal(tokenise) {

    return F.parse((input, index) =>
    {
        return input
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
    }
    );
}


function spaces() {
    return C.charIn(' \r\n\f\t').optrep().debug('spaces').map(() => unit);
}

