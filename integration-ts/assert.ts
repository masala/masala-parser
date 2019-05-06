export function assertArrayEquals(expected: Array<any>, actual: Array<any>, testName = "Unknown Test") {
    if (!arraysEqual(expected, actual)) {
        throw new Error("Prepublish error for operations - Failed " + testName +
            " - . Expected " + expected + " , but != " + actual);
    }
}

export function assertEquals(expected: any, actual: any, testName = "Unknown Test") {
    if (expected !== actual) {
        throw new Error("Prepublish error for operations - Failed " + testName +
            " - . Expected " + expected + " , but != " + actual);
    }
}

export function assertTrue(test: boolean, testName = "Unknown Test") {
    if (!test) {
        throw new Error("Prepublish error for operations - Failed " + testName);
    }
}

export function assertFalse(test: boolean, testName = "Unknown Test") {
    if (test) {
        throw new Error("Prepublish error for operations - Failed " + testName);
    }
}

function arraysEqual(a: Array<any>, b: Array<any>) {
    if (a === b) return true;
    if (a === null && b !== null) throw a + ' is null';
    if (a !== null && b === null) throw b + ' is null';


    if (a.length !== b.length) throw 'Arrays arr of different sizes';


    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) throw 'Arrays are differents at index ' + i;
    }
    return true;


}

export function assertDeepEquals(a: any, b: any, testName = 'Unknown test') {
    return assertEquals(JSON.stringify(a), JSON.stringify(b), testName);
}

export function launch(collection: any) {

    for (let key in collection) {
        let f: () => void = collection[key];
        f.apply({});
    }
}






