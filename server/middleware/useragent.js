var useragent = require('useragent');

module.exports = function(app, logger) {
    app.use(function(req, res, next) {
        var agent = useragent.lookup(req.headers['user-agent']);
        req.useragent = agent;
        next();
    });
};
