var P = require('bluebird');
var express  = require('express');
var logger = require('./logger');
var config = require('./data/config');

var app = express();

/*
var users = require('./data/users');
app.set('users', users);
*/

var isDevelopment = (app.get('env') === 'development');
if (isDevelopment) {
    app.use(function(req,res,next) {
        res.locals.isDevelopment = true;
        next();
    });
}

var initModules = [
    'gracefulExit',
    'compression',
    'logging',
    'static',
    'cdn',
    'cms',
    'parsers',
    'validator',
    'session',
    'locales',
    'cmsStrings',
    'useragent',
    'cookieConsent',
    //'passport',
    //'passport-simple-password',
    //'passport-enforce',
    'views',
    'routes',
    'errors',
    'listen'
];

// initialzes a module and waits if a promise is returned
var initModule = function(index) {

    // initialize a module
    var moduleName = initModules[index || 0];
    var options = config[moduleName];
    var result = require('./middleware/' + moduleName)(app, logger, options);

    // ensure result is wrapped in a promise
    if (!result || !result.then) {
        result = P.resolve(result);
    }
    
    // advance to next module
    return result.then(function() {
        var nextIndex = index + 1;
        if (nextIndex < initModules.length) {
            return initModule(index + 1);    
        }        
    });    

};

// start by initializing first module
initModule(0);

module.exports = app;
