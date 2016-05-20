'use strict';

var response = require('../../lib' + (process.env.COVERAGE || '') + '/parsec/response.js');

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

exports['response'] = {
  setUp: function(done) {
    done();
  },
    
  'response accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(response.accept().isAccepted(), 
            'should be accepted.');
    test.done();
  },

  'response accepted map to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(response.accept().map(function(a) { return a; }).isAccepted(), 
            'should be accepted.');
    test.done();
  },

  'response accepted flatmap to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(response.accept().flatmap(function() { return response.accept(); }).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'response accepted flatmap to reject': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.accept().flatmap(function() { return response.reject(); }).isAccepted(), 
               false,
               'should be rejected.');
    test.done();
  },

  'response accepted fold': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.accept('a').fold(function(a) { return a.value; }), 
               'a',
               'should retrieve the value.');
    test.done();
  },
    
  'response filter accepted': function(test) {
    test.expect(1);
    // tests here  
    test.ok(response.accept().filter(function() { return true; }).isAccepted(), 
           'should filter the response.');
    test.done();
  },
    
  'response not filter accepted ': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.accept().filter(function() { return false; }).isAccepted(),
               false,
               'should not filter the response.');
    test.done();
  },

 'response rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.reject().isAccepted(), false, 
               'should be rejected.');
    test.done();
  },
    
  'response rejected fold': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.reject().fold(function(a) { return a.value; }, function() { return 'b'; }), 
               'b',
               'should generate the value.');
    test.done();
  },
    
  'response filter rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.reject().filter(function() { return true; }).isAccepted(),
               false,
               'should not filter the response.');
    test.done();
  },
    
  'response not filter rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(response.reject().filter(function() { return false; }).isAccepted(),
               false,
               'should not filter the response.');
    test.done();
  },

};
