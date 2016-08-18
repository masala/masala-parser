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
    return parser.parse(function(input, index) {
        return input.get(index).map(function(value) {
            return tokenise(value).map(function(token){
                return response.accept(token, input, index+1, true);
            }).orLazyElse(function() {
                return response.reject(input.location(index), false);
            });
        }).lazyRecoverWith(function() {
            return response.reject(input.location(index), false);
        });
    });
}

const token = {
    builder: {
        keyword: function (value) {
            return new TKKeyword(value);
        },
        ident: function (value) {
            return new TKIdent(value);
        },
        number: function (value) {
            return new TKNumber(value);
        },
        string: function (value) {
            return new TKString(value);
        },
        char: function (value) {
            return new TKChar(value);
        }
    },
    parser: {
        keyword : literal(function(token) {
            return token.keyword();
        }),
        ident : literal(function(token) {
            return token.ident();
        }),
        number : literal(function(token) {
            return token.number();
        }),
        string : literal(function(token) {
            return token.string();
        }),
        char : literal(function(token) {
            return token.char();
        })
    }
};

export default token;
