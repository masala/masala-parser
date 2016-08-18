/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

/*
 * Parsec: Direct Style Monadic Parser Combinators For The Real World
 *
 * http://research.microsoft.com/en-us/um/people/daan/download/papers/parsec-paper.pdf
 */


import  stream from '../stream/index.js';
import unit from '../data/unit.js';
import option from '../data/option.js';
import response from "./response";


/**
 * Parser class
 */
class Parser{

    // (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
    constructor(parse){
        this.parse = parse;
    }

    // Parser 'a 'c => ('a -> Parser 'b 'c) -> Parser 'b 'c
    flatmap(f) {
        return bind(this, f);
    }

    // Parser 'a 'c => ('a -> 'b) -> Parser 'b 'c
    map(f) {
        var self = this;

        return new Parser(function (input, index) {
            return self.parse(input, index).map(f);
        });
    }

    // Parser 'a 'c => ('a -> boolean) -> Parser 'a 'c
    filter(p) {
        var self = this;

        return new Parser(function (input, index) {
            return self.parse(input, index).filter(p);
        });
    }

    // Parser 'a 'c => Comparable 'a -> Parser 'a 'c
    match(v) {
        return this.filter(function (a) {
            return a === v;
        });
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser ('a,'b) 'c
    then(p) {
        return this.flatmap(function (a) {
            return p.map(function (b) {
                return [a, b];
            });
        });
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'a 'c
    thenLeft(p) {
        return this.then(p).map(function (r) {
            return r[0];
        });
    }

    // Parser 'a 'c => 'b -> Parser 'b 'c
    thenReturns(v) {
        return this.thenRight(returns(v));
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'b 'c
    thenRight(p) {
        return this.then(p).map(function (r) {
            return r[1];
        });
    }

    // Parser 'a 'c -> Parser 'a 'c
    or(p) {
        return choice(this, p);
    }

    // Parser 'a 'c => unit -> Parser (Option 'a) 'c
    opt() {
        return this.map(option.some).or(returns(option.none()));
    }


    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    rep() {
        return repeatable(this, function () {
            return true;
        }, function (l) {
            return l !== 0;
        });
    }

    // Parser 'a 'c => number -> Parser (List 'a) 'c
    occ(occurrence) {
        return repeatable(this, function (l) {
            return l < occurrence;
        }, function (l) {
            return l === occurrence;
        });
    }

    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    optrep() {
        return repeatable(this, function () {
            return true;
        }, function () {
            return true;
        });
    }

    // Parser 'a 'c => Parser 'b 'a -> Parser 'b 'c
    chain(p) {
        var self = this;

        return new Parser(function (input, index) {
            return p.parse(stream.buffered(stream.ofParser(self, input)), index);
        });
    }
}


// Response 'a 'c -> ('a -> Parser 'b 'c) -> Response 'b 'c
function bindAccepted(accept_a, f) {
    return f(accept_a.value).parse(accept_a.input, accept_a.offset).fold(
        function (accept_b) {
            return response.accept(
                accept_b.value,
                accept_b.input,
                accept_b.offset,
                accept_a.consumed || accept_b.consumed
            );
        },
        function (reject_b) {
            return response.reject(
                accept_a.input.location(reject_b.offset),
                accept_a.consumed || reject_b.consumed
            );
        }
    );
}

// Parser 'a 'c -> ('a -> Parser 'b 'c) -> Parser 'b 'c
function bind(self, f) {
    return new Parser(function (input, index) {
        return self.parse(input, index).fold(
            function (accept_a) {
                return bindAccepted(accept_a, f);
            },
            function (reject_a) {
                return reject_a;
            }
        );
    });
}

// Parser 'a 'c -> Parser 'a 'c -> Parser 'a 'c
function choice(self, f) {
    return new Parser(function (input, index) {
        return self.parse(input, index).fold(
            function (accept) {
                return accept;
            },
            function (reject) {
                if (reject.consumed) {
                    return reject;
                } else {
                    return f.parse(input, index);
                }
            }
        );
    });
}


// Parser 'a 'c -> unit -> Parser (List 'a) 'c
function repeatable(self, occurrences, accept) {
    return new Parser(function (input, index) {
        var consumed = false,
            value = [],
            offset = index,
            current = self.parse(input, index);

        while (current.isAccepted() && occurrences(value.length)) {
            value.push(current.value);
            consumed = consumed || current.consumed;
            offset = current.offset;

            current = self.parse(input, offset);
        }

        if (accept(value.length)) {
            return response.accept(value, input, offset, consumed);
        }

        return response.reject(offset, consumed);
    });
}


/*
 * Builders
 */

// (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c
function parse(p) {
    return new Parser(p);
}

// (('b -> Parser 'a 'c) * 'b)-> Parser 'a 'c
function lazy(p, parameters) {
    return new Parser(function (input, index) {
        return p.apply(null, parameters).parse(input, index);
    });
}

// 'a -> Parser 'a 'c
function returns(v) {
    return new Parser(function (input, index) {
        return response.accept(v, input, index, false);
    });
}

// unit -> Parser 'a 'c
function error() {
    return new Parser(function (input, index) {
        return response.reject(input.location(index), false);
    });
}

// unit -> Parser unit 'c
function eos() {
    return new Parser(function (input, index) {
        if (input.endOfStream(index)) {
            return response.accept(unit, input, index, false);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// ('a -> boolean) -> Parser a 'c
function satisfy(predicate) {
    return new Parser(function (input, index) {
        return input.get(index).filter(predicate).map(function (value) {
            return response.accept(value, input, index + 1, true);
        }).lazyRecoverWith(function () {
            return response.reject(input.location(index), false);
        });
    });
}

// Parser 'a 'c -> Parser 'a 'c
function doTry(p) {
    return new Parser(function (input, index) {
        return p.parse(input, index).fold(
            function (accept) {
                return accept;
            },
            function (reject) {
                return response.reject(input.location(reject.offset), false);
            }
        );
    });
}

// unit -> Parser 'a 'c
function any() {
    return satisfy(function () {
        return true;
    });
}

// Parser 'a ? -> Parser 'a 'a
function not(p) {
    return doTry(p).then(error()).or(any());
}

// unit -> Parser char char
function digit() {
    return satisfy(function (v) {
        return '0' <= v && v <= '9';
    });
}

// unit -> Parser char char
function lowerCase() {
    return satisfy(function (v) {
        return 'a' <= v && v <= 'z';
    });
}

// unit -> Parser char char
function upperCase() {
    return satisfy(function (v) {
        return 'A' <= v && v <= 'Z';
    });
}

// unit -> Parser char char
function letter() {
    return satisfy(function (v) {
        return ('a' <= v && v <= 'z') || ('A' <= v && v <= 'Z');
    });
}

// char -> Parser char char
function char(c) {
    if (c.length !== 1) {
        throw new Error("Char parser must contains one character");
    }

    return satisfy(function (v) {
        return c === v;
    });
}

// char -> Parser char char
function notChar(c) {
    if (c.length !== 1) {
        throw new Error("Char parser must contains one character");
    }

    return satisfy(function (v) {
        return c !== v;
    });
}

// string -> Parser char char
function charIn(c) {
    return satisfy(function (v) {
        return c.indexOf(v) !== -1;
    });
}

// string -> Parser char char
function charNotIn(c) {
    return satisfy(function (v) {
        return c.indexOf(v) === -1;
    });
}

// string -> Parser string char
function string(s) {
    return new Parser(function (input, index) {
        if (input.subStreamAt(s.split(''), index)) {
            return response.accept(s, input, index + s.length, true);
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

// string -> Parser string char
function notString(s) {
    return not(string(s));
}

// unit -> Parser char char
function charLiteral() {
    var anyChar = string("\\'").or(notChar("'"));
    return char("'").thenRight(anyChar).thenLeft(char("'"));
}

// unit -> Parser string char
function stringLiteral() {
    var anyChar = string('\\"').or(notChar('"'));
    return char('"').thenRight(anyChar.optrep()).thenLeft(char('"')).map(function (r) {
        return r.join('');
    });
}

// unit -> Parser number char
function numberLiteral() {
    // [-+]?\d+([.]\d+)?([eE][+-]?\d+)?
    var join = function (r) {
            return r.join('');
        },
        joinOrEmpty = function (r) {
            return r.map(join).orElse('');
        },
        digits = digit().rep().map(join),
        integer = charIn("+-").opt().then(digits).map(function (r) {
            return r[0].orElse('') + r[1];
        }),
        float = integer.then(char('.').then(digits).opt().map(joinOrEmpty)).then(charIn('eE').then(integer).opt().map(joinOrEmpty)).map(function (r) {
            return r[0][0] + r[0][1] + r[1];
        });

    return float.map(function (r) {
        return parseFloat(r, 10);
    });
}


export default {
    parse: parse,
    lazy: lazy,
    returns: returns,
    error: error(),
    eos: eos(),
    satisfy: satisfy,
    try: doTry,
    any: any(),
    digit: digit(),
    lowerCase: lowerCase(),
    upperCase: upperCase(),
    not: not,
    letter: letter(),
    notChar: notChar,
    char: char,
    charIn: charIn,
    charNotIn: charNotIn,
    string: string,
    notString: notString,
    charLiteral: charLiteral(),
    stringLiteral: stringLiteral(),
    numberLiteral: numberLiteral()
}