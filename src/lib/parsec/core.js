/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */
import stream from "../stream/index";
import option from "../data/option";
import response from "./response";
import {isTuple, NEUTRAL, Tuple} from "../data/tuple";
import Parser, {eos} from "./parser"

export class AbstractParser {
    // (Stream 'c -> number -> Response 'a 'c) -> Parser 'a 'c

    val(text) {
        return this.parse(stream.ofString(text)).value;
    }

    // Parser 'a 'c => ('a -> Parser 'b 'c) -> Parser 'b 'c
    flatMap(f) {
        return bind(this, f);
    }

    // Parser 'a 'c => ('a -> 'b) -> Parser 'b 'c
    map(f) {
        return new Map(this, f);
    }

    // Parser 'a 'c => ('a -> boolean) -> Parser 'a 'c
    filter(p) {
        const self = this;

        return new Parser((input, index = 0) =>
            self.parse(input, index).filter(p)
        );
    }

    // Parser 'a 'c => Comparable 'a -> Parser 'a 'c
    match(v) {
        return this.filter(a => a === v);
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser ('a,'b) 'c
    then(p) {
        return new And(this, p);
    }

    single() {
        return this.map(tuple => tuple.single());
    }

    last() {
        return this.map(tuple => tuple.last());
    }

    first() {
        return this.map(tuple => tuple.first());
    }

    // Should be called only on ListParser ; Always returns an array
    array() {
        return this.map(value => {
            if (!isTuple(value)) {
                throw "array() is called only on TupleParser";
            }
            return value.array();
        });
    }


    thenEos() {
        return this.then(eos().drop());
    }

    eos() {

        return new Parser((input, index = 0) =>
            this.parse(input, index).fold((accept) => {

                return input.endOfStream(accept.offset) ?
                    response.accept(accept.value, accept.input, accept.offset, true) :
                    response.reject(accept.input, accept.offset, accept.consumed);
            })
        );

    }

    concat(p) {
        return this.then(p);
    }

    drop() {
        return this.map(() => NEUTRAL);
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'a 'c
    thenLeft(p) {
        return this.then(p.drop());
    }

    // Parser 'a 'c => Parser 'b 'c -> Parser 'b 'c
    thenRight(p) {
        return this.drop().then(p);
    }

    // Parser 'a 'c => 'b -> Parser 'b 'c
    returns(v) {
        return this.map(() => v);
    }

    // Parser 'a 'c -> Parser 'a 'c
    or(p) {
        return new Or(this, p);
    }

    /**
     * Must be used with F.layer()
     * @param p
     * @returns {Parser}
     */
    and(p) {
        return both(this, p);
    }

    // Parser 'a 'c => unit -> Parser (Option 'a) 'c
    opt() {
        return this.map(option.some).or(returns(option.none()));
    }

    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    rep() {
        return new Repeatable(this, () => true, l => l !== 0);
    }

    // Parser 'a 'c => number -> Parser (List 'a) 'c
    occurrence(occurrence) {
        return new Repeatable(this, l => l < occurrence, l => l === occurrence);
    }

    // Parser 'a 'c => unit -> Parser (List 'a) 'c
    optrep() {
        return new Repeatable(this, () => true, () => true);
    }

    // Parser 'a 'c => Parser 'b 'a -> Parser 'b 'c
    chain(p) {
        const self = this;

        return new Parser((input, index = 0) =>
            p.parse(stream.buffered(stream.ofParser(self, input)), index)
        );
    }

    /**
     * Prints a hint if the parser enters in this step
     * @param hint
     * @returns the equivalent Parser
     */
    // TODO: set details default at false; check tests
    debug(hint, details = true) {
        const f = p => {
            if (details) {
                console.log("[debug] : ", hint, p);
            } else {
                console.log("[debug] : ", hint);
            }

            return p;
        };
        return this.map(f);
    }

    parse(input, offset) {
        return response.reject(input, offset, false);
    }
}

class And extends AbstractParser {
    constructor(parser1, parser2) {
        super();
        this.parser1 = parser1;
        this.parser2 = parser2;
    }

    parse(input, offset) {
        const response1 = this.parser1.parse(input, offset);

        if (!response1.isAccepted()) {
            return response1;
        }

        const response2 = this.parser2.parse(response1.input, response1.offset);

        if (response2.isAccepted()) {
            response2.value = new Tuple([]).append(response1.value).append(response2.value);
        }

        response2.consumed = response1.consumed || response2.consumed;

        return response2;
    }
}

export class Or extends AbstractParser {
    constructor(parser1, parser2) {
        super();
        this.parser1 = parser1;
        this.parser2 = parser2;
    }

    parse(input, offset) {
        const response1 = this.parser1.parse(input, offset);

        if (response1.isAccepted() || response1.consumed) {
            return response1;
        }

        return this.parser2.parse(input, offset);
    }
}

export class Map extends AbstractParser {
    constructor(parser, f) {
        super();
        this.parser = parser;
        this.f = f;
    }

    parse(input, offset) {
        const response = this.parser.parse(input, offset);

        if (response.isAccepted()) {
            response.value = this.f(response.value);
        }

        return response;
    }
}

export class Repeatable extends AbstractParser {
    constructor(parser, occurrences, accept) {
        super();
        this.parser = parser;
        this.occurrences = occurrences;
        this.accept = accept;
    }

    parse(input, index) {
        let consumed = false,
            value = new Tuple([]),
            offset = index,
            current = this.parser.parse(input, index),
            occurrence = 0;

        while (current.isAccepted() && this.occurrences(occurrence)) {
            occurrence += 1;
            value = value.append(current.value);
            consumed = consumed || current.consumed;
            offset = current.offset;
            current = this.parser.parse(input, current.offset);
        }

        if (this.accept(occurrence)) {
            return response.accept(value, input, offset, consumed);
        }

        return response.reject(input, offset, consumed);
    }

}

export class Return extends AbstractParser {
    constructor(value) {
        super()
        this.value = value;
    }

    parse(input, index) {
        return response.accept(this.value, input, index, false)
    }
}


// Parser 'a 'c -> ('a -> Parser 'b 'c) -> Parser 'b 'c
function bind(self, f) {
    return new Parser((input, index = 0) =>
        self
            .parse(input, index)
            .fold(accept_a => bindAccepted(accept_a, f), reject_a => reject_a)
    );
}

// Response 'a 'c -> ('a -> Parser 'b 'c) -> Response 'b 'c
function bindAccepted(accept_a, f) {
    return f(accept_a.value)
        .parse(accept_a.input, accept_a.offset)
        .fold(
            accept_b =>
                response.accept(
                    accept_b.value,
                    accept_b.input,
                    accept_b.offset,
                    accept_a.consumed || accept_b.consumed
                ),
            reject_b =>
                response.reject(
                    reject_b.input, reject_b.offset,
                    accept_a.consumed || reject_b.consumed
                )
        );
}

// Parser 'a 'c -> Parser 'a 'c -> Parser 'a 'c
// TODO logger representing which choice is made
function choice(self, f) {
    return new Parser((input, index = 0) =>
        self
            .parse(input, index)
            .fold(
                accept => accept,
                reject => (reject.consumed ? reject : f.parse(input, index))
            )
    );
}

// Parser 'a 'c -> Parser 'a 'c -> Parser 'a 'c
function both(self, f) {
    return new Parser((input, index = 0) =>
        self
            .parse(input, index)
            .fold(
                accept => f.parse(input, index)
                    .map(r => accept.value.append(r)),
                reject => reject
            )
    );
}

/*
 * Builders
 */

function returns(v) {
    return new Parser((input, index = 0) =>
        response.accept(v, input, index, false)
    );
}
