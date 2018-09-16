var ncp = require('ncp');
var rimraf = require('rimraf');


deleteSources()

function displayError(e) {
    console.error(e);
}



function deleteSources() {
    rimraf('./integration-ts/node_modules/@masala/parser/src', deleteBuild, displayError)
}

function deleteBuild() {
    rimraf('./integration-ts/node_modules/@masala/parser/build', copy, displayError);
}


function copy() {
    ncp('./build/', './integration-ts/node_modules/@masala/parser/build');
    ncp('./src/', './integration-ts/node_modules/@masala/parser/src');
    console.log('Done --- \n');
}

