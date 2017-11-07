var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

module.exports = function(app, logger) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
};
