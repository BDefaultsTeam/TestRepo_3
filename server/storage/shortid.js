// small wrapper around shortid to force base62
var shortid = require('shortid');
 
module.exports.generate = function() {
    var id = shortid.generate();

    // replace any - or _ characters
    return id.replace(/-/g, 'a').replace(/_/g, 'b');
};