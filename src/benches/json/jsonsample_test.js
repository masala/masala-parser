import testParser from '../test_core';
import fs from "fs";
import jsonparser from "../../lib/standard/json/jsonparser";

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
  fs.readFile("./src/benches/json/samples/" + sample, function(
    err,
    data
  ) {
    if (err) {
      throw err;
    }

    const result = testParser(jsonparser, data.toString());
    test.ok(result.isAccepted(), "Well formed JSON");
    test.done();
  });
}

export default {
  setUp: function(done) {
    done();
  },

  "test 1k": function(test) {
    sampleTest("1k.json", test);
  },

  "test 100k": function(test) {
    sampleTest("100k.json", test);
  }
};
