var gracefulExit = require('express-graceful-exit');

module.exports = function(app, logger, options) {

    app.use(gracefulExit.middleware(app));

    // Support for naught clustering (shutdown)
    process.on('message', function (message) {
        if (message !== 'shutdown') {
            return;
        }

        var httpServer = app.get('httpServer');

        gracefulExit.gracefulExitHandler(app, httpServer, {
            log: true,
            logger: logger.info
        });
    });
};
