'use strict';

var stream = require('../../lib' + (process.env.COVERAGE || '') + '/stream/stream.js'),
    token = require('../../lib' + (process.env.COVERAGE || '') + '/genlex/token.js');
    

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

exports['token'] = {
  setUp: function(done) {
    done();
  },
    
  'expect (keyword) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.keyword.parse(stream.ofArray([token.builder.keyword("")]),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (ident) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.ident.parse(stream.ofArray([token.builder.ident("")]),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.number.parse(stream.ofArray([token.builder.number("")]),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (string) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.string.parse(stream.ofArray([token.builder.string("")]),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (char) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.char.parse(stream.ofArray([token.builder.char("")]),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (keyword) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.keyword.parse(stream.ofArray([token.builder.ident("")]),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
    
  'expect (ident) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.ident.parse(stream.ofArray([token.builder.number("")]),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
    
  'expect (number) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.number.parse(stream.ofArray([token.builder.string("")]),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
    
  'expect (string) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.string.parse(stream.ofArray([token.builder.char("")]),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
    
  'expect (char) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(token.parser.char.parse(stream.ofArray([token.builder.keyword("")]),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
};
    