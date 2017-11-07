var _ = require('lodash');

var settings;
try {
    require('hjson/lib/require-config');
    settings = require('../settings.hjson');
} catch (err) {
    // fallback to fetching json settings
    settings = require('../settings.json');
}

function getConfig() {

    var env = process.env.NODE_ENV || 'development';
    var isDevelopment = (env === 'development');
    var envSettings = isDevelopment ? settings.development : settings.production;

    // see if there are private, dev specific settings to load
    if (isDevelopment) {
        try {
            var devSettings = require('../settings.dev.json');
            envSettings = _.merge({}, envSettings, devSettings);
        } catch (err) {
            console.log('no additional dev settings loaded');
        }
    }

    // merge defaults with environment settings
    var config = _.merge({}, settings.defaults, envSettings);

    //console.log(JSON.stringify(config, 4, 4));

    return config;
}

module.exports = getConfig();
