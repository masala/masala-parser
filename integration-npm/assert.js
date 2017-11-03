module.exports = {
    assertArrayEquals(expected, actual, testName = "Unknown Test") {
        if (!arraysEqual(expected, actual)) {
            throw new Error( "Prepublish error for operations - Failed " + testName +
                " - . Expected " + expected + " , but != " + actual);
        }
    },
    assertEquals(expected, actual, testName = "Unknown Test") {
        if (expected !== actual) {
            throw new Error( "Prepublish error for operations - Failed " + testName +
            " - . Expected " + expected + " , but != " + actual);
        }
    },

    assertTrue(test, testName = "Unknown Test"){
        if (!test) {
            throw new Error ("Prepublish error for operations - Failed " + testName);
        }
    },

    assertFalse(test, testName = "Unknown Test"){
        if (test) {
            throw new Error ("Prepublish error for operations - Failed " + testName);
        }
    }
};



function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}