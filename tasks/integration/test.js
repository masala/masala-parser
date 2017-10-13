module.exports = function test(testName, expected, actual) {
    if (expected !== actual) {
        throw "Prepublish error for operations - Failed " + testName + " - . Expected " + expected + " , but != " + actual;
    }
}