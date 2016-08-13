import stream from '../../lib/stream/index';
import markdown from '../../lib/standard/markdown';

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
    
  'title 1 should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('# Title \n'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'title 1 should be retrieved': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('# Title \n'),0).value, 
                   [ { title : [ { text: " Title " } ], level : 1 } ],
                   'should be a title1.');
    test.done();
  },
    
  'title 2 should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('## Title \n'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'title 2 should be retrieved': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('## Title \n'),0).value, 
                   [ { title : [ { text: " Title " } ], level : 2 } ],
                   'should be a title2.');
    test.done();
  },
    
  'title 3 should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('### Title \n'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'title 3 should be retrieved': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('### Title \n'),0).value, 
                   [ { title : [ { text: " Title " } ] , level : 3} ],
                   'should be a title3.');
    test.done();
  },

  'title alternate 1 should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('Title\n====='),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'title alternate 1 should be title1': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('Title\n=====\n'),0).value, 
                   [ { title : [ { text: "Title" } ], level : 1 } ],
                   'should be a title1.');
    test.done();
  },

  'title alternate 2 should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('Title\n-----'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'title alternate 2 should be title2': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('Title\n-----'),0).value, 
                   [ { title : [ { text: "Title" } ], level : 2 } ],
                   'should be a title2.');
    test.done();
  },

  'line should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('a simple test\n'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('a simple test\n'),0).value, 
                   [ { text: "a simple test" } ],
                   'should be a simple test line.');
    test.done();
  },

  'bold line should be accepted': function(test) {
    test.expect(1);
    // tests here
    test.ok(markdown.parse(stream.ofString('**a simple test**\n'),0).isAccepted(), 
            'should be accepted.');
    test.done();
  },
    
  'bold (1) line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('**a simple test**\n'),0).value, 
                   [ { bold : { text: "a simple test" } } ],
                   'should be a simple test line.');
    test.done();
  },
    
  'bold (2) line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('__a simple test__\n'),0).value, 
                   [ { bold : { text: "a simple test" } } ],
                   'should be a simple test line.');
    test.done();
  },
    
  'italic (1) line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('*a simple test*\n'),0).value, 
                   [ { italic : { text: "a simple test" } } ],
                   'should be a simple test line.');
    test.done();
  },
    
  'italic (2) line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('_a simple test_\n'),0).value, 
                   [ { italic : { text: "a simple test" } } ],
                   'should be a simple test line.');
    test.done();
  },
    
  'strike line should be a simple test': function(test) {
    test.expect(1);
    // tests here
    test.deepEqual(markdown.parse(stream.ofString('~~a simple test~~\n'),0).value, 
                   [ { strike : { text: "a simple test" } } ],
                   'should be a simple test line.');
    test.done();
  }
};