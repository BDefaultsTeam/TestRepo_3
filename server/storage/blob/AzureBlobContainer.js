var P = require('bluebird');
var _ = require('lodash');
var azure = require('azure-storage');
var mime = require('mime');
var fs = P.promisifyAll(require('fs'));
var path = require('path');

function AzureBlobContainer(accountName, accountKey, containerName) {
    this.name = containerName;
    this.service = azure.createBlobService(accountName, accountKey);
}

var listBlobs = function(service, container, continuationToken, options) {
    return new P(function (resolve, reject) {
        service.listBlobsSegmented(container, continuationToken, options,
            function(error, result /*, response */){
                if (error){
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

var listBlobsWithPrefix = function(service, container, prefix, continuationToken, options) {
    return new P(function (resolve, reject) {
        service.listBlobsSegmentedWithPrefix(container, prefix, continuationToken, options,
            function(error, result /*, response */){
                if (error){
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

AzureBlobContainer.prototype.getEnumerator = function(prefix, suggestedPageSize) {

    var self = this;
    
    var entries = [];
    var noMoreEntries = false;
    var continuationToken = null;
    var ensureEntries = function() {
        // no need to fetch if we still have results or there are no more
        if (entries.length > 0 || noMoreEntries) {
            return P.resolve();
        }

        var options = suggestedPageSize ? { maxResults: Math.min(suggestedPageSize, 5000) } : null;
        var listPromise;
        if (prefix) {
            listPromise = listBlobsWithPrefix(self.service, self.name, prefix, continuationToken, options);
        } else {
            listPromise = listBlobs(self.service, self.name, continuationToken, options);
        }

        return listPromise.then(function(result) {
            Array.prototype.push.apply(entries, result.entries);
            continuationToken = result.continuationToken;
            noMoreEntries = !continuationToken;
        });
    };
  
    var getNext = function() {
        return ensureEntries().then(function() {
            if (entries.length > 0) {
                return entries.shift();
            }
        });
    };

    return getNext;
};

AzureBlobContainer.prototype.listAllBlobs = function() {
    return this.listAllBlobsWithPrefix(null);
};

AzureBlobContainer.prototype.listAllBlobsWithPrefix = function(prefix) {
    var getNext = this.getEnumerator(prefix, 5000);

    var results = [];
    var addNextToResults = function() {
        return getNext().then(function(entry) {
            if (entry) {
                results.push(entry);
                return addNextToResults();
            }
        });
    };

    return addNextToResults().then(function() {
        return results;
    });
};

AzureBlobContainer.prototype.getBlobText = function(blobName) {
    return new P(_.bind(function (resolve, reject) {
        this.service.getBlobToText(this.name, blobName,
            function(error, blobContent /*, blob */){
                if (error){
                    reject(error);
                } else {
                    resolve(blobContent);
                }
            }
        );
    }, this));
};

AzureBlobContainer.prototype.getBlobJson = function(blobName) {
    //var start = Date.now();
    return this.getBlobText(blobName)
        .then(function(data) {
            //var elapsed = Date.now() - start;
            //console.log(blobName + ' downloaded in ' + elapsed + 'ms');
            try {
                return JSON.parse(data);
            }
            catch (err) {
                console.error('JSON parse error for ' + blobName +  ' : ' + err);
                return null;
            }
        })
        .catch(function(/* err */) {
            console.error('error reading blob: ' + blobName);
            return null;
        });
};

AzureBlobContainer.prototype.getBlobToFile = function(blobName, localFileName, options) {

    return new P(_.bind(function (resolve, reject) {
        this.service.getBlobToLocalFile(this.name, blobName, localFileName, options,
            function(error, blockBlob /*, response */) {
                if (error){
                    reject(error);
                } else {
                    resolve(blockBlob);
                }
            }
        );
    }, this));
};

// alias for use in BlobStorage
AzureBlobContainer.prototype.downloadToFile = AzureBlobContainer.prototype.getBlobToFile;

AzureBlobContainer.prototype.getBlobProperties = function (blobName, options) {
    return new P(_.bind(function (resolve, reject) {
        this.service.getBlobProperties(this.name, blobName, options,
            function(error, blob /*, response */) {
                if (error){
                    reject(error);
                } else {
                    resolve(blob);
                }
            }
        );
    }, this));
};

var ensureContentType = function(options, filename) {
    // ensure we have a content type
    options = options || {};
    if (!options.contentSettings) {
        options.contentSettings = {};
    }
    if (!options.contentSettings.contentType) {
        if (mime.getType) {  // v2 of mime library
            options.contentSettings.contentType = mime.getType(filename);
        } else {
            options.contentSettings.contentType = mime.lookup(filename);
        }

        
    }

    return options;
};

AzureBlobContainer.prototype.uploadFromText = function(dest, text, options) {

    options = ensureContentType(options, dest);
    
    var self = this;
    return new P(function (resolve, reject) {
        self.service.createBlockBlobFromText(
            self.name,
            dest,
            text,
            options,
            function(error, blobResult) {
                if (error) {
                    reject(error);
                } else {
                    resolve(blobResult);
                }
            }
        );
    });
};

AzureBlobContainer.prototype.uploadFromFile = function(dest, src, options) {

    options = ensureContentType(options, dest);

    var self = this;
    return new P(function (resolve, reject) {
        self.service.createBlockBlobFromLocalFile(
            self.name,
            dest,
            src,
            options,
            function(error, blobResult) {
                if (error) {
                    reject(error);
                } else {
                    resolve(blobResult);
                }
            }
        );
    });
};

AzureBlobContainer.prototype.downloadAll = function(destinationPath) {

    // TODO: modify to use enumerator

    var self = this;
    return this.listAllBlobs().then(function(blobEntries) {

        var promises = _.map(blobEntries, function(entry) {

            var blobName = entry.name;
            var azureLastModified = new Date(entry.lastModified);
            var destinationFilename = path.join(destinationPath, blobName);

            return fs.statAsync(destinationFilename)
                .then(function(stats) {

                    //console.log(stats);

                    // see if the last modified time stamps match
                    var localLastModified = new Date(stats.mtime);
                    if (localLastModified.getTime() === azureLastModified.getTime()) {
                        console.log('skipping download of ' + blobName + ' with same last modified');
                        return false;
                    }

                    return true;
                })
                .catch(function(err) {
                    // error occurs if file doesn't exist, so we need to download
                    return true;
                })
                .then(function(shouldDownload) {
                    if (!shouldDownload) {
                        return;
                    }

                    console.log('start download of ' + blobName + ' to ' + destinationPath);

                    return self.getBlobToFile(blobName, destinationFilename)
                        .then(function(blob) {

                            console.log('completed download of ' + blobName);

                            // we need to set last modified time to match azure
                            return fs.utimesSync(destinationFilename, new Date(), azureLastModified);
                        });
                });
        });

        return P.all(promises);
    });

};

AzureBlobContainer.fromSettings = function(settings) {
    var container = new AzureBlobContainer(
        settings.accountName,
        settings.accountKey,
        settings.containerName);
    return container;
};

module.exports = AzureBlobContainer;