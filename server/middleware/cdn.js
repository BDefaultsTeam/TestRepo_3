var _ = require('lodash');
const uuidv4 = require('uuid/v4');

module.exports = function(app, logger, options) {

    // merge options with defaults
    options = _.merge({
        enabled: false,
        fallbackBaseUrl: '/',
        versionsBaseUrl: '/', // override in settings with CDN url
        versionsPath: '../cdnVersions.json'
    }, options);

    var cdn = { 
        baseUrl: options.fallbackBaseUrl,
        versions: {}, 

        // simple cache busting querystring for optional use
        cacheQS: '',  
        cacheBuster: '',

        getUrl: function(url) {
            var result = cdn.baseUrl + (cdn.versions[url] || url);
            if (cdn.cacheBuster) {
                result += (result.indexOf('?') >= 0) ? '&v=' : '?v=';
                result += cdn.cacheBuster;
            }
            return result;
        }
    };

    // check for cdn base url & version JSON file
    if (options.enabled) {
        try {
            cdn.versions = require(options.versionsPath);
            cdn.baseUrl = options.versionsBaseUrl;
        } catch (err) {
            // if no versions file exists, use a simple querystring
            cdn.cacheBuster = uuidv4();
            cdn.cacheQS = '?v=' + cdn.cacheBuster;
        }
    }

    // attach cdn to response so it can be used in all pages
    app.use(function(req, res, next) {
        res.locals.cdn = cdn;
        next();
    });
};
