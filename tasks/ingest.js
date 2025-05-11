/**
 * This task copies all pertinent files to /ingest directory, so that
 * tools like https://gitingest.com/ can create a full good and relatively short document
 * to help AI understanding the library
 * The document is then gitingest.md at the source of the repo
 */

import ncp from 'ncp';
import rmfr from 'rmfr';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const ncpPromise = promisify(ncp);

deleteIngest()
  .then(copyFiles)
  .catch(displayError);

function displayError(e) {
  console.error(e);
}

function deleteIngest() {
  return rmfr('./ingest');
}

async function copyFiles() {
  // Create ingest directory
  fs.mkdirSync('./ingest', { recursive: true });
  
  // Copy README
  await ncpPromise('./README.md', './ingest/README.md');
  
  // Copy all markdown files from documentation
  const docFiles = fs.readdirSync('./documentation')
    .filter(file => file.endsWith('.md'));
  
  fs.mkdirSync('./ingest/documentation', { recursive: true });
  for (const file of docFiles) {
    await ncpPromise(
      path.join('./documentation', file),
      path.join('./ingest/documentation', file)
    );
  }
  
  // Copy all .spec.js files from test directories except standard
  const testDirs = ['parsec', 'specific', 'stream', 'genlex', 'data'];
  for (const dir of testDirs) {
    const sourceDir = `./src/test/${dir}`;
    const targetDir = `./ingest/test/${dir}`;
    
    if (fs.existsSync(sourceDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      
      const files = fs.readdirSync(sourceDir)
        .filter(file => file.endsWith('.spec.js'));
      
      for (const file of files) {
        await ncpPromise(
          path.join(sourceDir, file),
          path.join(targetDir, file)
        );
      }
    }
  }
  
  // Copy all files from examples
  await ncpPromise('./integration-ts/examples', './ingest/examples');
  
  console.log('Files copied to /ingest directory');
}