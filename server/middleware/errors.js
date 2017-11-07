var _ = require('lodash');

module.exports = function(app, logger, options) {

    // merge options with defaults
    options = _.merge({
        showStacktrace: false
    }, options);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            layout: false,
            message: err.message,
            error: options.showStacktrace ? err : {}
        });

        if (err.status !== 404) {
            console.error(err);
        }
    });

};