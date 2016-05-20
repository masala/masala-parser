'use strict';

var stream = require('../../lib' + (process.env.COVERAGE || '') + '/parsec/stream.js');

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

exports['stream'] = {
  setUp: function(done) {
    done();
  },
    
  'EOS for empty stream': function(test) {
    test.expect(1);
    // tests here  
    test.ok(stream.ofCharacters('').EOS(0), 
            'should be EOS.');
    test.done();
  },

  'EOS for non empty stream': function(test) {
    test.expect(1);
    // tests here  
    test.ok(stream.ofCharacters('1').EOS(1), 
            'should be EOS.');
    test.done();
  },

  'no EOS for non empty stream': function(test) {
    test.expect(1);
    // tests here  
    test.equal(stream.ofCharacters('1').EOS(0), 
               false,
               'should be EOS.');
    test.done();
  },

  'get from stream': function(test) {
    test.expect(1);
    // tests here  
    test.equal(stream.ofCharacters('1').get(0).isSuccess(), 
               true,
               'should be a success.');
    test.done();
  },
    
  'do not get from empty stream': function(test) {
    test.expect(1);
    // tests here  
    test.equal(stream.ofCharacters('1').get(1).isSuccess(), 
               false,
               'should be a failure.');
    test.done();
  },
};
