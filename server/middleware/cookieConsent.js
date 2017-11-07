/* Sample config

"cookieConsent": {
    "domain": "microsoftedgetips.microsoft.com"
},

*/

var _ = require('lodash');
var P = require('bluebird');
var rp = require('request-promise');
var MemoryCache = require('../data/MemoryCache');

// languages that currently require a fallback
var fallbackLocales = {
    'srl-rs': 'sr'
};

var fetchLocaleData = function(locale, domain, forceConsent) {

    var url = 'https://uhf.microsoft.com/' + locale + '/shell/api/mscc?domain=' + domain;
    
    // for testing, a flag may be set to require consent
    if (forceConsent) {
        url += '&mscc_eudomain=true';
    }

    console.log('fetching cookie consent info for locale ' + locale);

    return rp({
        url: url,
        json: true,
        headers: {
            'User-Agent': 'Request-Promise'
        }
    })
    .then(function(data) {

        // if there is no data, try to use a fallback language
        if (!data ) {

            if (locale === 'en-us') {
                console.log('Unable to fetch cookie consent data locale data for en-us');
                throw 'Unable to fetch cookie consent locale data for en-us';
            }

            var fallbackLocale = fallbackLocales[locale];
            if (fallbackLocale) {
                return fetchLocaleData(fallbackLocale, domain, forceConsent);
            }
            else {
                console.log('No cookie consent data for locale: ' + locale + ', will fallback to en-us');
                return fetchLocaleData('en-us', domain, forceConsent);
            }    
        }

        return data;
    })
    .catch(function(err) {
        console.log('error fetching cookie consent data: ' + err);
        // log but suppress errors (we can still render the page)
        return {};
    });
};

module.exports = function(app, logger, options) {

    // merge options with defaults
    options = _.merge({
        cacheMinutes: 60,
        domain: 'microsoft.com'
    }, options);

    var cache = new MemoryCache({ 
        defaultTTL: options.cacheMinutes * 60 * 1000
    });

    var ensureLocaleData = function(locale, forceConsent) {
        return cache.ensureLazy(locale + '+forceConsent=' + !!forceConsent, function() {
            return fetchLocaleData(locale, options.domain, forceConsent);
        });
    };

    app.use(function(req, res, next) {

        var forceConsent = req.query.mscc_eudomain === 'true';
        var locale = res.locals.locale;
        if (locale) {
            ensureLocaleData(locale, forceConsent)
                .then(function(cookieConsent) {
                    res.locals.cookieConsent = cookieConsent;
                }) 
                .finally(next);
        } 
        else {
            next();
        }

    });

    // preload cookie consent info
    var locales = app.get('locales');
    if (app.get('env') === 'development' || !locales) {
        // only ensure en-us in dev environment
        return ensureLocaleData('en-us');
    } else {
        try {
            // preload UHF for all locales
            return P.all(_.map(locales.supported, ensureLocaleData));
        } catch (err) {
            console.error(err);
        } 
    }

};


