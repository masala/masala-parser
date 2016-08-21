/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import parser from '../parsec/parser';
import response from '../parsec/response';
import option  from '../data/option';

class Token {

    constructor(){
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

class TKKeyword extends Token{

    constructor(value) {
        super();
        this.value = value;
    }

    keyword() {
        return option.some(this.value);
    }
}

class TKIdent extends Token{
    constructor(value) {
        super();
        this.value = value;
    }

    ident() {
        return option.some(this.value);
    }
}

class TKNumber extends Token{

    constructor (value) {
        super();
        this.value = value;
    }

    number() {
        return option.some(this.value);
    }
}

class TKString extends Token{

    constructor(value) {
        super();
        this.value = value;
    }

    string() {
        return option.some(this.value);
    }
}

class TKChar extends Token{

    constructor(value) {
        super();
        this.value = value;
    }

    char() {
        return option.some(this.value);
    }
}

// (Token -> Option 'a) -> Parser 'a Token
function literal(tokenise) {
    return parser.parse((input, index) => {
        return input.get(index).map((value) => {
            return tokenise(value).map((token) => response.accept(token, input, index+1, true))
                                  .orLazyElse(() => response.reject(input.location(index), false));   
        }).lazyRecoverWith(() => response.reject(input.location(index), false));
    });
}

const token = {
    builder: {
        keyword: (value) => new TKKeyword(value),
        ident: (value) => new TKIdent(value),
        number: (value) => new TKNumber(value),
        string: (value) => new TKString(value),
        char: (value) => new TKChar(value)
    },
    parser: {
        keyword : literal((token) => token.keyword()),
        ident : literal((token) => token.ident()),
        number : literal((token) => token.number()),
        string : literal((token) => token.string()),
        char : literal((token) => token.char())
    }
};

export default token;
