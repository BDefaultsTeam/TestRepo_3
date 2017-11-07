var expressValidator = require('express-validator');

module.exports = function(app, logger) {
    app.use(expressValidator());    
};



