import {Streams, JSON} from '@masala/parser';


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

export default {
  setUp: function(done) {
    done();
  },
    
  'number accepted': function(test) {
    test.expect(1);
    // tests here    
    test.ok(JSON.parse(Streams.ofString('123')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'string accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('"123"')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'string and unrecognized item rejected': function(test) {
    test.expect(1);
    // tests here
    test.equal(JSON.parse(Streams.ofString('"123" -')).isAccepted(), 
               false,
               'should be rejected.');
    test.done();
  },
    
  'string and unrecognized item rejected with correct offset': function(test) {
    test.expect(1);
    // tests here
    var result = JSON.parse(Streams.ofString('["123", -]'));
    test.equal(result.offset,
               7,
               'should be 7.');
    test.done();
  },
    
  'null accepted': function(test) {
    test.expect(1);
    // tests here    
    test.ok(JSON.parse(Streams.ofString('null')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
 
  'true accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('true')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'false accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('false')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'empty array accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('[ ]')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'singleton array accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('[ 123 ]')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'multi element array accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('[ 123 , 234 ]')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'empty object accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('{ }')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'singleton object accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('{ "a" : "v" }')).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'multi element object accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('{ "a" : "v", "a" : [] }')).isAccepted(), 
            'should be accepted.');
    test.done();
  },

  'multi level object accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(JSON.parse(Streams.ofString('{ "a" : "v", "b" : {"c":{"d":12} }}')).isAccepted(),
        'should be accepted.');
    test.done();
  },

};
