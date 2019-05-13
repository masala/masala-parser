import {title} from "../lib/title-parser";
import {assertDeepEquals, assertEquals, assertFalse, assertTrue} from "../../../assert";
import {bullet, bulletBlock} from "../lib/bullet-parser";
import {F, GenLex, Streams} from "@masala/parser";
import {eol} from "../lib/token";


export const bulletsTests = {

    'test text normal': function () {
        const line = `This is not a bullet`;
        let actual = bullet().val(line);
        assertEquals(actual, undefined, 'Normal text should not be accepted as a bullet');

    },

    'test normal bullet': function () {
        const line = `* This is a bullet`;
        let actual = bullet().val(line);
        let expected = {
            type: 'bullet',
            level: 1,
            children: [],
            content: [{type: 'text', text: 'This is a bullet'}],
        };
        assertDeepEquals(
            expected,
            actual,
            'problem test:test normal bullet'
        );

    },

    'test bullet level 2': function () {
        let line = '  * This is a lvl2 bullet';
        let actual = bullet().val(line);
        let expected = {
            type: 'bullet',
            level: 2,
            content: [{type: 'text', text: 'This is a lvl2 bullet'}],
        }
        assertDeepEquals(
            expected,
            actual,
            'problem test:test bullet Lvl2'
        );

        line = '  - This is a lvl2 bullet';
        actual = bullet().val(line);

        assertDeepEquals(
            expected,
            actual,
            'problem test:test bullet Lvl2'
        );

    },

    'test bullet level 2 mix tab spaces': function () {
        const line = '\t  * This is another lvl2 bullet\n  ';
        let actual = bullet().val(line);

        let expected = {
            type: 'bullet',
            level: 2,
            content: [{type: 'text', text: 'This is another lvl2 bullet'}],
        };

        assertDeepEquals(
            expected,
            actual,
            'problem test:test bullet Lvl2'
        );

    },

    'test bullet et format': function () {
        const line =
            '* This is a bullet *with italic* and even **bold characters**\n  ';
        let actual = bullet().val(line);
        let expected = {
            type: 'bullet',
            level: 1,
            children: [],
            content: [
                {type: 'text', text: 'This is a bullet'},
                {type: 'italic', text: 'with italic'},
                {type: 'text', text: 'and even'},
                {type: 'bold', text: 'bold characters'}
            ]
        };
        assertDeepEquals(
            expected,
            actual,
            'problem test:test bullet et format'
        );

    },

    'test eol is not eaten with simple bullet': function () {
        const text = `* This is a bullet`;
        const line = text + '\n';


        let response = bullet().parse(Streams.ofString(line));
        assertTrue(response.isAccepted());
        assertEquals(response.offset, text.length);

    },


    'test simple bullet block': function () {
        const block = `* This is first bullet
* This is another bullet`;

        let response = bulletBlock().parse(Streams.ofString(block));
        assertTrue(response.isAccepted());
        assertTrue(response.isEos())

    },

    'test multilevel bullet block': function () {
        const block = `* This is first bullet
  - This is a child
  - This is another child`;

        const text=block+'\n';

        let response = bulletBlock().parse(Streams.ofString(text));
        assertTrue(response.isAccepted());
        assertEquals(block.length, response.offset);
        assertFalse(response.isEos());

        let otherResponse=bulletBlock().then(eol()).parse(Streams.ofString(text));
        assertTrue(otherResponse.isAccepted());
        assertTrue(otherResponse.isEos());


    },




        'test complex bullet block': function () {
            const block = `* This is first bullet
* This is another bullet
  - with *a* child
  - and a **final point**
`;

            let actual = bulletBlock().val(block);

            let expected = {
                type: 'bulletBlock', bullets: [{
                    "type": "bullet",
                    "level": 1,
                    "content": [{"type": "text", "text": "This is first bullet"}],
                    "children": []
                }, {
                    "type": "bullet",
                    "level": 1,
                    "content": [{"type": "text", "text": "This is another bullet"}],
                    "children": [{
                        "type": "bullet",
                        "level": 2,
                        "content": [{"type": "text", "text": "with"}, {"type": "italic", "text": "a"}, {
                            "type": "text",
                            "text": "child"
                        }]
                    }, {
                        "type": "bullet",
                        "level": 2,
                        "content": [{"type": "text", "text": "and a"}, {"type": "bold", "text": "final point"}]
                    }]
                }]
            };

            assertDeepEquals(
                expected,
                actual,
                'problem with Bullet Block'
            );

        },

        'test two blocks': function () {
            const block = `* The princess Leia was an important character
* Han Solo is a murderer
    - but cleared by technology
* Force is strong

* Luke Skywalker is strong`;


            let genlex = new GenLex();
            genlex.setSeparatorsParser(eol().then(eol().rep()));
            const tkBullets = genlex.tokenize(bulletBlock(), 'bulletBlock', 500);

            const grammar = tkBullets.rep().array();

            let parser = genlex.use(grammar);



            let actual = parser.val(block);
            assertEquals(2, actual.length);

        }

};
