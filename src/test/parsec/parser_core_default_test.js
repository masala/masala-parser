import stream from '../../lib/stream/index';
import parser from '../../lib/parsec/parser';

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

export default  {
  setUp: function(done) {
    done();
  },
        
  'expect (map) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofString("a")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (map) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofString("b")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (map) to be return ab': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofString("a")).value,
               'ab',
               'should be accepted.');
    test.done();
  },
       
  'expect (flatmap) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.returns('b'); }).parse(stream.ofString("a")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
       
  'expect (flatmap) to be rejected ': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.returns('b'); }).parse(stream.ofString("b")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (flatmap) to be return ab': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.char('b'); }).parse(stream.ofString("ab")).value,
               'b',
               'should be accepted.');
    test.done();
  },
        
  'expect (filter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").filter(function(a) { return a === 'a'; }).parse(stream.ofString("a")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (filter) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").filter(function(a) { return a === 'b'; }).parse(stream.ofString("a")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (match) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").match('a').parse(stream.ofString("a")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (match) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").match('b').parse(stream.ofString("a")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofString("ab")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (then) left to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofString("cb")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then) right to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofString("ac")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then) to return [a,b]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").then(parser.char("b")).parse(stream.ofString("ab")).value,
                   ['a','b'],
                   'should be accepted.');
    test.done();
  },
        
  'expect (thenLeft) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenLeft(parser.char("b")).parse(stream.ofString("ab")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (thenLeft) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").thenLeft(parser.char("b")).parse(stream.ofString("ab")).value,
                   'a',
                   'should be accepted.');
    test.done();
  },
        
  'expect (thenLeft) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenLeft(parser.char("b")).parse(stream.ofString("b")).isAccepted(),
               false,
               'should be accepted.');
    test.done();
  },

    'expect (thenRight) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenRight(parser.char("b")).parse(stream.ofString("ab")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (thenRight) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").thenRight(parser.char("b")).parse(stream.ofString("ab")).value,
                   'b',
                   'should be accepted.');
    test.done();
  },
        
  'expect (thenRight) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenRight(parser.char("b")).parse(stream.ofString("b")).isAccepted(),
               false,
               'should be accepted.');
    test.done();
  },
            
  'expect (thenReturns) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenReturns("b").parse(stream.ofString("ab")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (thenRight) to return b': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenReturns("b").parse(stream.ofString("ab")).value,
               'b',
               'should be accepted.');
    test.done();
  },
            
  'expect (thenReturns) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenReturns("b").parse(stream.ofString("b")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },

  'expect (or) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").or(parser.char("b")).parse(stream.ofString("a")).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
            
  'expect (or) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").or(parser.char("b")).parse(stream.ofString("c")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
            
  'expect (or) LL(1) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).or(parser.char("a")).parse(stream.ofString("ac")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },

  'expect (or) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").or(parser.char("b")).parse(stream.ofString("a")).value,
                   'a',
                   'should be accepted.');
    test.done();
  },
        
  'expect (or) to return b': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").or(parser.char("b")).parse(stream.ofString("b")).value,
                   'b',
                   'should be accepted.');
    test.done();
  },

  'expect (then.or) left to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b").or(parser.char('c'))).parse(stream.ofString("ad")).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then.or) left to be consumed': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b").or(parser.char('c'))).parse(stream.ofString("ad")).consumed,
               true,
               'should be consumed.');
    test.done();
  },
    
  'expect (opt) some to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofString("a")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (opt) some to return some a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofString("a")).value.get(),
                   'a',
                   'should be a.');
    test.done();
  },

  'expect (opt) none to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofString("b")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (opt) none to return none': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofString("b")).value.isPresent(),
                   false,
                   'should be accepted but none.');
    test.done();
  },

  'expect (rep) to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofString("a")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (rep) to rejected': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofString("b")).isAccepted(),
                   false,
                   'should be rejected.');
    test.done();
  },

  'expect (rep) mutiple to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofString("aaaabbb")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },
    
  'expect (rep) mutiple to return [a,a,a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofString("aaaabbb")).value,
                   ['a','a','a','a'],
                   'should be accepted.');
    test.done();
  },

  'expect (optrep) to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofString("a")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (optrep) none to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofString("b")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (optrep) multiple to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofString("aaaabbb")).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },
    
  'expect (optrep) multiple to return some [a,a,a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofString("aaaabbb")).value,
                   ['a','a','a','a'],
                   'should be accepted.');
    test.done();
  },
    
  'expect (optrep) to return none': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofString("bbb")).value,
                   [],
                   'should be accepted.');
    test.done();
  },
    
  'expect (optrep) to return [b,b,b]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.notChar("a").optrep().parse(stream.ofString("bbba")).value,
                   ['b','b','b'],
                   'should be accepted.');
    test.done();
  },

};