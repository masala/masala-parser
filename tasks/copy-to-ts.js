import ncp from 'ncp';
import rmfr  from 'rmfr'

deleteSources()
  .then(deleteBuild)
  .then(copy)
  .catch(displayError)

function displayError(e) {
  console.error(e);
}


function deleteSources() {
  return rmfr('./integration-ts/node_modules/@masala/parser/src')
    .then(() => rmfr('./integration-npm/node_modules/@masala/parser/src'))

}

function deleteBuild() {
  return rmfr('./integration-ts/node_modules/@masala/parser/build')
    .then(() => rmfr('./integration-ts/node_modules/@masala/parser/dist'))
    .then(() => rmfr('./integration-npm/node_modules/@masala/parser/build'));
}



function copy() {
  // Copy the src, build and .d.ts folders to the integration-ts
  ncp('./src/', './integration-ts/node_modules/@masala/parser/src');
  ncp('./build/', './integration-ts/node_modules/@masala/parser/build');
  ncp('./dist/', './integration-ts/node_modules/@masala/parser/dist');
 // ncp('./masala-parser.d.ts', './integration-ts/node_modules/@masala/parser/masala-parser.d.ts');

  // Copy the src, build and .d.ts folders to the integration-npm
  ncp('./src/', './integration-npm/node_modules/@masala/parser/src');
  ncp('./build/', './integration-npm/node_modules/@masala/parser/build');
  ncp('./dist/', './integration-npm/node_modules/@masala/parser/dist');
  //ncp('./masala-parser.d.ts', './integration-npm/node_modules/@masala/parser/masala-parser.d.ts');

  copyDeclaration();
  console.log('Done --- \n');

}

const destinations = [
  './integration-ts/node_modules/@masala/parser',
  './integration-npm/node_modules/@masala/parser',
]

function copyDeclaration(){

  for (const destination of destinations) {
    ncp('./masala-parser.d.ts', `${destination}/masala-parser.d.ts`);
    ncp('./typings', `${destination}/typings`);
    console.log(`${destination}/typings`)
    //ncp('./typings/genlex.d.ts', `${destination}/typings/genlex.d.ts`);
  }

}