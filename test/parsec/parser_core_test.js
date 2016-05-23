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

exports['parser_core'] = {
  setUp: function(done) {
    done();
  },
        
  'expect (map) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (map) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofCharacters("b"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (map) to be return ab': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").map(function(a) { return a + "b"; }).parse(stream.ofCharacters("a"),0).value,
               'ab',
               'should be accepted.');
    test.done();
  },
       
  'expect (flatmap) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.returns('b'); }).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
       
  'expect (flatmap) to be rejected ': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.returns('b'); }).parse(stream.ofCharacters("b"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (flatmap) to be return ab': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").flatmap(function() { return parser.char('b'); }).parse(stream.ofCharacters("ab"),0).value,
               'b',
               'should be accepted.');
    test.done();
  },
        
  'expect (filter) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").filter(function(a) { return a === 'a'; }).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (then) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofCharacters("ab"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (then) left to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofCharacters("cb"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then) right to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").then(parser.char("b")).parse(stream.ofCharacters("ac"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },
        
  'expect (then) to return [a,b]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").then(parser.char("b")).parse(stream.ofCharacters("ab"),0).value,
                   ['a','b'],
                   'should be accepted.');
    test.done();
  },
        
  'expect (thenLeft) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenLeft(parser.char("b")).parse(stream.ofCharacters("ab"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (thenLeft) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").thenLeft(parser.char("b")).parse(stream.ofCharacters("ab"),0).value,
                   'a',
                   'should be accepted.');
    test.done();
  },
        
  'expect (thenRight) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").thenRight(parser.char("b")).parse(stream.ofCharacters("ab"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
        
  'expect (thenRight) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").thenRight(parser.char("b")).parse(stream.ofCharacters("ab"),0).value,
                   'b',
                   'should be accepted.');
    test.done();
  },
        
  'expect (or) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").or(parser.char("b")).parse(stream.ofCharacters("a"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },
            
  'expect (or) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    test.equal(parser.char("a").or(parser.char("b")).parse(stream.ofCharacters("c"),0).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },

  'expect (or) to return a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").or(parser.char("b")).parse(stream.ofCharacters("a"),0).value,
                   'a',
                   'should be accepted.');
    test.done();
  },
        
  'expect (or) to return b': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").or(parser.char("b")).parse(stream.ofCharacters("b"),0).value,
                   'b',
                   'should be accepted.');
    test.done();
  },

  'expect (opt) some to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofCharacters("a"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (opt) some to return some a': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofCharacters("a"),0).value.get(),
                   'a',
                   'should be a.');
    test.done();
  },

  'expect (opt) none to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofCharacters("b"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (opt) none to return none': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").opt().parse(stream.ofCharacters("b"),0).value.isPresent(),
                   false,
                   'should be accepted but none.');
    test.done();
  },

  'expect (rep) to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofCharacters("a"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (rep) to rejected': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofCharacters("b"),0).isAccepted(),
                   false,
                   'should be rejected.');
    test.done();
  },

  'expect (rep) mutiple to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofCharacters("aaaabbb"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },
    
  'expect (rep) mutiple to return [a,a,a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").rep().parse(stream.ofCharacters("aaaabbb"),0).value,
                   ['a','a','a','a'],
                   'should be accepted.');
    test.done();
  },

  'expect (optrep) to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofCharacters("a"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },

  'expect (optrep) none to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofCharacters("b"),0).isAccepted(),
                   true,
                   'should be rejected.');
    test.done();
  },

  'expect (optrep) mutiple to accepted': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofCharacters("aaaabbb"),0).isAccepted(),
                   true,
                   'should be accepted.');
    test.done();
  },
    
  'expect (optrep) mutiple to return some [a,a,a,a]': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofCharacters("aaaabbb"),0).value,
                   ['a','a','a','a'],
                   'should be accepted.');
    test.done();
  },
    
  'expect (optrep) non to return none': function(test) {
    test.expect(1);
    // tests here  
    test.deepEqual(parser.char("a").optrep().parse(stream.ofCharacters("bbb"),0).value,
                   [],
                   'should be accepted.');
    test.done();
  },

};