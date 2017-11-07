var P = require('bluebird');
var path = require('path');
var Cms = require('./cms');
var CmsStorage = require('../cms/CmsStorage');

function CmsFactory(options) {

    // get CMS storage settings
    this.storage = new CmsStorage(options.storage);

    // store urls by environment
    this.urlsByEnv = options.urls || {};

    // get CMS schemas
    this.schemas = null;
    if (options.schemas) {
        var CmsSchemas = require('../cms/CmsSchemas');
        this.schemas = new CmsSchemas(options.schemas);
    }

    this.databases = options.databases;
    this.path = options.path || path.join(__dirname, '..', '..');

    // initialize CMS cache
    if (options.cache) {
        var CmsCache = require('../cms/CmsCache');
        this.cache = new CmsCache(this, options.cache);
    } else {
        // no cache, create a single CMS that will always be returned
        this.cms = this.create(options.environment, options.path);
    }
}

CmsFactory.prototype.init = function() {
    // prefill the cache with default CMS
    if (this.cache) {
        return this.cache.getCms();
    }

    return P.resolve();
};

CmsFactory.prototype.getCms = function(version) {
    if (this.cache) {
        return this.cache.getCms(version);
    } else {
        return P.resolve(this.cms);
    }
};

CmsFactory.prototype.create = function(environment, path) {
    var cmsOptions = { 
        path: path || this.path,
        urls: this.urlsByEnv[environment]
    };
    var cms = new Cms(
        this.storage,  
        this.schemas,
        this.databases,
        environment,
        cmsOptions);
    return cms;
};

module.exports = CmsFactory;
