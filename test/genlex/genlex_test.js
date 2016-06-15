'use strict';

var requireHelper = require('../require_helper.js'),
    stream = requireHelper('/stream/streams.js'),
    genlex = requireHelper('/genlex/genlex.js');
    

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

exports['genlex'] = {
  setUp: function(done) {
    done();
  },
         
  'expect (space) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(genlex.generator([]).space().parse(stream.ofString(" "),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (meta space) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(genlex.generator([]).space().parse(stream.ofString("\t"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (spaces) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    test.equal(genlex.generator([]).spaces().parse(stream.ofString(" \n  "),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (spaces) to be skipped': function(test) {
    test.expect(1);
    // tests here  
    test.equal(genlex.generator([]).spaces().parse(stream.ofString(" \n "),0).offset,
               3,
               'should be skipped.');
    test.done();
  },  

  'expect (keyword) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        function (s) { return s; },
        null,
        null,
        null,
        null
    );
    
    test.equal(genlex.generator(['<-', '->']).keyword(factory).parse(stream.ofString("a->b"),1).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (keyword) to return ->': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        function (s) { return s; },
        null,
        null,
        null,
        null
    );
    
    test.equal(genlex.generator(['<-', '->']).keyword(factory).parse(stream.ofString("a->b"),1).value,
               '->',
               'should be accepted.');
    test.done();
  },  

  'expect (keyword) to be rejected': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        function (s) { return s; },
        null,
        null,
        null,
        null
    );
    
    test.equal(genlex.generator([]).keyword(factory).parse(stream.ofString("->"),1).isAccepted(),
               false,
               'should be rejected.');
    test.done();
  },  
    
  'expect (ident) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        function (s) { return s; },
        null,
        null,
        null
    );
    
    test.equal(genlex.generator([]).ident(factory).parse(stream.ofString("smith "),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (ident) to return smith': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        function (s) { return s; },
        null,
        null,
        null
    );
    
    test.equal(genlex.generator([]).ident(factory).parse(stream.ofString("smith "),0).value,
               'smith',
               'should be smith.');
    test.done();
  },  
    
  'expect (number) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        function (s) { return s; },
        null,
        null
    );
    
    test.equal(genlex.generator([]).number(factory).parse(stream.ofString('42'),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (number) to return 42': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        function (s) { return s; },
        null,
        null
    );
    
    test.equal(genlex.generator([]).number(factory).parse(stream.ofString('42'),0).value,
               42,
               'should be 42.');
    test.done();
  },  
    
  'expect (string) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        function (s) { return s; },
        null
    );
    
    test.equal(genlex.generator([]).string(factory).parse(stream.ofString('"smith"'),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (string) to return smith': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        function (s) { return s; },
        null
    );
    
    test.equal(genlex.generator([]).string(factory).parse(stream.ofString('"smith"'),0).value,
               'smith',
               'should be smith.');
    test.done();
  },  
    
  'expect (char) to be accepted': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        null,
        function (s) { return s; }
    );
    
    test.equal(genlex.generator([]).char(factory).parse(stream.ofString("'s'"),0).isAccepted(),
               true,
               'should be accepted.');
    test.done();
  },  
    
  'expect (char) to return j': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        null,
        function (s) { return s; }
     );
    
    test.equal(genlex.generator([]).char(factory).parse(stream.ofString("'s'"),0).value,
               's',
               'should be s.');
    test.done();
  },  
    
  'expect (token) to return keyword': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        function (s) { return s; },
        null,
        null,
        null,
        null
    );
    
    test.equal(genlex.generator(['<-']).token(factory).parse(stream.ofString("a<-b"),1).value,
               '<-',
               'should be <-.');
    test.done();
  },  
    
  'expect (token) to return ident': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        function (s) { return s; },
        null,
        null,
        null
    );
    
    test.equal(genlex.generator(['<-']).token(factory).parse(stream.ofString("hello"),0).value,
               'hello',
               'should be hello.');
    test.done();
  },  
    
  'expect (token) to return number': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        function (s) { return s; },
        null,
        null
    );
    
    test.equal(genlex.generator(['<-']).token(factory).parse(stream.ofString("123"),0).value,
               123,
               'should be 123.');
    test.done();
  },  
    
  'expect (token) to return string': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        function (s) { return s; },
        null
    );
    
    test.equal(genlex.generator(['<-']).token(factory).parse(stream.ofString('"123"'),0).value,
               "123",
               'should be 123.');
    test.done();
  },  
    
  'expect (token) to return char': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        null,
        null,
        null,
        null,
        function (s) { return s; }
    );
    
    test.equal(genlex.generator(['<-']).token(factory).parse(stream.ofString("'a'"),0).value,
               "a",
               'should be a.');
    test.done();
  },  
    
  'expect (tokens) to return ["a","->","b"]': function(test) {
    test.expect(1);
    // tests here  
    var factory = genlex.factory(
        function (s) { return s; },
        function (s) { return s; },
        function (s) { return s; },
        function (s) { return s; },
        function (s) { return s; }
    );
    
    test.deepEqual(genlex.generator(['->']).tokens(factory).parse(stream.ofString("a -> b"),0).value,
                   ["a","->","b"],
                   'should be [a,->,b].');
    test.done();
  },  
};
    