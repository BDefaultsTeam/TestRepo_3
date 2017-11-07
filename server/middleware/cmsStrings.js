var _ = require('lodash');
var MemoryCache = require('../data/MemoryCache');

module.exports = function(app, logger, options) {

    options = _.merge({
        defaultLocale: 'en-us',
        cacheMinutes: 5,
        replacements: {
            '{year}': new Date().getFullYear()
        },
    },  options);

    var cache = new MemoryCache({
        defaultTTL: options.cacheMinutes * 60 * 1000
    });
    
    var getGroupsByLocale = function(cms) {
        return cache.ensureLazy('cms-strings', function() {
            return cms.localestrings.getAll()
                .then(function(entries) {

                    var groupsByLocale = {};

                    _.each(entries, function(entry) {
                        var localeGroups = groupsByLocale[entry.locale] = groupsByLocale[entry.locale] || {};
                        var group = localeGroups[entry.groupId] = localeGroups[entry.groupId] || {};
                        
                        _.each(entry.strings, function(s, key) {
                            
                            // make replacements
                            _.each(options.replacements, function(replaceValue, searchValue) {
                                if (s.indexOf(searchValue) >= 0) {
                                    s = s.replace(searchValue, replaceValue);
                                }
                            });

                            // warn if key already exists in group
                            if (group[key]) {
                                console.warn('string group "' + entry.groupId + '" already has key "' + key + '"');
                            }

                            // add to group
                            group[key] = s;
                        });
                    });

                    return groupsByLocale;
                });
        });
    };

    var getLocaleStrings = function(cms, locale) {
        return cache.ensureLazy('cms-strings-' + locale, function() {
            return getGroupsByLocale(cms).then(function(groupsByLocale) {
                var locales = app.get('locales');

                // get the fallback locale
                var fallbackLocale = locales.fallbacks[locale];
                var fallbackGroups = fallbackLocale ? groupsByLocale[fallbackLocale] : groupsByLocale[options.defaultLocale];

                // get best set of strings for locale
                var localeGroups = groupsByLocale[locale];
                if (!localeGroups) {
                    // use the fallbacks
                    localeGroups = fallbackGroups || {};
                } else if (localeGroups !== fallbackGroups) {
                    // fill in any missing entries with the fallback entry
                    _.each(fallbackGroups, function(fallbackGroup, groupId) {
                        var localeGroup = localeGroups[groupId] = localeGroups[groupId] || {};
                        _.each(fallbackGroup, function(fallbackValue, key) {
                            if (typeof localeGroup[key] === 'undefined') {
                                localeGroup[key] = fallbackValue;
                            }
                        });
                    });
                }

                return localeGroups;
            });
        });
    };

    // for strings of last resort
    var defaultFallbackStrings = {};

    app.use(function(req, res, next) {

        var locale = res.locals.locale;
        if (!locale) {
            return next();
        }

        getLocaleStrings(req.cms, locale)
            .then(function(strings) {

                res.locals.strings = strings;

                // ui specific helper
                res.locals.t = function(key, options) {
                    if (strings.ui) {
                        var value = strings.ui[key];
                        if (value) {
                            return value;
                        }
                    }

                    console.info('localized value missing for ' + locale + ':' + key);
                    return defaultFallbackStrings[key] || key;
                };
            })
            .asCallback(next);
    });

    // fetch strings of last resort before returning init complete
    var cmsFactory = app.get('cmsFactory');
    return cmsFactory.getCms()
        .then(function(cms) {
            return getLocaleStrings(cms, options.defaultLocale);
        })
        .then(function(strings) {
            defaultFallbackStrings = strings.ui || {};
        });

};
