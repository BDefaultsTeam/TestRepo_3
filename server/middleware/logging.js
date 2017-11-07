var morgan = require('morgan');

module.exports = function(app, logger) {

    if (app.get('env') === 'development') {
        app.use(morgan('dev'));
    } else {
        // redirect output to winston in production
        app.use(morgan(
            ':method :url :status :res[content-length] - :response-time ms', 
            { 'stream': logger.stream }
        ));
    }
    
};
