import  fs from 'fs';
import jsonparser from '../../lib/standard/json/jsonparser'
import stream from '../../lib/stream/index';

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
    test.(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function sampleTest(sample, test) {
    test.expect(1);
    
    // tests here  
    fs.readFile('./src/test/standard/samples/' + sample, function (err,data) {
        if (err) {
            throw err;
        }
        
        var result = { isAccepted : function() { return false; } };
        
        try {
            result = jsonparser.parse(stream.ofString(data.toString()));
        } catch (e) {
            console.log(e.stack); 
        }
        
        if (!result.isAccepted()) {        
            console.log(result);
        }  

        test.ok(result.isAccepted(), "Well formed JSON");
        test.done();                
    });    
}

export default  {
  setUp: function(done) {
    done();
  },

  'test 1k': function(test) {
    sampleTest("1k.json", test);    
  },
    
  'test 100k': function(test) {
    sampleTest("100k.json", test);    
  }
  
};