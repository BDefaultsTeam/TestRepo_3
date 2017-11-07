/*global awa:true */
/*jshint newcap:false */
(function() {

    app.analytics.initAWA = function(config, requireCookieConsent, callback) {

        var onAwaReady = function() {
            awa.init(config);
            if (callback) {
                callback(awa);
            }
        };

        // NOTE: cookie consent only required if one of the 4 features is enabled (OFF by default)
        // 1. MUID sync
        // 2. Adobe ID sync
        // 3. Google sync
        // 4. Collecting additional MSCOM cookies

        // otherwise, page should load script, example:
        // <script src="https://az725175.vo.msecnd.net/scripts/jsll-4.2.1.js"></script>

        if (requireCookieConsent) {
            var async = true;
            // initializes awa once we script has loaded and we have cookie consent
            window.insertMsccScript('https://az725175.vo.msecnd.net/scripts/jsll-4.2.1.js', async, onAwaReady);
        } else {
            // script has already been loaded
            onAwaReady();
        }
        
    };

    app.analytics.listen(function(eventName, data) {

        // make sure global exists
        if (typeof awa === 'undefined') {
            return;
        }

        switch (eventName) {
            case 'pageView':
                var overrides = {};
                awa.ct.capturePageView(overrides);
                break;
            case 'videoPlay':
                break;
            case 'videoCompleted':
                break;
            case 'socialShare':
                break;
            case 'completeProcess':
                break;
        }

    });

})();
