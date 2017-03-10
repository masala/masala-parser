/**
 * Created by Simon on 14/12/2016.
 */

import Parser from '../../../lib/standard/markdown/text-parser';

let value = undefined;
let accepted = undefined;
let parser = null


function testLine(line){
    let parsing = parser.parse(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
}

export default {
    setUp: function (done) {

        parser = Parser;
        done();
    },




    'test empty text': function (test) {
            test.expect(2);
    
            testLine('');
            test.ok(!accepted, 'empty line are to be rejected');
    
            testLine('   ');
            test.ok(!accepted, 'blank line are to be rejected');
    
            test.done();
        },

    
        'test simple text': function (test) {
            test.expect(2);
    
            testLine('text');
            test.deepEqual({paragraph:[{text:'text'} ]}, value );
    
            testLine('  text ');
            test.deepEqual({paragraph:[{text:'text '} ]}, value );
    
            test.done();
        },

        'test italic': function (test) {
            test.expect(1);
    
            testLine('*text*');
            test.deepEqual({paragraph:[{italic:'text'}]}, value );
    
            test.done();
        },
    
        'test bold': function (test) {
            test.expect(1);
    
            testLine('**text**');
            test.deepEqual({paragraph:[{bold:'text'} ]}, value );
    
            test.done();
        },
    
    
        'test combined format': function (test) {
            test.expect(1);
    
            testLine('  *italic* text **then bold** ');
            let expected={paragraph:[{italic:'italic'},{text:' text '}
                ,{bold:'then bold'}, {text:' '} ]}
            test.deepEqual(expected, value );
    
            test.done();
        },


    'single \\n must be translated as space': function (test) {
        test.expect(1);

        testLine('  *italic* text\n**then bold** ');
        let expected={paragraph:[{italic:'italic'},{text:' text '}
            ,{bold:'then bold'}, {text:' '} ]}
        test.deepEqual(expected, value );

        test.done();
    },

}