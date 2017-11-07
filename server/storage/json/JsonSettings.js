var JsonDb = require('./JsonDb');

function JsonSettings(db, id) {
    this.db = db;
    this.id = id;
}

JsonSettings.prototype.get = function() {
    return this.db.get(this.id);
};

JsonSettings.prototype.create = function(item) {
    item.id = this.id;
    return this.db.create(item);
};

JsonSettings.prototype.update = function(item) {
    item.id = this.id;
    return this.db.update(item);
};

JsonSettings.create = function(settings, deserialize, serialize) {
    var db = JsonDb.create(settings, deserialize, serialize);
    return new JsonSettings(db, settings.id);
};

module.exports = JsonSettings;