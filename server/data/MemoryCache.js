var P = require('bluebird');
var SingleOperation = require('./SingleOperation');

function MemoryCache(options) {
    this.cache = {};
    this.singleOperation = new SingleOperation();

    // default time to live in ms
    this.keyDefaultTTLs = options.keyDefaultTTLs || {};
    this.defaultTTL = options.defaultTTL || (5 * 60 * 1000);

    // disable to stop all caching
    this.enabled = true;

    // enable logging in debug mode
    this.debug = !!options.debug;
    if (this.debug) {
        console.log('MemoryCache options: ' + JSON.stringify(options));
    }
}

function CacheEntry(value, expires) {
    this.value = value;
    this.expires = expires;
}

MemoryCache.prototype.clear = function() {
    this.cache = {};
};

MemoryCache.prototype.ensure = function(key, valueFactory, ttl, allowLazyRefresh) {

    var cache = this;
    var refreshValue = function() {
        return cache.singleOperation.run(key, function() {
            return valueFactory().then(function(value) {
                cache.set(key, value, ttl);
                return value;
            });
        });
    };

    var entry = key ? this.cache[key] : null;
    if (!entry) {
        return refreshValue();
    }
    
    if (Date.now() < entry.expires) {
        // not yet expired
        return P.resolve(entry.value);
    } else if (allowLazyRefresh) {
        // refresh in background, return expired result
        refreshValue();
        return P.resolve(entry.value);
    } else {
        // refresh and wait
        return refreshValue();
    }
};

MemoryCache.prototype.ensureLazy = function(key, valueFactory, ttl) {
    return this.ensure(key, valueFactory, ttl, true);
};

MemoryCache.prototype.get = function(key, allowExpired) {
    if (key) {
        var entry = this.cache[key];
        if (entry) {
            if (allowExpired || Date.now() < entry.expires) {
                return entry.value;
            } else if (this.debug) {
                console.log('expired cache entry: ' + key);
            }
        }
    }

    if (this.debug) {
        console.log('no cache entry: ' + key);
    }
    return undefined;
};

MemoryCache.prototype.set = function(key, value, ttl) {

    if (!this.enabled) {
        return;
    }

    // fallback to config then default ttl if not specified
    ttl = ttl || this.keyDefaultTTLs[key] || this.defaultTTL;

    var expires = Date.now() + ttl;
    this.cache[key] = new CacheEntry(value, expires);

    if (this.debug) {
        var humanizeDuration = require('humanize-duration');
        console.log('caching ' + key + ' (ttl:' + humanizeDuration(ttl) + ')');
    }
};

module.exports = MemoryCache;

