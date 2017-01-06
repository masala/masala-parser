var ncp = require('ncp');

console.log('==== building compile with node ===');
ncp('./src/test/standard/samples/', './build/test/standard/samples/');
console.log('\n');