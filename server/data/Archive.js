var P = require('bluebird');

module.exports.zip = function(output, action) {
    var archiver = require('archiver');
    return new P(function (resolve, reject) {

        var rejected = false;
        try {
            
            // create a file to stream archive data to.
            var archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });

            output.on('close', function() {
                resolve(archive);
                //console.log(archive.pointer() + ' total bytes');
            });

            archive.on('error', function(err) {
                if (!rejected) {
                    rejected = true;
                    reject(err);
                }   
            });

            archive.pipe(output);

            action(archive);

            archive.finalize();
        }
        catch (err) {
            if (!rejected) {
                rejected = true;
                reject(err);
            }
        }
    });
};

module.exports.unzip = function(zipPath, destPath) {
    var DecompressZip = require('decompress-zip');
    return new P(function (resolve, reject) {
        var rejected = false;
        try {
            var unzipper = new DecompressZip(zipPath);
            unzipper.on('error', function (err) {
                if (!rejected) {
                    rejected = true;
                    reject(err);
                }
            });
            
            unzipper.on('extract', function (log) {
                resolve();
            });
            
            /*
            unzipper.on('progress', function (fileIndex, fileCount) {
                console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
            });
            */
            
            unzipper.extract({
                path: destPath,
                filter: function (file) {
                    return file.type !== 'SymbolicLink';
                }
            });
        }
        catch (err) {
            if (!rejected) {
                rejected = true;
                reject(err);
            }
        }
    });
};