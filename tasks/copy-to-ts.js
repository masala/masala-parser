var ncp = require('ncp');
var rmfr = require('rmfr')

deleteSources()
    .then (deleteBuild)
    .then(copy)
    .catch(displayError)

function displayError(e) {
    console.error(e);
}



function deleteSources() {
    return rmfr('./integration-ts/node_modules/@masala/parser/src')
        .then( ()=> rmfr('./integration-npm/node_modules/@masala/parser/src'))

}

function deleteBuild() {
    return rmfr('./integration-ts/node_modules/@masala/parser/build')
    .then (()=>rmfr('./integration-npm/node_modules/@masala/parser/build'));
}


function copy() {
    ncp('./build/', './integration-ts/node_modules/@masala/parser/build');
    ncp('./build/', './integration-npm/node_modules/@masala/parser/build');
    ncp('./src/', './integration-ts/node_modules/@masala/parser/src');
    ncp('./src/', './integration-npm/node_modules/@masala/parser/src');
    ncp('./masala-parser.d.ts', './integration-ts/node_modules/@masala/parser/masala-parser.d.ts');
    ncp('./masala-parser.d.ts', './integration-npm/node_modules/@masala/parser/masala-parser.d.ts');
    console.log('Done --- \n');
}

