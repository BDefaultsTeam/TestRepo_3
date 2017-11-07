var CmsFactory = require('../cms/CmsFactory');

module.exports = function(app, logger, options) {

    var cmsFactory = new CmsFactory(options);
    app.set('cmsFactory', cmsFactory);

    app.use(function(req,res,next) {

        var cmsVersion = req.query.cms;
        
        // set a cookie for live mode so subsequent requests don't need a querystring
        if (cmsVersion === 'live') {
            res.cookie('cms', 'live', { path: '/' });
        }

        // check for cookie if querystring wasn't provided
        if (!cmsVersion && req.cookies && req.cookies.cms === 'live') {
            cmsVersion = 'live';
        }

        cmsFactory.getCms(cmsVersion)
            .then(function(cms) {
                req.cms = cms;
            })
            .asCallback(next);

    });

    if (options.cache && options.cache.refreshUrl) {
        app.get(options.cache.refreshUrl, function(req,res,next) {
            
            // need to prevent caching
            res.set('Expires', -1);

            return cmsFactory.cache.refreshDeployedId()
                .then(function(deployedId) {
                    return cmsFactory.getCms(deployedId);
                })
                .then(function(cms) {
                    res.json(cms.id);
                })
                .catch(function(err) {
                    console.error(err);
                    res.send(500, err.message ? err.message : err);
                });
        }); 
    }

    return cmsFactory.init();
};
