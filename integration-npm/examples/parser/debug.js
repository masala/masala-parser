const {Stream,  C} = require('@masala/parser');
const {assertFalse} = require('../../assert');


const floorCombinator = C.string('Hello').then(C.string(' World')).debug('Found')
    .then(C.string('fail')).debug('wont be displayed', true);

const parsing = floorCombinator.parse(Stream.ofString('Hello World !!!'));
assertFalse( parsing.isAccepted(), 'Testing debug');
