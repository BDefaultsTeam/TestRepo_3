var express = require('express');
var rootRoutes = require('../routes/rootRoutes');

module.exports = function(app, logger) {

    var router = express.Router();

    // routes for specific pages
    router.get('/:locale/backup-restore', rootRoutes.getRestorePage);
    router.get('/:locale/speed', rootRoutes.getSpeedPage);

    // special route to redirect root /locale/ requests to /home/locale/
    router.get('/:locale/', function(req, res, next) {
        var locale = res.locals.locale;
        if (locale) {
            // retain querystring
            var qsIndex  = req.url.indexOf('?');
            var qs = qsIndex >= 0 ? req.url.substring(qsIndex) : '';
            res.redirect('/home/' + locale + '/' + qs);
        } else {
            next();
        }
    });

    // detect locale if not provided for home page
    var locales = app.get('locales');
    router.get('', locales.redirectToPreferred);

    app.use('/', router);

    if (app.get('env') === 'development') {
        // test routes for dev environment
    }
};
