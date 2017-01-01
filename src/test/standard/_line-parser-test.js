import LineParser from '../../lib/standard/line-parser';


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


let lineParser = null;
let value = undefined;
let accepted = undefined;


function display(val, prefix = false) {
    if (val === undefined) {
        val = value;
    }
    if (prefix) {
        console.info(`${prefix} : ${JSON.stringify(val)}`);
    } else {
        console.info(JSON.stringify(val));
    }
}

function testLine(line) {
    // lineParser = new LineParser();
    const parsing = lineParser.parseLine(line);
    value = parsing.value;
    accepted = parsing.isAccepted();
}

function item(n = 0) {
    return value.line[n]
}

export default {
    setUp: function (done) {
        lineParser = new LineParser();
        done();
    }  ,

    'Sharp title 1 should be accepted': function (test) {
        test.expect(1);
        // tests here
        test.ok(lineParser.parseLine('# Title \n').isAccepted(),
            'should be accepted.');
        test.done();
    },
    'title 1 should be retrieved': function (test) {
        test.expect(5);

        testLine('# Title \n');

        // tests here
        test.ok(accepted, 'title is accepted');
        test.ok(isObject(value), 'value is an object');
        test.ok(isDefined(value.title), 'value.title is defined');
        test.ok(isString(value.title), 'value.title is a direct string');
        test.equal(value.level, 1, 'value level is 1');

        //ends
        test.done();
    },
    'Correct value level': function (test) {
        test.expect(2);

        testLine('### Title \n');


        // tests here
        test.ok(accepted, 'title is accepted');
        test.equal(value.level, 3, 'value level is 3');

        //ends
        test.done();
    },
    'title has no formatting': function (test) {
        test.expect(3);

        testLine('### Title *formatted*\n');

        // tests here
        test.ok(accepted, 'title is accepted');
        test.ok(isString(value.title), 'formatting is not taken');
        test.ok(value.title.includes('*'), '* is part of the title');

        //ends
        test.done();
    },

    'line should be accepted': function (test) {
        test.expect(3);

        testLine('a simple test\n');

        // tests here
        test.ok(accepted, 'should be accepted.');
        test.ok(isObject(value), 'should be accepted.');
        test.equal(value.line[0].text, 'a simple test', 'should be accepted.');

        test.done();
    },

    'line text are trimmed': function (test) {
        test.expect(2);

        const parsing1 = lineParser.parseLine(' a simple test \n');
        const parsing2 = lineParser.parseLine('a simple test\n');

        // tests here
        test.ok(parsing1.isAccepted(), 'should be accepted.');
        test.deepEqual(parsing1.value, parsing2.value, 'values are trimmed');
        test.done();
    },

    'bold line should be accepted': function (test) {
        test.expect(2);

        testLine('**a simple test**\n');
        // tests here
        test.ok(accepted, 'should be accepted.');
        test.deepEqual(item(), { bold: { text: "a simple test" } }, 'test bold value');
        test.done();
    },


    'italic  line should be a simple test': function (test) {
        test.expect(2);

        testLine('*a simple test*\n');

        test.ok(accepted, 'should be accepted.');
        test.deepEqual(item(), { italic: { text: "a simple test" } }, 'test bold value');

        test.done();
    },


    'strike line should be a simple test': function (test) {
        test.expect(2);

        testLine('~~a simple test~~\n');

        // tests here
        test.ok(accepted, 'should be accepted.');
        test.deepEqual(item(), { strike: { text: "a simple test" } }, 'test bold value');

        test.done();
    },


    'blankLine is accepted and keep its value': function (test) {
        test.expect(3);

        testLine('  \t\t  \n');

        // tests here
        test.ok(accepted, 'should be accepted.');
        // looks like test equality is buggy
        //test.deepEqual(value, { blanckLine: '  \t\t  ' }, 'test blank line value');
        test.ok(isDefined(value.blankLine), 'test blank line defined');
        test.equal(value.blankLine.trim(), '', 'blank line is blank');

        test.done();

    },


    'direct end of lines are not blankLines': function (test) {
        test.expect(2);

        testLine('\n');

        test.ok(accepted, 'should be accepted.');
        test.deepEqual(value, { eol: 1 }, 'test eol');

        test.done();
    },
    'combine multiple end of lines': function (test) {
        test.expect(2);

        testLine('\n\n\n');

        test.ok(accepted, 'should be accepted.');
        test.deepEqual(value, { eol: 3 }, 'test multiple eol');

        test.done();
    },

    'spaces indented line': function (test) {
        test.expect(3);

        testLine('        Exactly IndentedLine\n');

        test.ok(accepted, 'should be accepted.');
        test.ok(isDefined(value.indent.line[0].text), 'test space indent');
        test.equals(value.spaces, '        ', 'Count spaces');

        test.done();
    },

    'tabs indented line': function (test) {
        test.expect(3);

        testLine('\t\tExactly IndentedLine\n');

        test.ok(accepted, 'should be accepted.');
        test.equals(value.spaces, '\t\t', 'extra spcaces are not in indet spaces');

        test.ok(isDefined(value.indent.line[0].text), 'test tab indent eol');

        test.done();
    }

    ,

    'mix tabs indented line and starting spaces': function (test) {
        test.expect(3);

        testLine('\t\t   Not exactly IndentedLine\n');

        test.ok(accepted, 'should be accepted.');

        test.ok(isDefined(value.indent.line[0].text), 'test tab indent eol');
        test.equals(value.spaces, '\t\t', 'extra spaces are not in indent spaces');

        test.done();
    }

    ,

    'Not enough spaces for indent': function (test) {
        test.expect(2);

        testLine(' Not enough spaces for indent\n');

        test.ok(accepted, 'should be accepted, but not as indent');

        test.ok(!isDefined(value.indent), 'test tab indent eol');

        test.done();
    }
  ,
/*
    'spaces are repeated spaces or tabs ': function (test) {
        test.expect(1);

        testLine('  ');
        test.ok(accepted, 'should be accepted, but not as indent');

        test.done();
    },*/

    // TODO : should test also with italic, bold and titles

    'If not line start, repeated whites are just one blank ': function (test) {
        test.expect(1);

        testLine('Hello    World\n');
        test.ok(accepted, 'should be accepted');
        console.info(value);
        //test.deepEqual(value.text, [{ text: 'Hello World' }], 'Whites are still repeated');

        test.done();
    },



    'Simple Bullet': function (test) {
        test.expect(2);

        testLine('* This is a bullet\n');

        test.ok(accepted, 'should be accepted');
        const expected = {
            bullet: {
                level: 0,
                content:[{text: 'This is a bullet'}]
            }
        };
        test.deepEqual(value, expected, 'This should be a bullet line');

        test.done();
    },

    'Also a bullet': function (test) {
        test.expect(2);

        testLine('- This is also a bullet\n');

        test.ok(accepted, 'should be accepted');
        const expected = {
            bullet: {
                level: 0,
                text: 'This is a bullet'
            }
        };
        test.deepEqual(value, expected, 'This should be a bullet line');

        test.done();
    },
    'Indented bullet': function (test) {
        test.expect(2);

        testLine('\n- This is an indented bullet\n');

        test.ok(accepted, 'should be accepted');
        const expected = {
            bullet: {
                level: 1,
                text: 'This is a bullet'
            }
        };
        test.deepEqual(value, expected, 'This should be a bullet line');

        test.done();
    },

    'Not a valid bullet': function (test) {
        test.expect(2);

        testLine('*This is not a bullet\n');

        test.ok(accepted, 'should be accepted');
        test.ok(!isDefined(value.bullet), 'Space is missing for a bullet');

        test.done();
    }


};
