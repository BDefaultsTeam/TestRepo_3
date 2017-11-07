// Copyright (c) 2013 Pixel Lab - MIT License

/* 

// Example use inside gruntfile.js:

azureUpload: {
    siteCdn: {
        options: {
            storageAccount: 'YOUR_ACCOUNT_NAME',
            storageAccessKey: 'YOUR_KEY',
            container: 'site',
            cacheControl: 'public, max-age=31556926'  // 1 year
        },
        expand: true,
        cwd: 'temp/cdn/',
        src: [ '**' ]
    }
}

*/

module.exports = function(grunt) {
    'use strict';

    var azure = module.require('azure-storage');

    grunt.registerMultiTask('azureUpload', 'Upload files to Azure Storage', function() {

        var options = this.options({
            storageAccount: undefined,
            storageAccessKey: undefined,
            container: undefined,
            cacheControl: undefined
        });

        var blobService = azure.createBlobService(
            options.storageAccount,
            options.storageAccessKey);

        //grunt.log.warn(JSON.stringify(this.files, null, 4));

        // get files that exist locally
        var localFiles = this.files.filter(function(pair) {

            // hmm, doesn't feel right. but there has to be a 1:1 src:dest mapping
            var src = pair.src[0];

            // make sure the file exists and is not a directory
            if (!grunt.file.exists(src)) {
                grunt.log.warn('Source file "' + src + '" not found.');
                return false;
            } else if (!grunt.file.isFile(src)) {
                return false;
            }

            return true;
        });

        // keep track of existing and uploaded files
        var tally = {
            existing: 0,
            uploaded: 0
        };

        // keep track of pending uploads
        var done = this.async();
        var pendingFiles = localFiles.length;
        var onFileComplete = function() {
            pendingFiles--;
            if (pendingFiles === 0) {

                grunt.log.writeln(
                    'Azure Storage: ' + tally.uploaded.toString().cyan + ' uploads, ' +
                    tally.existing.toString().cyan + ' existing (skipped)');

                done();
            }
        };
        
        localFiles.forEach(function(pair) {

            blobService.getBlobProperties(
                options.container,
                pair.dest, 
                function(error, blobResult) {
                    
                    // if no error, it means the file already exists
                    if (!error) {
                        //grunt.log.writeln('Azure file: ' + pair.dest + ' already exists');
                        tally.existing++;
                        onFileComplete();    
                    } else {

                        // NOTE: options are modified, so they CANNOT be re-used
                        var blobOptions = {
                            contentSettings : { 
                                cacheControl: options.cacheControl
                            }
                        };

                        blobService.createBlockBlobFromLocalFile(
                            options.container,
                            pair.dest,
                            pair.src[0],
                            blobOptions,
                            function (error, blobResult) {

                                if (error) {
                                    grunt.log.error('Error uploading Azure file: ' + pair.dest + ' error: ' + error);
                                } else {
                                    //grunt.log.writeln('Uploaded Azure file: ' + pair.dest);
                                    tally.uploaded++;
                                }

                                onFileComplete();
                            });
                    }
                });
        });

    });

};