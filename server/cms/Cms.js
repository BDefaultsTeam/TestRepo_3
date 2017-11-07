var _ = require('lodash');
var path = require('path');
var JsonDb = require('../storage/json/JsonDb');
var JsonSettings = require('../storage/json/JsonSettings');
var MemoryCache = require('../data/MemoryCache');

function Cms(storage, schemas, databases, environment, options) {

    // merge options with defaults
    options = this.options = _.merge({
        path: Cms.defaultPath,
        urls: {},
        cache: {
            // 10 mins by default. in theory we could cache snapshots indefinitely,
            // but oftentimes we have logic that uses the current date/time or other
            // factors that may change. 10 mins is a good compromise so that we
            // periodically re-evaluate but most requests are using cached version
            defaultTTL: 10 * 60 * 1000
        }
    }, options);

    this.urls = options.urls;
    this.storage = storage;
    this.environment = environment;
    this.schemas = schemas;
    this.cache = new MemoryCache(options.cache);
        
    this.initDatabases(databases, environment);
}

Cms.defaultPath = path.join(__dirname, '..', '..');

Cms.prototype.getDbSettings = function(db, dbName, overrides) {
    var dbSettings = _.extend({}, db, overrides);
    return this.storage.getDbSettings(
        dbSettings, 
        dbName, 
        this.environment, 
        this.options.path);
};

Cms.prototype.initDatabases = function(databases) {

    var createSerializer;
    if (this.schemas) {
        createSerializer = _.bind(this.schemas.createSerializer, this.schemas);
    } else {
        // no serializer needed without schemas
        createSerializer = function() { return null; };
    }

    _.each(databases.settings, _.bind(function(db, dbName) {
        var overrides = { id: dbName, name: 'settings' };
        var dbSettings = this.getDbSettings(db, dbName, overrides);
        if (dbSettings) {
            var serializer = createSerializer(dbSettings);
            this[dbName] = JsonSettings.create(dbSettings, serializer, serializer);
        }
    }, this));

    _.each(databases.tables, _.bind(function(db, dbName) {
        var dbSettings = this.getDbSettings(db, dbName);
        if (dbSettings) {
            var serializer = createSerializer(dbSettings);
            this[dbName] = JsonDb.create(dbSettings, serializer, serializer);
        }
    }, this));

    _.each(databases.blobs, _.bind(function(db, dbName) {
        var BlobStorage = require('../storage/blob/BlobStorage');
        var dbSettings = this.getDbSettings(db, dbName);
        if (dbSettings) {
            this[dbName] = BlobStorage.create(dbSettings);
        }
    }, this));

    _.each(databases.files, _.bind(function(fileSettings, dbName) {

        var BlobStorage = require('../storage/blob/BlobStorage');
        var FileDb = require('../storage/blob/FileDb');
        var dbSettings = this.getDbSettings(fileSettings.blobs, dbName);
        if (dbSettings) {
            var blobs = BlobStorage.create(dbSettings);
            var recordsTable = this[fileSettings.recordsTable];

            // create filedb
            this[dbName] = new FileDb(
                recordsTable,
                blobs,
                dbSettings.baseUrl + dbName + '/');
        }

    }, this));
};


module.exports = Cms;
