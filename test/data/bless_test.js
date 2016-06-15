'use strict';

var requireHelper = require('../require_helper.js'),
    bless = requireHelper('/data/bless.js');

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

exports['bless'] = {
  setUp: function(done) {
    done();
  },
    
  'instance attribute': function(test) {
    test.expect(1);
      
    function A() {}
    function B(a) { bless(this, new A()); this.a = a; }
      
    // tests here  
    test.equal(new B(1).a, 1, 'should inherit.');
    test.done();
  },
    
  'inherited instance attribute': function(test) {
    test.expect(1);
      
    function A(a) { this.a = a; }
    function B(a) { bless(this, new A(a)); }
      
    // tests here  
    test.equal(new B(1).a, 1, 'should inherit from parent.');
    test.done();
  },
    
  'hidden inherited instance attribute': function(test) {
    test.expect(1);
      
    function A(a) { this.a = a; }
    function B(a) { bless(this, new A(a)); this.a = a+1; }
      
    // tests here  
    test.equal(new B(1).a, 2, 'should hide inherited attibute.');
    test.done();
  },
    
  'inheritance polymorphism applied': function(test) {
    test.expect(1);
      
    function A() { }
    A.prototype.getA = function () { return this.a; };
    function B(a) { bless(this, new A()); this.a = a; }
      
    // tests here  
    test.equal(new B(1).getA(), 1, 'inheritance polymophism applied.');
    test.done();
  },
    
  'inheritance polymorphism applied and hidden attribute': function(test) {
    test.expect(1);
      
    function A() { this.a = 1; }
    A.prototype.getA = function () { return this.a; };
    function B(a) { bless(this, new A()); this.a = a; }
      
    // tests here  
    test.equal(new B(2).getA(), 2, 'inheritance polymophism applied.');
    test.done();
  },
    
  'inheritance polymorphism applied and hidden attribute first': function(test) {
    test.expect(1);
      
    function A() { this.a = 1; }
    A.prototype.getA = function () { return this.a; };
    function B(a) { this.a = a; bless(this, new A()); }
      
    // tests here  
    test.equal(new B(2).getA(), 2, 'inheritance polymophism applied.');
    test.done();
  },

  'inheritance polymorphism applied and hidden method': function(test) {
    test.expect(1);
      
    function A() { }
    A.prototype.getA = function () { return 1; };
    function B() { bless(this, new A()); }
    B.prototype.getA = function () { return 2; };
      
    // tests here  
    test.equal(new B().getA(), 2, 'inheritance polymophism applied.');
    test.done();
  },
};
