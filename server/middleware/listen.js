var _ = require('lodash');
var https = require('https');
var http = require('http');
var fs = require('fs');
var P = require('bluebird');

module.exports = function(app, logger, options) {

    // merge options with defaults
    options = _.merge({
        http: { port: process.env.PORT || 3000 },
        https: { port: 443 }
    },  options);

    return new P(function (resolve) {

        app.set('port', options.http.port);

        // create http server
        var httpServer = http.createServer(app);
        httpServer.listen(options.http.port, function () {

            logger.info('HTTP listening on port ' + options.http.port);

            // For referencing later if necessary
            app.set('httpServer', httpServer);

            // Support for naught clustering (startup)
            if (process.send) { process.send('online'); }

            resolve();
        });

        // only create https server if options (cert & key are provided)
        if (options.https.keyPath) {

            var httpsOptions = {
                key: fs.readFileSync(options.https.keyPath),
                cert: fs.readFileSync(options.https.certPath)
            };

            https.createServer(httpsOptions, app).listen(options.https.port, function() {
                logger.info('HTTPS listening on port ' + options.https.port);
            });
        }

    });

};
