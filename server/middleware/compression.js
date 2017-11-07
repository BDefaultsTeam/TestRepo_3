var compress = require('compression');

module.exports = function(app, logger, options) {
    app.use(compress());
};