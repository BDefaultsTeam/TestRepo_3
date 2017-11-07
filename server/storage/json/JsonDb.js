var _ = require('lodash');
var P = require('bluebird');
var DirectoryJsonDb = require('./DirectoryJsonDb');
var AzureTableDb = require('./AzureTableDb');

function JsonDb(storage, deserialize, serialize) {
    this.storage = storage;

    // wrap serialization in a promise so errors will be handled by the chain
    this.deserialize = P.method(deserialize || function(data) { return data; });
    this.serialize = P.method(serialize || function(data) { return data; });
}

JsonDb.prototype.get = function(primaryId, secondaryId) {
    var deserialize = this.deserialize;
    return this.storage.get(primaryId, secondaryId)
        .then(function(record) {
            return record ? deserialize(record) : null;
        });
};

JsonDb.prototype.getEnumerator = function() {

    var deserialize = this.deserialize;
    var storageGetNext = this.storage.getEnumerator();

    return function() {
        return storageGetNext().then(function(result) {
            return result ? deserialize(result) : result;
        });
    };
};

JsonDb.prototype.processAll = function(recordAction) {
    var getNext = this.getEnumerator();
    var processNext = function() {
        return getNext().then(function(record) {
            if (record) {
                return recordAction(record).then(processNext);
            }
        });
    };

    return processNext();
};

JsonDb.prototype.copyTo = function(targetDb) {
    return this.processAll(function(record) {
        return targetDb.update(record);
    });
};

JsonDb.prototype.getAll = function() {
    var deserialize = this.deserialize;
    return this.storage.getAll().then(function(records) {
        return P.all(_.map(records, deserialize))
            .then(function(results) {
                return _.without(results, null);
            });
    });
};

JsonDb.prototype.getPartition = function(partitionKey) {
    var deserialize = this.deserialize;
    return this.storage.getPartition(partitionKey)
        .then(function(records) {
            return P.map(records, deserialize)
                .then(function(results) {
                    return _.without(results, null);
                });
        });
};

JsonDb.prototype.getPartitionMatches = function(partitionKey, matchValues) {
    // TODO: consider pushing match logic to storage layer
    return this.getPartition(partitionKey)
        .then(function(items) {
            return _.filter(items, _.matches(matchValues));
        });
};

JsonDb.prototype.create = function(item) {
    var storage = this.storage;
    return this.serialize(item).then(function(data) {
        return storage.create(data);
    });
};

JsonDb.prototype.update = function(item) {
    var storage = this.storage;
    return this.serialize(item).then(function(data) {
        return storage.update(data);
    });
};

JsonDb.create = function(settings, deserialize, serialize) {
    
    var storage;
    switch (settings.engine) {
        case 'directory':
            storage = new DirectoryJsonDb(settings.path, settings.partitionKeyName, settings.rowKeyName);
            break;
        case 'azuretable':
            storage = new AzureTableDb.fromSettings(settings);
            break;
        default:
            console.log('unknown JsonDb storage engine: ' + settings.engine);
            return null;
    }

    var db = new JsonDb(storage, deserialize, serialize);
    db.newTypes = settings.newTypes;
    db.partitionKeyName = storage.partitionKeyName;
    db.rowKeyName = storage.rowKeyName;
    db.displayOptions = settings.display || {};
    return db;
};

module.exports = JsonDb;
