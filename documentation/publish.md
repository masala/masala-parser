This document is for contributors who want to publish. You must have
correct ssh key


Integration test at lower level
-----

TL;DR: run `npm run compile` then `node tasks/integrate.js`

`npm run compile` will compile files with babel; `package.json` says users will import
 
        "main": "build/index.js",
        
        
then `tasks/post-compile` will copy json files needed for unit and performance tests.

`npm run prepublish` will make a few integration test with this compiled version. 

These prepublish tests cant be run independently with `node tasks/integrate.js`


### Make a pre-release to test stuff
        
then level-up the version number in package.json

        "version": "0.5.0-alpha1",
        
then publish

        npm publish  --access=public
        
        
Check then with integration-npm

        cd integration-npm
        # change the dependencie in package.json
        npm install
        # it must load the new published masala
        node integrate.js
        # >>> should write 'true'
        # and: === Post publish Integration SUCCESS ! :) ===

If fail : 

        # go back to main masala project
        cd ..
        npm unpublish --force # oups !
        # change what is wrong
        # change version to 0.4.0-prerelease2
        npm publish
        # test again integration
        
If work : 

* Set tag on github. On branch master :
* Change version on package.json
* commit & push 
* `git tag v0.5.0 master`
* `git push origin v0.5.0` 
* `npm publish  --access=public`



        # careful, especially for major release
        # YOU CANNOT UNPUBLISH easily !!!!
        npm unpublish --force  # it would remove a beta, no big deal
        # go back to main masala project
        cd ..
        # change version to to 0.4.0
        npm publish  --access=public

After publishing
---

Every integration tests must be tested with the new npm package
Then change must be published on Github
        