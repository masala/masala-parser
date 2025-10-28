This document is for contributors who want to publish. You must have correct ssh
key

## Integration test at lower level

TL;DR: run `npm run compile` then `node tasks/integrate.js`

`npm run compile` will compile files with babel; `package.json` says users will
import

        "main": "build/index.js",

then `tasks/post-compile` will copy json files needed for unit and performance
tests.

`npm run prepublish` will make a few integration test with this compiled
version.

These prepublish tests cant be run independently with `node tasks/integrate.js`

### Make a pre-release to test stuff

then level-up the version number in package.json

        "version": "2.1.0-alpha1",

Check compile, and deploy locally to `integration-ts folder`

        npm run cover # check 100% is covered
        npm run dist  # build and copy the files
        npm run integration # copy files to integration folder and run the integration tests

It should print the test results

then you can publish

        npm publish  --access=public

If work :

- Set tag on github. On branch master :
- Change version on package.json
- commit & push
- `git tag v2.1.0 master`
- `git push origin v2.1.0`
- `npm publish  --access=public`

Warning: You cannot unpublish easily after 72 hours, but you can deprecate the
package
