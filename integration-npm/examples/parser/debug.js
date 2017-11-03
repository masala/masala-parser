const {Streams,  C} = require('@masala/parser');
const {assertFalse} = require('../../assert');


const floorCombinator = C.string('Hello').then(C.string(' World')).debug('Found')
    .then(C.string('fail'));

const parsing = floorCombinator.parse(Streams.ofString('Hello World !!!'));
assertFalse( parsing.isAccepted(), 'Testing debug');
