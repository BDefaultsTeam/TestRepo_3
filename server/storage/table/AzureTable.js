var P = require('bluebird');
var _ = require('lodash');
var azure = require('azure-storage');

function AzureTable(accountName, accountKey, tableName) {
    this.name = tableName;
    this.service = azure.createTableService(accountName, accountKey);

    // initially we assume the table doesn't exist
    this.tableExists = false;
}

AzureTable.prototype.ensureTable = function() {

    if (this.tableExists) {
        return P.resolve(this.service);
    }

    return new P(_.bind(function (resolve, reject) {
        this.service.createTableIfNotExists(
            this.name,
            _.bind(function(error /*, result, response */) {
                if (error) {
                    reject(error);
                } else {
                    this.tableExists = true;
                    resolve(this.service);
                }
            }, this)
        );
    }, this));
};

AzureTable.prototype.insert = function(entity) {

    var tableName = this.name;
    return this.ensureTable().then(function(service) {

        return new P(function (resolve, reject) {
            service.insertEntity(tableName, entity,
                function(error, result /*, response */) {
                    if (error) {
                        reject(error);
                    } else {
                        var etag = result['.metadata'].etag;
                        resolve(etag);
                    }
                }
            );
        });
    });
};

AzureTable.prototype.upsert = function(entity) {

    var tableName = this.name;
    return this.ensureTable().then(function(service) {

        return new P(function (resolve, reject) {
            service.insertOrReplaceEntity(tableName, entity,
                function(error, result /*, response */) {
                    if (error) {
                        reject(error);
                    } else {
                        var etag = result['.metadata'].etag;
                        resolve(etag);
                    }
                }
            );
        });
    });
};

AzureTable.prototype.get = function(partitionKey, rowKey) {
    
    if (!partitionKey) {
        return P.resolve(null);
    }

    var tableName = this.name;
    return this.ensureTable().then(function(service) {

        return new P(function (resolve, reject) {

            service.retrieveEntity(tableName, partitionKey, rowKey,
                function(error, result /*, response */) {
                    if (error) {
                        if (error.code === 'ResourceNotFound') {
                            resolve(null);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });
};

AzureTable.prototype.delete = function(partitionKey, rowKey) {

    if (!partitionKey) {
        return P.resolve(null);
    }

    var tableName = this.name;
    return this.ensureTable().then(function(service) {

        return new P(function (resolve, reject) {

            var task = {
                PartitionKey: { '_': partitionKey },
                RowKey: { '_': rowKey}
            };

            service.deleteEntity(tableName, task,
                function(error, result /*, response */) {
                    if (error) {
                        if (error.code === 'ResourceNotFound') {
                            resolve(null);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });
};

AzureTable.prototype.getPartition = function(partitionKey) {
    var query = new azure.TableQuery().where('PartitionKey eq ?', partitionKey);
    return this.queryAll(query);
};

AzureTable.prototype.query = function(query, token) {

    var tableName = this.name;
    return this.ensureTable().then(function(service) {

        return new P(function (resolve, reject) {
            service.queryEntities(tableName, query, token,
                function(error, result /*, response */) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });

};

AzureTable.prototype.getEnumerator = function(query) {

    var self = this;

    var entries = [];
    var noMoreEntries = false;
    var continuationToken = null;
    var ensureEntries = function() {
        // no need to fetch if we still have results or there are no more
        if (entries.length > 0 || noMoreEntries) {
            return P.resolve();
        }

        // fetch the next set of results
        return self.query(query, continuationToken).then(function(result) {
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


AzureTable.prototype.queryAll = function(query) {

    var getNext = this.getEnumerator(query);

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

module.exports = AzureTable;