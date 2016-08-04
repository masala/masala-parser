'use strict';

var requireHelper = require('../require_helper.js'),
    parser = requireHelper('/parsec/parser.js'),
    stream = requireHelper('/stream/streams.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['parser_extension'] = {
  setUp: function(done) {
    done();
  },
    
  'expect (returns) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(parser.returns().parse(stream.ofString(""),0).isAccepted(),
            'should be accepted.');
    test.done();
  },
    
  'expect (returns) to return a given value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.returns(123).parse(stream.ofString(""),0).value,
               123,
               'should be accepted.');
    test.done();
  },
    
  'expect (returns) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.error.parse(stream.ofString(""),0).isAccepted(),
               false,
               'should be accepted.');
    test.done();
  },
    
  'expect (lazy) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(parser.lazy(function(){ return parser.returns(); }).parse(stream.ofString(""),0).isAccepted(),
            'should be accepted.');
    test.done();
  },
    
  'expect (lazy) to return a given value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lazy(function(){ return parser.returns(123); }).parse(stream.ofString(""),0).value,
               123,
               'should be accepted.');
    test.done();
  },
    
  'expect (lazy) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lazy(function(){ return parser.error; }).parse(stream.ofString(""),0).isAccepted(),
               false,
               'should be accepted.');
    test.done();
  },
    
  'expect (lazy) with a parameter to return a given value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lazy(function(v){ return parser.returns(v); }, [123]).parse(stream.ofString(""),0).value,
               123,
               'should be accepted.');
    test.done();
  },
    
  'expect (error) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.error.parse(stream.ofString(""),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
    
  'expect (eos) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.eos.parse(stream.ofString(""),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (eos) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.eos.parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
    
  'expect (satisfy) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofString("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (satisfy) to be return the right value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofString("a"),0).value,
               'a',
               'should be the right value.');
    test.done();
  },
    
  'expect (satisfy) to be return the right offset': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofString("a"),0).offset,
               1,
               'should be the right offset.');
    test.done();
  },
    
  'expect (satisfy) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'b';}).parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (doTry satisfy) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.try(parser.satisfy(function(v) { return v === 'a';})).parse(stream.ofString("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (doTry satisfy) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.try(parser.satisfy(function(v) { return v === 'b';})).parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (digit) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.digit.parse(stream.ofString("1"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (digit) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.digit.parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (lowerCase) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lowerCase.parse(stream.ofString("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (lowerCase) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lowerCase.parse(stream.ofString("A"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (upperCase) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.upperCase.parse(stream.ofString("A"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (upperCase) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.upperCase.parse(stream.ofString("z"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect upper (letter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter.parse(stream.ofString("A"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
      
  'expect lower (letter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter.parse(stream.ofString("z"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect non (letter) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter.parse(stream.ofString("0"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (notChar) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notChar('a').parse(stream.ofString("b"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (notChar) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notChar('a').parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (charNotIn) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charNotIn('a').parse(stream.ofString("b"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (charNotIn) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charNotIn('a').parse(stream.ofString("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (charIn) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charIn('a').parse(stream.ofString("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (charIn) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charIn('a').parse(stream.ofString("b"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (string) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.string('hello').parse(stream.ofString("hello"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (string) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char('hello').parse(stream.ofString("hell"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (notString) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notString('**').parse(stream.ofString("hello"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
      
  'expect (notString) to be h': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notString('**').parse(stream.ofString("hello"),0).value,
               'h',
               'should be h.');
    test.done();
  },
      
  'expect (notString) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notString('**').parse(stream.ofString("**hello"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("123"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (number) to return 123': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("123"),0).value,
               123,
               'should be accepted.');
    test.done();
  },
        
  'expect negative (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("-123"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect negative (number) to return -123': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("-123"),0).value,
               -123,
               'should be accepted.');
    test.done();
  },
      
  'expect float (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("123.34e-34"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect float (number) to return 123.34e-34': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral.parse(stream.ofString("123.34e-34"),0).value,
               123.34e-34,
               'should be accepted.');
    test.done();
  },
    
    
  'expect (charLiteral) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral.parse(stream.ofString("'a'"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (charLiteral) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral.parse(stream.ofString("'a'"),0).value,
               'a',
               'should be accepted.');
    test.done();
  },
    
  'expect (charLiteral) quote to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral.parse(stream.ofString("'\\''"),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (charLiteral) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral.parse(stream.ofString("''"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
   
  'expect (stringLiteral) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral.parse(stream.ofString('"a"'),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (stringLiteral) to return abc': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral.parse(stream.ofString('"abc"'),0).value,
               "abc",
               'should be accepted.');
    test.done();
  },
  
  'expect (stringLiteral) empty to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral.parse(stream.ofString('""'),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (occurence 1) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.any.occ(1).parse(stream.ofString('a'),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (occurence 1) to return [a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.any.occ(1).parse(stream.ofString('a'),0).value, 
                   ['a'],
                   'should be accepted.');
    test.done();
  },  
    
  'expect (occurence 2) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.any.occ(1).parse(stream.ofString('aa'),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (occurence 2) to return [a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.any.occ(2).parse(stream.ofString('aa'),0).value, 
                   ['a','a'],
                   'should be accepted.');
    test.done();
  },  
    
  'expect (occurence 2) to return [a,a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.any.occ(3).parse(stream.ofString('aaa'),0).value, 
                   ['a','a','a'],
                   'should be accepted.');
    test.done();
  },  

  'expect (occurence 0) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.any.occ(0).parse(stream.ofString('aa'),0).isAccepted(), 
               true,
               'should be accepter.');
    test.done();
  },  


  'expect (occurence 0) to return []': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.any.occ(0).parse(stream.ofString('aa'),0).value, 
                   [],
                   'should be accepter.');
    test.done();
  },  
};