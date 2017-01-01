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

function  includesAll(str, ...values) {
    return values.reduce(function(accu, current){
        return accu
            && typeof str ==='string'
            && typeof current === 'string'
            && str.includes(current);
    }, true);
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

function blockCount(){
    // TODO : return number of blocks or items
}

function blockSize(x){
    // TODO : return size (number of lines) of xth block
}



export default {
    setUp: function (done) {
        blocParser = new BlockParser();
        done();
    },

    'Multilines lines paragraph should be accepted': function (test) {
        test.expect(3);
        const block = 'Some talks\nand othertalks\n And this one with space\n';
        testBlock(block);
        // tests here
        test.ok(accepted,'should be accepted.');
        test.ok(blockCount() === 1,'should be accepted.');
        console.log('value : ', value);
        test.ok(isObject(value.paragraph), 'value is an object');
        test.done();
    },

    'Multilines lines paragraph with one starting with space should be accepted': function (test) {
        test.expect(2);
        const block = 'Some talks\nand other\n And this one with space\n';
        testBlock(block);
        // tests here
        test.ok(accepted,'should be accepted.');
        test.ok(blockCount() === 1,'should be accepted.');
        console.log('value : ', value);
        test.ok(isObject(value.paragraph), 'value is an object');
        test.ok(includesAll(value.paragraph, 'Some', 'and other', 'with'), 'values are correct');
        test.done();
    }
    ,

    'Read title and its paragraphs': function (test) {
        test.expect(2);
        const block = 'Some talks\nand other\n And this one with space\n';
        testBlock(block);
        // tests here
        test.ok(accepted,'should be accepted.');
        test.ok(blockCount() === 1,'should be accepted.');
        console.log('value : ', value);
        test.ok(isObject(value.paragraph), 'value is an object');
        test.ok(includesAll(value.paragraph, 'Some', 'and other', 'with'), 'values are correct');
        test.done();
    }
}