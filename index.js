var fs = require('fs')
require('colors')

if (!process.argv[2]) {
    console.log('Missing input file'.red)
    process.exit(1)
}

if (!process.argv[3]) {
    console.log('Missing output file'.red)
    process.exit(1)
}

fs.readFile(process.argv[2], function(error, data) {

    if (error) {
        console.log(('Error reading file: ' + error).red)
        process.exit(1)
    }

})
