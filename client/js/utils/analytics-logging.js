
(function() {

    app.exports.setAnalyticsLogging = function(enableLogging) {
        app.settings.set('logAnalytics', !!enableLogging);
    };

    app.analytics.listen(function(eventName, data) {

        // make sure logging is enabled
        if (!app.settings.getBoolOrDefault('logAnalytics', false)) {
            return;
        }

        switch (eventName) {
            case 'pageView':
                console.log('analytics - page view: ' + data.url);
                break;
            case 'videoPlay':
                console.log('analytics - video play: ' + data.videoId);
                break;
            case 'videoCompleted':
                console.log('analytics - video completed: ' + data.videoId);
                break;
            case 'socialShare':
                console.log('analytics - social share: ' + data.socialType);
                break;
            case 'completeProcess':
                console.log('analytics - complete process: ' + data.title);
                break;
        }

    });

})();
