var winston = require('winston');
var path = require('path');
var util = require('util');
var P = require('bluebird');
var fs = P.promisifyAll(require('fs-extra'));

var isProduction = (process.env.NODE_ENV === 'production');

// ensure log directory exists
fs.ensureDirSync(path.join(__dirname, '../logs/'));

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'warn',
            filename: path.join(__dirname, '../logs/log.json'),
            handleExceptions: true,
            json: true,
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 10,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/exception.json'),
            handleExceptions: true,
            json: true,
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 10,
            colorize: false
        })
    ],
    exitOnError: false
});

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

// only take over the built-in console methods in production
if (isProduction) {

    console.log = function(){
        logger.info.apply(logger, formatArgs(arguments));
    };
    console.info = function(){
        logger.info.apply(logger, formatArgs(arguments));
    };
    console.warn = function(){
        logger.warn.apply(logger, formatArgs(arguments));
    };
    console.error = function(){
        logger.error.apply(logger, formatArgs(arguments));
    };
    console.debug = function(){
        logger.debug.apply(logger, formatArgs(arguments));
    };
}

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};