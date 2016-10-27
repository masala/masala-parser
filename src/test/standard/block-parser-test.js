import LineParser from '../../lib/standard/line-parser';
import BlockParser from "../../lib/standard/block-parser";


function isDefined(object) {
    return typeof object !== 'undefined';
}

function isString(object) {
    return typeof object === 'string';
}

function isArray(object) {
    return object instanceof Array;
}
function isObject(object) {
    return !(object instanceof Array) && typeof object == 'object';
}



let blocParser = null;
let value = undefined;
let accepted = undefined;


function display(val, prefix = false) {
    if (val === undefined){
        val = value;
    }
    if (prefix) {
        console.info(`${prefix} : ${JSON.stringify(val)}`);
    } else {
        console.info(JSON.stringify(val));
    }
}

function testBlock(block) {
    const parsing = blocParser.parseBlock(block);
    value = parsing.value;
    accepted = parsing.isAccepted();
}



export default {
    setUp: function (done) {
        blocParser = new BlockParser();
        done();
    },

    'Two lines paragraph should be accepted': function (test) {
        test.expect(2);
        const block = 'Some talks\nand othertalks\n';
        testBlock(block);
        // tests here
        test.ok(accepted,'should be accepted.');
        console.log('value : ', value);
        test.ok(isObject(value.paragraph), 'value is an object');
        test.done();
    }
}