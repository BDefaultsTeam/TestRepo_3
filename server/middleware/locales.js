var _ = require('lodash');
var path = require('path');
var accepts = require('accepts');
var rtlDetect = require('rtl-detect');
var LocaleCode = require('locale-code');

/* Example configuration:

"locales": {

    // locales defined in json
    "dataPath": "data/localeData.json",

    // or via property
    "localized": [
        "en-us"
    ],
    "fallbacks": {
        "en-gb": "en-us"
    },
    
    // excluded paths and which locale to set
    "exclude": {
        "admin": "en-us"
    }
},

*/


function LocaleSet(localized, fallbacks) {
    this.default = 'en-us';
    this.localized = localized || [ this.default ];
    this.fallbacks = fallbacks || {};
    this.initFallbacks();

    // bind handler to object so it can be used as reference
    this.redirectToPreferred = this.redirectToPreferred.bind(this);

    this.supported = this.localized.concat(_.keys(this.fallbacks));
}

LocaleSet.prototype.initFallbacks = function() {

    // some fallbacks use other fallbacks, so we need to update them to the actual 
    // localized language
    var checkFallbacksAgain;
    do {
        // intially assume we dont need to check again
        checkFallbacksAgain = false;

        // check each fallback
        /*jshint loopfunc: true */
        _.each(this.fallbacks, _.bind(function(fallback, locale) {
            if (this.localized.indexOf(fallback) >= 0) {
                return;
            }

            var newFallback = this.fallbacks[fallback];
            if (!newFallback) {
                console.log('no localized langauge found for fallback: ' + fallback);
            }
            else {
                this.fallbacks[locale] = newFallback;
                checkFallbacksAgain = true;
            }
        }, this));
    }
    while (checkFallbacksAgain);
};


LocaleSet.prototype.getPreferred = function(req) {

    var acceptedLanguages = _.map(
        accepts(req).languages(),
        function(l) { return l.toLowerCase(); });

    var supported = this.supported;
    var preferredLocale = _.find(acceptedLanguages, function(locale) {
        locale = locale.toLowerCase();
        return (supported.indexOf(locale) >= 0);
    });

    return preferredLocale || this.default;
};

LocaleSet.prototype.isSupported = function(locale) {
    return (locale && this.supported.indexOf(locale) >= 0);
};

LocaleSet.prototype.redirectToPreferred = function(req, res, next) {

    var redirectLocale = this.getPreferred(req);
    var redirectUrl = '/' + redirectLocale + '/';

    // pass through any querystring parameters
    var qsIndex = req.originalUrl.indexOf('?');
    if (qsIndex >= 0) {
        redirectUrl += req.originalUrl.substr(qsIndex);
    }

    res.redirect(redirectUrl);
};


module.exports = function(app, logger, options) {

    // data can be specified in options or loaded
    var datasource = options;
    if (options.dataPath) {
        datasource = require(path.join('..', options.dataPath));
    }

    // create the locale set and make it available through app
    var locales = new LocaleSet(datasource.localized, datasource.fallbacks);
    app.set('locales', locales);

    // helper to set response locale
    var setResponseLocale = function(res, locale) {
        res.locals.locale = locale;
        res.locals.isRtl = rtlDetect.isRtlLang(locale);
        res.locals.lang = LocaleCode.getLanguageCode(locale);
    };

    app.use('/:locale/', function(req, res, next) {

        req.locales = locales;

        var locale = (req.params.locale || '').toLowerCase();
        if (locales.isSupported(locale)) {
            setResponseLocale(res, locale);
        } else if (options.exclude && options.exclude[locale]) {
            locale = options.exclude[locale];
            setResponseLocale(res, locale);
        } else {
            // log warning if it looks like a locale: lang-country
            if (locale.indexOf('-') > 0) {
                console.warn('unknown locale: ' + locale);
            }
        }
        
        next();
    });

};
