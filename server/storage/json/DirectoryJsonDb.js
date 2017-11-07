
var _ = require('lodash');
var P = require('bluebird');
var fs = P.promisifyAll(require('fs-extra'));
var path = require('path');
var ReadWriteLock = require('rwlock');
var shortid = require('../shortid');
var StorageError = require('../StorageError');

function DirectoryJsonDb(directory, partitionKeyName, rowKeyName) {

    this.partitionKeyName = partitionKeyName || 'id';
    this.rowKeyName = rowKeyName;
    
    var rwlock = new ReadWriteLock();
    this.lock = P.promisifyAll(rwlock.async);

    // ensure that the directory exists
    fs.ensureDirSync(directory);
    this.directory = directory;
}

DirectoryJsonDb.prototype.readJson = function(filename) {

    if (!filename || !filename.endsWith('.json')) {
        return P.resolve(null);
    }

    return this.lock.readLockAsync(filename).then(function (release) {

        return fs.readFileAsync(filename, 'utf8')
            .then(function(data) {
                try {
                    return JSON.parse(data);
                }
                catch (err) {
                    console.error('JSON parse error for ' + filename +  ' : ' + err);
                    return null;
                }
            })
            .catch(function(/* err */) {
                console.error('error reading file: ' + filename);
                return null;
            })
            .finally(function() {
                release();
            });
    });
};

DirectoryJsonDb.prototype.get = function(partitionKey, rowKey) {
    if (!partitionKey || (this.rowKeyName && !rowKey)) {
        return P.resolve(null);
    }

    var filename = this.getFilename(partitionKey, rowKey);
    return this.readJson(filename);
};

DirectoryJsonDb.prototype.ensureDirectory = function(partitionKey) {
    if (this.rowKeyName) {
        var directory = path.join(this.directory, partitionKey);
        fs.ensureDirSync(directory);
    }
};

DirectoryJsonDb.prototype.getFilename = function(partitionKey, rowKey) {
    if (this.rowKeyName) {
        return path.join(this.directory, partitionKey, rowKey + '.json');
    } else {
        return path.join(this.directory, partitionKey + '.json');
    }
};

DirectoryJsonDb.prototype.getEnumerator = function(partitionKey) {
    var rootPath = this.directory;

    // get the set of directories we need to iterate through
    var dirs;
    if (partitionKey) {
        // single subfolder
        dirs = [ path.join(rootPath, partitionKey) ];
    } else if (this.rowKeyName) {
        // get all partition folders
        dirs = fs.readdirSync(rootPath)
            .map(function(filename) {
                return path.join(rootPath, filename);
            })
            .filter(function(filepath) {
                return fs.statSync(filepath).isDirectory();
            });
    } else {
        // no partitions, files are in root
        dirs = [ rootPath ];
    }

    // get full filesnames for all directories
    var filenames = _.flatten(_.map(dirs, function(dirPath) {
        var dirFiles = [];
        try {
            dirFiles = fs.readdirSync(dirPath);
        } catch (err) {
            console.error('no subdirectory: ' + dirPath);
        }

        return _.map(dirFiles, function(filename) {
            return path.join(dirPath, filename);
        });
    }));

    var index = -1;
    var self = this;

    var getNext = function() {
        if (index >= filenames.length - 1) {
            return P.resolve();
        }

        index++;
        var filename = filenames[index];

        return self.readJson(filename).then(function(result) {
            return result ? result : getNext();
        });
    };

    return getNext;
};

DirectoryJsonDb.prototype.getPartition = function(partitionKey) {
    return this.getAll(partitionKey);
};

DirectoryJsonDb.prototype.getAll = function(partitionKey) {
    var getNext = this.getEnumerator(partitionKey);

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

DirectoryJsonDb.prototype.create = function(data) {
    return this.update(data, true);
};

DirectoryJsonDb.prototype.update = function(data, failIfExists) {
    
    var partitionKey = data[this.partitionKeyName];
    var rowKey = this.rowKeyName ? data[this.rowKeyName] : null;

    // generate id if needed
    if (this.rowKeyName) {
        if (!partitionKey) {
            return P.reject('Missing partitionKey');
        }

        if (!rowKey) {
            rowKey = data[this.rowKeyName] = shortid.generate();
        }
    }
    else if (!partitionKey) {
        partitionKey = data[this.partitionKeyName] = shortid.generate();
    }

    // format nicely so they are easy to read
    var json = JSON.stringify(data, 4, 4);

    var filename = this.getFilename(partitionKey, rowKey);
    var writeOptions = failIfExists ? { flag: 'wx' } : { flag: 'w' };
    this.ensureDirectory(partitionKey);
    return this.lock.writeLockAsync(filename).then(function (release) {
        return fs.writeFileAsync(filename, json, writeOptions)
            .then(function() {
                return data;
            })
            .catch(function(error) {
                if (error.code === 'EEXIST') {
                    throw new StorageError(StorageError.Codes.ObjectExists);
                }
                else {
                    throw error;
                }
            })
            .finally(function() {
                release();
            });
    });
};


module.exports = DirectoryJsonDb;