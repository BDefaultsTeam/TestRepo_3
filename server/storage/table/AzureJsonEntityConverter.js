var _ = require('lodash');
var azure = require('azure-storage');

// translates to/from JS objects to JSON blob table entities
// (64KB Azure table prop size limit)

function AzureJsonEntityConverter(partitionKeyName, rowKeyName, validKeys) {
    this.partitionKeyName = partitionKeyName;
    this.rowKeyName = rowKeyName;
    this.validKeys = validKeys;
}

AzureJsonEntityConverter.prototype.toObject = function(entity) {

    if (!entity) {
        return null;
    }

    var obj = {};
    obj[this.partitionKeyName] = entity.PartitionKey._;
    if (this.rowKeyName) {
        obj[this.rowKeyName] = entity.RowKey._;
    }

    _.merge(obj, JSON.parse(entity.data._));

    return obj;
};

AzureJsonEntityConverter.prototype.toEntity = function(obj) {

    var data = {};

    if (this.validKeys) {
        _.each(this.validKeys, function(key) {
            var value = obj[key];
            if (typeof value !== 'undefined') {
                data[key] = value;
            }
        });
    }
    else {
        // add all keys except partition and rowkey
        var self = this;
        _.each(obj, function(value, key) {
            if (key !== self.partitionKeyName && key !== self.rowKeyName) {
                data[key] = value;
            }
        });
    }

    var entGen = azure.TableUtilities.entityGenerator;
    var entity = {
        PartitionKey: entGen.String(obj[this.partitionKeyName]),
        RowKey: entGen.String(obj[this.rowKeyName] || ''),
        data: entGen.String(JSON.stringify(data))
    };

    return entity;
};

module.exports = AzureJsonEntityConverter;