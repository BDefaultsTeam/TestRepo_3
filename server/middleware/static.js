/*global __dirname:true */

var _ = require('lodash');
var path = require('path');
var express = require('express');

module.exports = function(app, logger, options) {

    options = _.merge({
        routes: [
            { url: '/', path: 'public' }
        ]
    }, options);

    _.each(options.routes, function(route) {
        app.use(route.url, express.static(path.join(__dirname, '..', route.path)));
    });
};
