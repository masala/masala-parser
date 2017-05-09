/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import F from '../parsec/flow-bundle';
import C from '../../lib/parsec/chars-bundle';
import N from '../../lib/parsec/numbers-bundle';
import unit from '../data/unit.js';

// (string -> 'a,string -> 'a,number -> 'a,string -> 'a,char -> 'a) -> GenlexFactory 'a
function GenlexFactory(keyword, ident, number, string, char) {
  this.keyword = keyword;
  this.ident = ident;
  this.number = number;
  this.string = string;
  this.char = char;
}

class Genlex {
  // [String] -> Genlex
  constructor(keywords = []) {
    var idletter = C.letter.or(C.char('_')).or(N.digit);
    this.identParser = C.letter
      .then(idletter.optrep())
      .map(r => [r[0]].concat(r[1].array()).join(''));
    this.keywordParser = keywords.reduce((p, s) => C.string(s).or(p), F.error);
  }

  // unit -> Parser char char
  space() {
    return C.charIn(' \r\n\f\t');
  }

  // unit -> Parser unit char
  spaces() {
    return this.space().optrep().map(() => unit);
  }

  // GenLexFactory 'a -> Parser 'a char
  keyword(f) {
    return this.keywordParser.map(f.keyword);
  }

  // GenLexFactory 'a -> Parser 'a char
  ident(f) {
    return this.identParser.map(f.ident);
  }

  // GenLexFactory 'a -> Parser 'a char
  number(f) {
    return N.numberLiteral.map(f.number);
  }

  // GenLexFactory 'a -> Parser 'a char
  string(f) {
    return C.stringLiteral.map(f.string);
  }

  // GenLexFactory 'a -> Parser 'a char
  char(f) {
    return C.charLiteral.map(f.char);
  }

  // GenLexFactory 'a -> Parser 'a char
  token(f) {
    return this.keyword(f)
      .or(this.ident(f))
      .or(this.number(f))
      .or(this.string(f))
      .or(this.char(f));
  }

  // GenLexFactory 'a -> Parser 'a char
  tokenBetweenSpaces(f) {
    return this.spaces().thenRight(this.token(f)).thenLeft(this.spaces());
  }

  // GenLexFactory 'a -> Parser ['a] char
  tokens(f) {
    return this.tokenBetweenSpaces(f)
      .optrep()
      .thenLeft(F.eos)
      .map(r => r.array());
  }
}

export default {
  factory: function(keyword, ident, number, string, char) {
    return new GenlexFactory(keyword, ident, number, string, char);
  },
  generator: function(keywords) {
    return new Genlex(keywords);
  },
};
