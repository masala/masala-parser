This document is for contributors who want to publish. You must have
correct ssh key

`npm run dist` will create the browserified distributed file, thought it's not
the main file
 
        "main": "build/index.js",

### Make a pre-release to test stuff
        
then level-up the version number in package.json

        "version": "0.5.0-alpha1",
        
then publish

        npm publish  --access=public --tag alpha1
        
        
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
        