var _ = require('lodash');
var P = require('bluebird');
var path = require('path');
var fs = P.promisifyAll(require('fs-extra'));
var rp = require('request-promise');
var BlobStorage = require('../storage/blob/BlobStorage');
var Archive = require('../data/Archive');
var MemoryCache = require('../data/MemoryCache');

function CmsCache(cmsFactory, options) {

    this.options = _.merge({
        path: path.join(__dirname, '..', '..'),
        pollFrequencySeconds: 60,
        pollTimeoutSeconds: 10,
    }, options);

    this.cmsFactory = cmsFactory;
    this.cmsCache = new MemoryCache({ 
        defaultTTL: Number.MAX_SAFE_INTEGER
    });

    // cache the live environment CMS
    this.liveCms = null;
    
    // remember the deployed snapshot id
    this.deployedIdCache = new MemoryCache({ 
        defaultTTL: this.options.pollFrequencySeconds * 1000
    });

    // blob storage where zips are stored
    var snapshotZipSettings = this.cmsFactory.storage.getDbSettings(
        options.snapshotzips,
        'snapshotzips',
        'snapshot',
        this.path);
    this.snapshotZips = BlobStorage.create(snapshotZipSettings);
}

CmsCache.prototype.getCms = function(requestedSnapshotId) {

    // check to see if live environment was requested
    if (requestedSnapshotId === 'live' && this.options.liveEnvironment) {
        if (!this.liveCms) {
            this.liveCms = this.cmsFactory.create(this.options.liveEnvironment);
            this.liveCms.id = 'live';
            this.liveCms.cache.enabled = false; // disable caching
        }
        return P.resolve(this.liveCms);
    }

    // get the snapshot CMS
    var self = this;
    return this.resolveSnapshotId(requestedSnapshotId)
        .then(function(snapshotId) {
            // check the cache for the cms
            return self.cmsCache.ensure(snapshotId, function() {

                // get the requested cms if not found in cache
                return self.ensureSnapshot(snapshotId)
                    .then(function(snapshotPath) {
                        var cms = self.cmsFactory.create('snapshot', snapshotPath);
                        cms.id = snapshotId;
                        return cms;
                    });
            });
        });
};

CmsCache.prototype.resolveSnapshotId = function(requestedSnapshotId) {

    // if a specific version is requested, honor that
    if (requestedSnapshotId) {
        return P.resolve(requestedSnapshotId);
    }

    // if polling isn't enabled, use the fallback id
    var pollUrl = this.options.pollUrl;
    if (!pollUrl) {
        return P.resolve(this.options.fallbackId);
    }

    var currentDeployedId = this.deployedIdCache.get('deployedId', true);

    // get the standard deployed id, ok if stale, we will refresh in background
    // so normal user requests don't ahve to wait
    var self = this;
    return this.deployedIdCache.ensureLazy('deployedId', _.bind(this.pollDeployedId, this))
        .then(function(snapshotId) {
            if (currentDeployedId !== snapshotId) {
                console.log('CMS deployed ID change: ' + snapshotId);
            }
            return snapshotId;
        })
        .catch(function(err) {

            console.error('error fetching deployed CMS is: ' + err);
            
            if (currentDeployedId) {
                // suppress error and use previous deployed id
                return currentDeployedId;
            }

            var fallbackId = self.options.fallbackId;
            if (fallbackId) {
                // suppress error and use fallback id
                return fallbackId;
            }

            console.warn('CmsCache: no fallbackId setting');
            throw err;
        });
};

// ignores cache expiration, always refreshes after polling
CmsCache.prototype.refreshDeployedId = function() {
    var self = this;
    return this.pollDeployedId().then(function(snapshotId) {
        self.deployedIdCache.set('deployedId', snapshotId);
    });
};

CmsCache.prototype.pollDeployedId = function() {
    return rp({
        url: this.options.pollUrl,
        timeout: this.options.pollTimeoutSeconds * 1000, // limit wait for server response
        json: true
    })
    .then(function(snapshotId) {
        //console.log('deployed id response from server: ' + snapshotId);
        return snapshotId;
    });
};

CmsCache.prototype.ensureSnapshot = function(snapshotId) {
    
    // see if the snapshot folder already exists
    var snapshotsFolder = path.join(this.options.path, 'snapshots');
    var snapshotPath = path.join(snapshotsFolder, snapshotId);
    if (fs.existsSync(snapshotPath)) {
        return P.resolve(snapshotPath);
    }

    console.log('fetching snapshot: ' + snapshotId);
    var downloadStart = Date.now();
    var zipFilename = snapshotId + '.zip';
    var zipPath = path.join(snapshotsFolder, zipFilename);
    fs.ensureDirSync(snapshotsFolder);
    return this.snapshotZips.downloadToFile(zipFilename, zipPath)
        .then(function() {
            var elapsed = Date.now() - downloadStart;
            console.log('snapshot download completed in ' + elapsed + 'ms');
            return Archive.unzip(zipPath, snapshotsFolder);
        })
        .then(function() {
            console.log('snapshot unzipped');
            return snapshotPath;
        })
        .catch(function(err) {
            // delete snapshot if there was a problem
            fs.removeSync(snapshotPath);
            throw err;
        })
        .finally(function() {
            //always delete zip file
            fs.removeSync(zipPath);
        });
};

module.exports = CmsCache;
