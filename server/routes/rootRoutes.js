
module.exports.getRestorePage = function(req, res, next) {

    var locale = res.locals.locale;
    if (!locale) {
        // redirect to en-gb (which enables cookie compliance)
        return res.redirect('/en-gb/backup-restore');
    }

    var cdn = res.locals.cdn;
    res.render('restore', {
        cssUrls: [ 
            cdn.getUrl('css/bootstrap.min.css'),
            cdn.getUrl('css/restore.css')
        ],
        scriptUrls: [ cdn.getUrl('scripts/restore.js') ]
    });
};

module.exports.getSpeedPage = function(req, res, next) {
    
    var cdn = res.locals.cdn;
    res.render('speed', {
        cssUrls: [ 
            cdn.getUrl('css/speed.css')
        ],
        scriptUrls: [ cdn.getUrl('scripts/speed.js') ]
    });        
    
};
