/**
 * Created by Nicolas Zozol on 15/12/2016.
 */

import Parser from '../../lib/standard/document-parser';
import path from 'path';

let value = undefined;


function testBlock(block) {
    const parsing = Parser.parse(block);
    value = parsing.value;
    console.info('parsing', parsing, '\n\n');
}

const standardParagraph = `Their job is to destroy
Death Stars.`;
const expectedStandardParagraph = {
    paragraph: [
        { text: 'Their job is to destroy Death Stars.' }
    ]
};

const lev1Title = '# Star Wars Rocks';
const otherLev1Title = '# Star Trek also Rocks';
const lev1AltTitle = 'Star Wars Rocks\n======';
const lev2Title = '## C3PO and R2D2';
const lev2AltTitle = 'C3PO and R2D2\n----';
const expectedLev1Title = { title: { level: 1, text: 'Star Wars Rocks' } };
const expectedOtherLev1Title = { title: { level: 1, text: 'Star Trek also Rocks' } };
const expectedLev2Title = { title: { level: 2, text: 'C3PO and R2D2' } };


const complexParagraph = `They know how to  *use the force*
  , speed up,  and destroy **Death Stars**.`;


const expectedComplexParagraph = {
    paragraph: [
        { text: 'They know how to  ' },
        { italic: 'use the force' },
        { text: '   , speed up,  and destroy ' },
        { bold: 'Death Stars' },
        { text: '.' }
    ]
};

const bullet1 = '* Look for plans';
const bullet2 = '* Find an **unexpensive** youngster';
const bullet3 = '- Kill an *old man*';
const bullet4level2 = '    - Use the `force`';
const bullet5level2 = '\t* Destroy Death Star   ';
const bullets = `${bullet1}\n${bullet2}\n${bullet3}\n${bullet4level2}\n${bullet5level2}`;


const expectedBullet1 = { bullet: { level: 1, content: [{ text: 'Look for plans' }] } };
const expectedBullet2 = {
    bullet: {
        level: 1, content: [
            { text: 'Find an ' },
            { bold: 'unexpensive' },
            { text: ' youngster' },
        ]
    }
};
const expectedBullet3 = {
    bullet: {
        level: 1, content: [
            { text: 'Kill an ' },
            { italic: 'old man' }
        ]
    }
};
const expectedBullet4level2 = {
    bullet: {
        level: 2, content: [
            { text: 'Use the ' },
            { code: 'force' }
        ]
    }
};
const expectedBullet5level2 = {
    bullet: {
        level: 2, content: [
            { text: 'Destroy Death Star   ' }
        ]
    }
};


const expectedBullets = [
    expectedBullet1,
    expectedBullet2,
    expectedBullet3,
    expectedBullet4level2,
    expectedBullet5level2
];


export default {
    setUp: function (done) {
        done();
    },

    'Multilines lines paragraph should be accepted': function (test) {
        const block = `${standardParagraph}`;
        testBlock(block);
        const expected = [expectedStandardParagraph];
        test.deepEqual(expected, value, 'bad value for multiline');
        test.done();
    },

    'Complex Multilines lines should be accepted': function (test) {
        const block = `${complexParagraph}`;
        testBlock(block);
        const expected = [expectedComplexParagraph];
        test.deepEqual(expected, value, 'bad value for complex paragraph');
        test.done();
    },

    'Read title and its paragraphs': function (test) {
        const block = `${lev1Title}\n${standardParagraph}\n\n${complexParagraph}`;
        testBlock(block);
        const expected = [
            expectedLev1Title,
            expectedStandardParagraph,
            expectedComplexParagraph
        ];

        test.deepEqual(expected, value, 'bad value for title & paragraphs');
        test.done();
    },

    'Read bullets': function (test) {
        //test.expect(2);
        const block = `${bullets}`;
        testBlock(block);

        //test.ok(accepted, 'should be accepted.');
        test.deepEqual(expectedBullets, value, 'bad value for bullets');
        test.done();
    }

    ,

    'Read title, paragraph & bullets': function (test) {
        //test.expect(2);
        const block = `${lev1Title}\n${bullets}\n${standardParagraph}`;
        testBlock(block);
        const expected = [expectedLev1Title].concat(expectedBullets).concat([expectedStandardParagraph])
        test.deepEqual(expected, value, 'bad value for bullets');
        test.done();
    },


     'Read multilevel chapters': function (test) {
     const block = `${lev1AltTitle}\n${bullets}\n ${lev2AltTitle}\n ${standardParagraph}\n  
${otherLev1Title}\n ${complexParagraph}`;
     testBlock(block);

     //test.ok(accepted, 'should be accepted.');
     const expected= [expectedLev1Title].concat(expectedBullets)
         .concat([expectedLev2Title, expectedStandardParagraph,
     expectedOtherLev1Title, expectedComplexParagraph]);

     test.deepEqual(value, expected, 'bad value for complex text');
     test.done();
     }  ,

    /*
     'Read multilevel with initial \n ': function (test) {
     //test.expect(2);
     const block = `
     ${lev1AltTitle}
     ${bullets}
     ${lev2AltTitle}
     ${standardParagraph}
     ${otherLev1Title}
     ${complexParagraph}
     `;
     testBlock(block);

     //test.ok(accepted, 'should be accepted.');
     const expected= [expectedLev1Title, expectedBullets,
     expectedLev2Title, expectedStandardParagraph,
     expectedOtherLev1Title, expectedComplexParagraph];

     test.deepEqual(value, expected, 'bad value for complex text');
     test.done();
     }  */
    'Read space code line': function (test) {


        const spaceCodeLine = '        Star Wars is an Atari game';
        const expectedSpaceCodeLine = [{ code: 'Star Wars is an Atari game' }];


        testBlock(spaceCodeLine);
        test.deepEqual(value, expectedSpaceCodeLine,  'bad value for space code line');
        test.done();
    },


    'Read tab code line': function (test) {

        const tabCodeLine = '\t\tStar Wars is an Amstrad game';
        const expectedTabCodeLine = [{ code: 'Star Wars is an Amstrad game' }];
        testBlock(tabCodeLine);
        test.deepEqual(value, expectedTabCodeLine,  'bad value for space code line');
        test.done();
    },

    'Read tab code blocks': function (test) {
        //test.expect(2);

        const haskellCode = `\t\timport Control.Monad
\t\t
\t\tsolveTable :: [String] -> [String] -> [(String, Integer)]`;

        const expectedHaskellCode = [
            { "code": "import Control.Monad" },
            { "code": ""},
            { "code": "solveTable :: [String] -> [String] -> [(String, Integer)]"  }
            ];

        testBlock(haskellCode);
        test.deepEqual(value, expectedHaskellCode, 'bad value for bullets');
        test.done();
    },
    'Read space code blocks': function (test) {
        //test.expect(2);

        // there are 8 spaces for first line, then 10 for the second line
        const spaceCodeBloc = `        Star Wars is an Amstrad game
           Star Wars is an Atari game`;


        const expectedSpaceCodeBloc = [
            { code: 'Star Wars is an Amstrad game'},
            { code:'   Star Wars is an Atari game' }
            ];


        testBlock(spaceCodeBloc);
        test.deepEqual(expectedSpaceCodeBloc, value, 'bad value for bullets');
        test.done();
    },

   /*  commented until I find a proper way to do this
    'parseFile test': function (test) {
        const fileName = path.join(__dirname, 'samples/trivial-test.md');
        const expectedTrivialFile = [{ title: { level: 1, text: 'title1' } }];
        let parserTemp = Parser.parseFile(fileName);
        test.deepEqual(parserTemp.value, expectedTrivialFile, 'bad value for file "trivial-test.md"');
        test.done();
    },  */

}