function main(process) {
    var fs = require('fs');        
    
    fs.readFile(process.argv[2], function (err,data) {
        if (err) {
            throw err;
        }

        var stream = require('../../lib/stream/index.js'),
            jsonparser = require('../../lib/standard/jsonparser.js'),
            result = jsonparser.parse(stream.ofString(data.toString()));
        
        
    });    
}

main(process);