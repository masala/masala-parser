import  {Tuple, NEUTRAL, isTuple, tuple} from '../../lib/data/tuple';


export default {
    setUp: function (done) {
        done();
    },

    'empty tuple': function (test) {
        test.expect(1);
        // tests here
        test.equal(tuple().isEmpty(), true, 'should be empty.');
        test.done();
    },

    'non empty tuple': function (test) {
        test.expect(1);
        // tests here
        test.equal(tuple().append(1).isEmpty(), false, 'should not be empty.');
        test.done();
    },



    'retrieve non empty array': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(new Tuple([1, 2]).array(), [1, 2], 'should not be empty.');
        test.done();
    },

    'retrieve joined characters array': function (test) {
        test.expect(1);
        // tests here
        test.deepEqual(new Tuple(['1', '2']).join(''), '12', 'should be "12".');
        test.done();
    },
    'tuple size': function (test) {
        test.expect(1);
        // tests here
        const myTuple = new Tuple([1, 2, 3, 4]);

        test.equal(4, myTuple.size());

        test.done();
    },

    'single is returning the first element of the tuple' : function(test){
        const l = new Tuple([1, 2]);


        test.equal (1, l.single());

        test.done();
    },


    'NEUTRAL is not added to the tuple': function (test) {
        let v = NEUTRAL;
        let vTuple = tuple().append(NEUTRAL);

        test.equal(vTuple.size(), 0)
        vTuple = vTuple.append(v).append( 3).append( v).append( 5);
        test.equal(vTuple.size(), 2)
        test.done();
    },
    'tuple and NEUTRAL can be added in a Tuple': function (test) {



        const flat = new Tuple([2, 4, 5]);

        const result = tuple().append(NEUTRAL).append( flat).append(1).append(NEUTRAL);

        test.deepEqual(result, new Tuple([2, 4, 5, 1]));

        test.done()
    }
};
