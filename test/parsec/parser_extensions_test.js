'use strict';

var parser = require('../../lib' + (process.env.COVERAGE || '') + '/parsec/parser.js'),
    stream = require('../../lib' + (process.env.COVERAGE || '') + '/parsec/stream.js');

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

exports['parser'] = {
  setUp: function(done) {
    done();
  },
    
  'expect (returns) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(parser.returns().parse(stream.ofCharacters(""),0).isAccepted(),
            'should be accepted.');
    test.done();
  },
    
  'expect (returns) to return a given value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.returns(123).parse(stream.ofCharacters(""),0).value,
               123,
               'should be accepted.');
    test.done();
  },
    
  'expect (returns) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.error().parse(stream.ofCharacters(""),0).isAccepted(),
               false,
               'should be accepted.');
    test.done();
  },
    
  'expect (error) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.error().parse(stream.ofCharacters(""),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
    
  'expect (eos) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.eos().parse(stream.ofCharacters(""),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (eos) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.eos().parse(stream.ofCharacters("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
    
  'expect (satisfy) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (satisfy) to be return the right value': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofCharacters("a"),0).value,
               'a',
               'should be the right value.');
    test.done();
  },
    
  'expect (satisfy) to be return the right offset': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'a';}).parse(stream.ofCharacters("a"),0).offset,
               1,
               'should be the right offset.');
    test.done();
  },
    
  'expect (satisfy) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.satisfy(function(v) { return v === 'b';}).parse(stream.ofCharacters("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (doTry satisfy) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.try(parser.satisfy(function(v) { return v === 'a';})).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (doTry satisfy) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.try(parser.satisfy(function(v) { return v === 'b';})).parse(stream.ofCharacters("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (digit) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.digit().parse(stream.ofCharacters("1"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (digit) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.digit().parse(stream.ofCharacters("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (lowerCase) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lowerCase().parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (lowerCase) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.lowerCase().parse(stream.ofCharacters("A"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (upperCase) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.upperCase().parse(stream.ofCharacters("A"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (upperCase) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.upperCase().parse(stream.ofCharacters("z"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect upper (letter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter().parse(stream.ofCharacters("A"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
      
  'expect lower (letter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter().parse(stream.ofCharacters("z"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect non (letter) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.letter().parse(stream.ofCharacters("0"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (notChar) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notChar('a').parse(stream.ofCharacters("b"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (notChar) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.notChar('a').parse(stream.ofCharacters("a"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
      
  'expect (char) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char('a').parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (char) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char('a').parse(stream.ofCharacters("b"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral().parse(stream.ofCharacters("123"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (number) to return 123': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.numberLiteral().parse(stream.ofCharacters("123"),0).value,
               123,
               'should be accepted.');
    test.done();
  },
    
  'expect (charLiteral) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral().parse(stream.ofCharacters("'a'"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (charLiteral) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral().parse(stream.ofCharacters("'a'"),0).value,
               'a',
               'should be accepted.');
    test.done();
  },
    
  'expect (charLiteral) quote to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral().parse(stream.ofCharacters("'\\''"),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (charLiteral) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.charLiteral().parse(stream.ofCharacters("''"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
   
  'expect (stringLiteral) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral().parse(stream.ofCharacters('"a"'),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
    
  'expect (stringLiteral) to return abc': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral().parse(stream.ofCharacters('"abc"'),0).value,
               "abc",
               'should be accepted.');
    test.done();
  },
  
  'expect (stringLiteral) empty to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.stringLiteral().parse(stream.ofCharacters('""'),0).isAccepted(), 
               true,
               'should be accepted.');
    test.done();
  },  
};