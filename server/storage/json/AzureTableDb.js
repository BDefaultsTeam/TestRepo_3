var _ = require('lodash');
var AzureTable = require('../table/AzureTable');
var AzureJsonEntityConverter = require('../table/AzureJsonEntityConverter');
var StorageError = require('../StorageError');

function AzureTableDb(table, partitionKeyName, rowKeyName, validKeys) {
    this.table = table;
    this.partitionKeyName = partitionKeyName || 'id';
    this.rowKeyName = rowKeyName;
    this.converter = new AzureJsonEntityConverter(
        this.partitionKeyName, 
        this.rowKeyName,
        validKeys);
}

AzureTableDb.prototype.get = function(partitionKey, rowKey) {

    var converter = this.converter;
    return this.table.get(partitionKey, rowKey || '')
        .then(function(entity) {
            return converter.toObject(entity);
        });
};

AzureTableDb.prototype.getEnumerator = function(query) {

    var tableGetNext = this.table.getEnumerator(query);
    var convertToObject = _.bind(this.converter.toObject, this.converter);

    return function() {
        return tableGetNext().then(convertToObject);
    };
};

AzureTableDb.prototype.getAll = function(query) {
    var convertToObject = _.bind(this.converter.toObject, this.converter);
    return this.table.queryAll(query).then(function(records) {
        return _.map(records, convertToObject);
    });
};

AzureTableDb.prototype.getPartition = function(partitionKey) {
    var convertToObject = _.bind(this.converter.toObject, this.converter);
    return this.table.getPartition(partitionKey).then(function(records) {
        return _.map(records, convertToObject);
    });
};

AzureTableDb.prototype.create = function(item) {
    var self = this;
    var entity = this.converter.toEntity(item);
    return this.table.insert(entity)
        .then(function(etag) {
            return item;
        })
        .catch(function(error) {
            if (error.code === 'EntityAlreadyExists') {
                var message = 'Ojbect with PK: ' + item[self.partitionKeyName] + 
                    ' RK: ' + item[self.rowKeyName] + ' already exists';
                throw new StorageError(StorageError.Codes.ObjectExists, message);
            }
            else {
                throw error;
            }
        });
};

AzureTableDb.prototype.update = function(item) {
    var entity = this.converter.toEntity(item);
    return this.table.upsert(entity)
        .then(function(etag) {
            return item;
        });
};

AzureTableDb.fromSettings = function(settings) {
    var table = new AzureTable(
        settings.accountName,
        settings.accountKey,
        settings.name);
    return new AzureTableDb(
        table,
        settings.partitionKeyName || settings.idKey,
        settings.rowKeyName);
};

module.exports = AzureTableDb;
