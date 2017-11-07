var _ = require('lodash');
//var P = require('bluebird');
var path = require('path');

function CmsStorage(options) {
    this.options = options;
}

CmsStorage.prototype.getDbSettings = function(db, dbName, environment, basePath) {

    // fetch the storage that applies to the environment
    var storageKey = db.storage[environment];
    if (!storageKey) {
        return null;
    }

    var storageSettings = this.options[storageKey];
    if (!storageSettings) {
        return null;
    }

    // merge settings
    var dbDefaults = { name: dbName };
    var dbSettings = _.merge(dbDefaults, storageSettings, db);

    // determine path for directory based dbs
    if (basePath) {
        if (dbSettings.path) {
            dbSettings.path = path.join(basePath, dbSettings.path, dbSettings.name);
        } else {
            dbSettings.path = path.join(basePath, dbSettings.name);
        }
    }

    // get any environment account keys
    if (dbSettings.processEnvironmentAccountKeyName) {
        dbSettings.accountKey = process.env[dbSettings.processEnvironmentAccountKeyName];
    }

    return dbSettings;
};

module.exports = CmsStorage;