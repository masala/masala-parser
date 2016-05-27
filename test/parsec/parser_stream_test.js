'use strict';

var parser = require('../../lib' + (process.env.COVERAGE || '') + '/parsec/parser.js'),
    stream = require('../../lib' + (process.env.COVERAGE || '') + '/stream/stream.js');

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

exports['parser_stream'] = {
  setUp: function(done) {
    done();
  },
    
  'endOfStream for empty stream': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.ok(stream.ofParser(p, stream.ofString("")).endOfStream(0), 
            'should be endOfStream.');
    test.done();
  },
    
  'endOfStream for non empty stream': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.ok(stream.ofParser(p, stream.ofString("1")).endOfStream(1), 
            'should be endOfStream.');
    test.done();
  },

  'no endOfStream for non empty stream': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.equal(stream.ofParser(p, stream.ofString("1")).endOfStream(0),
               false,
               'should be endOfStream.');
    test.done();
  },

  'get from stream': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.equal(stream.ofParser(p, stream.ofString("1")).get(0).isSuccess(), 
               true,
               'should be a success.');
    test.done();
  },
   
  'do not get from empty stream': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.equal(stream.ofParser(p, stream.ofString("1")).get(1).isSuccess(), 
               false,
               'should be a failure.');
    test.done();
  },

  'get from stream numberLiteral 123': function(test) {
    test.expect(1);
    // tests here  
    var p = parser.char(' ').optrep().thenRight(parser.numberLiteral);
    test.equal(stream.ofParser(p, stream.ofString("123")).get(0).success(), 
               123,
               'should be a 123.');
    test.done();
  }
};
