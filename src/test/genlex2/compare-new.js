// (Token -> Option 'a) -> Parser 'a Token
import response from "../../lib/parsec/response";
import {F, N} from "../../lib/parsec";
import option from "../../lib/data/option";
import stream from "../../lib/stream";
import C from "../../lib/parsec/chars-bundle";
import unit from "../../lib/data/unit";

/*
let numberToken = N.numberLiteral()
    .map(value => ({name: 'number', value, precedence: 500}))
    .debug('low number');

// Token -> Option 'a
let numberAccept = token => { // What is this token ?
    console.log('numberAccept token', token);
    token.name === 'number' ?
        Option.some({name: 'number', value: token.value}) :
        Option.none();
};
*/



class NewToken {

    constructor(name, value) {
        console.log('creating new Token ', value);
        this.name = name;
        this.value = value;
    }

    // Or for Parser ?
    precedence() {

    }

    /* Or just map ? */
    mapper(mapper) {
        this.mapper = mapper;
    }


    accept(name) {
        return this.name === name ? option.some(this.value) : option.none();
    }
}

class TokenParser {
    constructor(parser, mapper = x => x, tokenName) {
        this.parser = parser;
        this.mapper = mapper;
        this.tokenName = tokenName;

    }

    map(mapper, self = this.parser) {
        this.parser = this.parser.map(mapper.bind(self));
    }

}


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

// TkNUmber replaced by NewToken
/*
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
*/
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


function genlexNumber() {
    return N.numberLiteral().map(value => new NewToken('number',value));
}


function genlexDate() {
    return date().map(date => new NewToken('date', date))
}

// GenLexFactory 'a -> Parser 'a char
function genlexChar() {
    return C.charLiteral().map(c => new NewToken('char', c));
}

function genlexTokens() {
    return F.try(genlexDate()) // need a try...
        .or(genlexNumber())
        .or(genlexChar()).debug('token found');
}

function tokensBetweenSpaces() {
    return spaces().drop().then(genlexTokens()).then(spaces().drop());
}

/*
const builder = { //mapper ?
    number: value => {
        console.log('creating the tkNumber', value);
        return new NewToken('number', value);
        //return new TKNumber(value)
    },
    char: value => new TKChar(value)
};*/

const tokenizer = tokensBetweenSpaces();
console.log('===== tokenizer generated ====', tokenizer);

const parser = {
    number: literal(token => {
        console.log('in number literal acceptance');
        // instead of token.number() ; the function name is a parameter
        return token.accept('number')
    }),
    char: literal(token => token.char()),
    date:literal(token=>{
        console.log('in date literal acceptance');
        // instead of token.number() ; the function name is a parameter
        return token.accept('date')
    })
};

const newParser={
    number:literal(token => token.accept())
};



const grammar = parser.date.debug('parsed date')
    .then(parser.number.debug('parsed number').rep());



const parsing = tokenizer.chain(grammar.then(F.eos().drop()))
    .parse(stream.ofString('10/12/2013 34 23'));
console.log('>>>>', parsing.value);


function literal(tokenise) {

    return F.parse((input, index) => {
            return input
                .get(index)
                .map(value =>{
                    console.log('tokenizing', value);
                    return tokenise(value)
                        .map(token =>
                            response.accept(token, input, index + 1, true)
                        )
                        .orLazyElse(() =>
                            response.reject(input.location(index), false)
                        )
                }
                )
                .lazyRecoverWith(() =>
                    response.reject(input.location(index), false)
                )
        }
    );
}


function spaces() {
    return C.charIn(' \r\n\f\t').optrep().map(() => unit);
}

function date() {
    return N.digits()
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits())
        .then(C.charIn('-/').thenReturns('-'))
        .then(N.digits())
        .map(dateValues => dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray => dateArray.join(''));
}