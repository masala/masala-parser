import stream from '../../lib/stream/index';
import {F, C} from '../../lib/parsec/index';

export default {
    setUp: function(done) {
        done();
    },

    'expect (char) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (char) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.char('a').parse(stream.ofString('b'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (char) to be refused': function(test) {
        test.expect(1);
        // tests here
        test.throws(function() {
            C.char('aa');
        });
        test.done();
    },

    'expect (notChar) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.notChar('a').parse(stream.ofString('b'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (notChar) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.notChar('a').parse(stream.ofString('a'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (notChar) to be refused': function(test) {
        test.expect(1);
        // tests here
        test.throws(function() {
            C.notChar('aa');
        });
        test.done();
    },

    'expect (charNotIn) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charNotIn('a').parse(stream.ofString('b'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (charNotIn) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charNotIn('a').parse(stream.ofString('a'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (charIn) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charIn('a').parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (charIn) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.charIn('a').parse(stream.ofString('b'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (lowerCase) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.lowerCase.parse(stream.ofString('a'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (lowerCase) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.lowerCase.parse(stream.ofString('A'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect (upperCase) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.upperCase.parse(stream.ofString('A'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (upperCase) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.upperCase.parse(stream.ofString('z'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect upper (letter) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.letter.parse(stream.ofString('A'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect lower (letter) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.letter.parse(stream.ofString('z'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },
    'expect space (letter) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.letter.parse(stream.ofString(' '), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect non (letter) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.letter.parse(stream.ofString('0'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect occidental letter to be accepted': function(test) {
        test.ok(C.letter.parse(stream.ofString('a'), 0).isAccepted());
        test.ok(C.letterAs().parse(stream.ofString('a'), 0).isAccepted());
        test.ok(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(stream.ofString('a'))
                .isAccepted()
        );
        test.ok(
            C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(stream.ofString('é'))
                .isAccepted()
        );
        test.ok(
            !C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(stream.ofString('Б'))
                .isAccepted()
        );
        test.ok(
            !C.letterAs(C.OCCIDENTAL_LETTER)
                .parse(stream.ofString('÷'))
                .isAccepted()
        );
        test.done();
    },

    'expect occidental letters to be accepted': function(test) {
        test.ok(
            C.letters.then(F.eos).parse(stream.ofString('aéÉ'), 0).isAccepted()
        );
        test.ok(
            C.lettersAs()
                .then(F.eos)
                .parse(stream.ofString('aéÉ'), 0)
                .isAccepted()
        );
        test.ok(
            C.lettersAs(C.OCCIDENTAL_LETTER)
                .parse(stream.ofString('a'))
                .isAccepted()
        );
        test.ok(
            C.lettersAs(C.OCCIDENTAL_LETTER)
                .then(F.eos)
                .parse(stream.ofString('éA'))
                .isAccepted()
        );
        test.ok(
            !C.lettersAs(C.OCCIDENTAL_LETTER)
                .then(F.eos)
                .parse(stream.ofString('БAs'))
                .isAccepted()
        );
        test.done();
    },

    'expect ascii letter to be accepted': function(test) {
        test.ok(
            C.letterAs(C.ASCII_LETTER)
                .parse(stream.ofString('a'), 0)
                .isAccepted()
        );
        test.ok(
            !C.letterAs(C.ASCII_LETTER).parse(stream.ofString('é')).isAccepted()
        );
        test.ok(
            !C.letterAs(C.ASCII_LETTER).parse(stream.ofString('Б')).isAccepted()
        );
        test.done();
    },

    'expect ascii letters to be accepted': function(test) {
        test.ok(
            C.lettersAs(C.ASCII_LETTER)
                .then(F.eos)
                .parse(stream.ofString('a'))
                .isAccepted()
        );
        test.ok(
            !C.lettersAs(C.ASCII_LETTER)
                .then(F.eos)
                .parse(stream.ofString('éA'))
                .isAccepted()
        );
        test.ok(
            !C.lettersAs(C.ASCII_LETTER)
                .then(F.eos)
                .parse(stream.ofString('БAs'))
                .isAccepted()
        );
        test.done();
    },

    'expect utf8 letter to be accepted': function(test) {
        test.ok(
            C.letterAs(C.UTF8_LETTER).parse(stream.ofString('a')).isAccepted()
        );
        test.ok(
            C.letterAs(C.UTF8_LETTER).parse(stream.ofString('é')).isAccepted()
        );
        test.ok(
            C.letterAs(C.UTF8_LETTER).parse(stream.ofString('Б')).isAccepted()
        );
        test.ok(
            !C.letterAs(C.UTF8_LETTER).parse(stream.ofString('÷')).isAccepted()
        );
        test.done();
    },
    'expect utf8 letters to be accepted': function(test) {
        test.ok(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos)
                .parse(stream.ofString('a'))
                .isAccepted()
        );
        test.ok(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos)
                .parse(stream.ofString('éA'))
                .isAccepted()
        );
        test.ok(
            C.lettersAs(C.UTF8_LETTER)
                .then(F.eos)
                .parse(stream.ofString('БAs'))
                .isAccepted()
        );
        test.ok(
            !C.letterAs(C.UTF8_LETTER)
                .then(F.eos)
                .parse(stream.ofString('Б÷As'))
                .isAccepted()
        );
        test.done();
    },

    'expect unknown letters to be rejected': function(test) {
        const line = stream.ofString('a');
        let errorFound = false;
        try {
            const combinator = C.lettersAs(Symbol('UNKNOWN')).then(F.eos);
            combinator.parse(line);
        } catch (error) {
            errorFound = true;
        }
        test.ok(errorFound);
        test.done();
    },

    'expect (letters) to be accepted': function(test) {
        test.expect(2);
        // tests here
        const parsing = C.letters
            .thenLeft(F.eos)
            .parse(stream.ofString('someLetters'), 0);
        test.equal(parsing.isAccepted(), true, 'should be accepted.');
        test.deepEqual(parsing.value, 'someLetters', 'should be equal.');
        test.done();
    },

    'expect (letters) with space to be rejected': function(test) {
        test.expect(2);
        // tests here
        const parsing = C.letters
            .then(F.eos)
            .parse(stream.ofString('some Letters'), 0);
        test.equal(parsing.isAccepted(), false, 'should be rejected.');
        test.notDeepEqual(parsing.value, 'some Letters', 'should be equal.');
        test.done();
    },

    'expect (letters) with number to be rejected': function(test) {
        test.expect(1);
        // tests here
        const parsing = C.letters
            .then(F.eos)
            .parse(stream.ofString('some2Letters'), 0);
        test.equal(parsing.isAccepted(), false, 'should be accepted.');
        test.done();
    },

    'expect (letters) to return a string, not an array of letters': function(
        test
    ) {
        test.expect(1);
        // tests here
        const parsing = C.letters
            .thenLeft(F.eos)
            .parse(stream.ofString('someLetters'), 0);
        test.equal(parsing.value, 'someLetters', 'not a string');
        test.done();
    },

    'expect (string) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.string('Hello').parse(stream.ofString('Hello'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (string) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.string('hello').parse(stream.ofString('hell'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'test stringIn': function(test) {
        let line = stream.ofString('James Bond');

        const combinator = C.stringIn(['The', 'James', 'Bond', 'series']);
        const value = combinator.parse(line).value;
        test.ok(typeof value === 'string');
        test.ok(value === 'James');
        test.done();
    },

    'test stringIn Similar': function(test) {
        // Checks the search comes back after each search
        let line = stream.ofString('Jack James Jane');

        const combinator = C.stringIn(['Jamie', 'Jacko', 'Jack']);
        const parsing = combinator.parse(line);
        const value = parsing.value;
        test.equal(typeof value, 'string');
        test.equal(value, 'Jack');
        test.equal(parsing.offset, 'Jack'.length);
        test.done();
    },

    'test stringIn one string sidecase': function(test) {
        let line = stream.ofString('James');

        const combinator = C.stringIn(['James']);
        const value = combinator.parse(line).value;
        test.ok(typeof value === 'string');
        test.ok(value === 'James');
        test.done();
    },

    'test stringIn empty sidecase': function(test) {
        let line = stream.ofString('James');

        const combinator = C.stringIn([]).then(F.eos);
        const parsing = combinator.parse(line);
        test.ok(!parsing.isAccepted());
        test.done();
    },

    'test stringIn empty accept nothing sidecase': function(test) {
        let line = stream.ofString('');

        const combinator = C.stringIn([]).then(F.eos);
        const parsing = combinator.parse(line);
        test.ok(parsing.isAccepted());
        test.done();
    },

    'expect (notString) to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.notString('**').parse(stream.ofString('hello'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },

    'expect (notString) to be h': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.notString('**').parse(stream.ofString('hello'), 0).value,
            'h',
            'should be h.'
        );
        test.done();
    },

    'expect (notString) to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.notString('**').parse(stream.ofString('**hello'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect accent to be accepted': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString('é'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },
    'expect cyriliq to be accepted': function(test) {
        test.expect(2);
        // tests here
        //Белград
        //български
        test.equal(
            C.utf8Letter.parse(stream.ofString('Б'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.equal(
            C.utf8Letter.parse(stream.ofString('б'), 0).isAccepted(),
            true,
            'should be accepted.'
        );
        test.done();
    },
    'expect dash to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString('-'), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },
    'expect "nothing" to be rejected': function(test) {
        test.expect(1);
        // tests here
        test.equal(
            C.utf8Letter.parse(stream.ofString(''), 0).isAccepted(),
            false,
            'should be rejected.'
        );
        test.done();
    },

    'expect emoji to be accepted': function(test) {
        // It's super important for emoji to test there is EOS just after,
        // because some emoji takes two \uWXYZ codes, where utf_8 does not
        test.ok(
            !C.emoji.then(F.eos).parse(stream.ofString('б'), 0).isAccepted()
        );
        test.ok(
            !C.emoji.then(F.eos).parse(stream.ofString('a'), 0).isAccepted()
        );
        // multiple emojis are also accepted as one
        test.ok(
            C.emoji.then(F.eos).parse(stream.ofString('🐵🐵✈️'), 0).isAccepted()
        );
        test.ok(
            C.emoji.then(F.eos).parse(stream.ofString('✈️'), 0).isAccepted()
        );
        // Emoji 5.0 released in June 2017.
        test.ok(C.emoji.then(F.eos).parse(stream.ofString('🥪')).isAccepted());
        test.done();
    },
};
