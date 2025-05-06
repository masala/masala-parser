import  ncp from 'ncp';

console.log('\n\n==== Copying samples for tests===');
ncp('./src/test/standard/json/samples/', './build/test/standard/json/samples/');
ncp('./src/test/standard/markdown/samples/', './build/test/standard/markdown/samples/');
console.log('\n');