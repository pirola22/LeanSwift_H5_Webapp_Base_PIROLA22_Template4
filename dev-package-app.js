var copy = require('recursive-copy');
var fs = require('fs');
var rimraf = require('rimraf');
var zipdir = require('zip-dir');

var zipName = 'customh5application.zip' 
var destDir = './toBeZipped';

var runTypeScriptCompiler = function() {
    try {
        return new Promise((fulfilled, rejected) => {
            var exec = require('child_process').exec;
            console.log('Starting tsc on ' );
                exec("tsc" , (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    if(error !== null) {
                        console.error(error);
                    }
                }); 
                fulfilled();
            });
    } catch (error) {
        console.log(error);
    }
};

var copyFolder = function() {

    var options = {
        filter: [
            '**/*',
            '!toBeZipped',
            "!"+zipName,
            '!scripts/**/*.ts',
            '!dev-base64-encode-decode.js',
            '!dev-web-server.js',
            '!dev-config.json',
            '!package.json',
            '!package-lock.json',
            '!tsconfig.json',
            '!node_modules',
            '!node_modules/**/*',
            '!README.md',
            '!dev-package-app.js'
        ]
    };

    rimraf.sync(destDir);
    rimraf.sync('./'+zipName);
     
    if (!fs.existsSync(destDir)){
        fs.mkdirSync(destDir);
    }

    copy('.', './toBeZipped', options)
    .on(copy.events.COPY_FILE_START, function(copyOperation) {
        console.info('Copying file ' + copyOperation.src + '...');
    })
    .on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
        console.info('Copied to ' + copyOperation.dest);
    })
    .on(copy.events.ERROR, function(error, copyOperation) {
        console.error('Unable to copy ' + copyOperation.dest);
    })
    .then(function(results) {
        console.info(results.length + ' file(s) copied');

        zipdir(destDir, { saveTo: zipName }, (err) => {
            if(err) {
                throw err;
            }
            rimraf.sync(destDir);
        });
    })
    .catch(function(error) {
        return console.error('Copy failed: ' + error);
    });
}

runTypeScriptCompiler()
    .then(() => {
        return copyFolder();
})
