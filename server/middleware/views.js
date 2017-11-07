/*global __dirname:true */

var _ = require('lodash');
var path = require('path');
var Handlebars = require('handlebars');
var exphbs = require('express-handlebars');
var P = require('bluebird');
var fs = P.promisifyAll(require('fs'));

module.exports = function(app, logger /*, options */) {

    // get all helper filenames
    var helpersPath = path.join(__dirname, '..', 'views', 'helpers');
    var helperFilenames = fs.readdirSync(helpersPath);

    // utility method to load partials (used by custom block helper)
    Handlebars.loadPartial = function (name) {
        var partial = Handlebars.partials[name];
        if (typeof partial === 'string') {
            partial = Handlebars.compile(partial);
            Handlebars.partials[name] = partial;
        }
        return partial;
    };

    // initialize all the helpers
    var helpers = {};
    _.each(helperFilenames, function(helperFilename) {
        if (!helperFilename.endsWith('.js')) {
            return;
        }

        var additionalHelpers = require(path.join(helpersPath, helperFilename))(Handlebars);
        helpers = _.merge(helpers, additionalHelpers);
    });

    // Set up the handlebars view engine
    var hbs = exphbs.create({
        handlebars: Handlebars,
        layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
        partialsDir: path.join(__dirname, '..', 'views', 'partials'),
        extname: '.html',
        defaultLayout: 'main',
        helpers: helpers,

        // workaround for bug in handlebars, see:
        // https://github.com/ericf/express-handlebars/issues/125
        compilerOptions: undefined
    });

    app.engine('.html', hbs.engine);

    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', '.html');

};
