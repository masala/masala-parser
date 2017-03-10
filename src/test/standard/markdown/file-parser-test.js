import mdParser from '../../../lib/standard/markdown/markdown-parser';
import stream from '../../../lib/stream/index';
import path from 'path';
import fs from 'fs';


let value = undefined;
let expected = undefined;

function testFile(sample) {

    const sampleFileName = path.join(__dirname, `samples/${sample}-test.md`);
    const expectedFileName = path.join(__dirname, `samples/${sample}-expected.json`);
    var sampleContent = fs.readFileSync(sampleFileName).toString();
    var sampleExpected = fs.readFileSync(expectedFileName).toString();

    console.info('sample: ', sampleContent, sampleExpected);
    const parsing = mdParser.parse(stream.ofString(sampleContent));
    value = parsing.value;
    expected = JSON.parse(sampleExpected);


}


export default {
    setUp: function (done) {
        done();
    },
        
    'parseFile test': function (test) {
        testFile('trivial');
        test.deepEqual(value, expected, 'bad value for file "trivial-test.md"');
        test.done();
    }

}

