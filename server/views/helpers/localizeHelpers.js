
module.exports = function(Handlebars) {

    return {

        // translation helper
        t: function(key, options) {
            var result = options.data.root.t(key, options.hash);
            return new Handlebars.SafeString(result);
        },
    };
};
