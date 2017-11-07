var _ = require('lodash');
var session = require('express-session');

module.exports = function(app, logger, options) {

    // merge options with defaults
    options = _.merge({
        saveUninitialized: true,
        resave: false 
    }, options);

    app.use(session({
        secret: options.secret,
        saveUninitialized: options.saveUninitialized,
        resave: options.resave
    }));
};