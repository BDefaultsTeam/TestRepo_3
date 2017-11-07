(function() {

    var callbacks = [];

    app.analytics = {

        start: function() {
            if (typeof Backbone !== 'undefined') {
                this.pageView(Backbone.history.fragment);
            }
        },

        trigger: function(eventName, data) {
            var i, len, callback;
            for (i = 0, len = callbacks.length; i < len; i++) {
                callback = callbacks[i];
                try {
                    callback(eventName, data);
                } catch (err) {
                    if (console.error) {
                        console.error(err);
                    } else {
                        console.log('analytics error: ' + err);
                    }
                }
            }
        },

        listen: function(callback) {
            callbacks.push(callback);
        },

        currentFragment: null,

        pageView: function(fragment) {

            // consolidate initial home views
            if (!fragment) {
                fragment = '';
            }

            // don't duplicate count navigation calls to current page
            if (fragment === this.currentFragment) {
                return;
            }

            // include the app's root path in the reported url
            var reportUrl = (app.rootPath  || '') + fragment;
            this.trigger('pageView', { url: reportUrl });

            this.currentFragment = fragment;
        },

        videoPlay: function(videoId) {
            this.trigger('videoPlay', { videoId: videoId });
        },

        videoCompleted: function(videoId) {
            this.trigger('videoCompleted', { videoId: videoId });
        },

        socialShare: function(socialType) {
            this.trigger('socialShare', { socialType: socialType });
        },

        completeProcess: function(title) {
            this.trigger('completeProcess', { title: title });
        },

        buttonClick: function(buttonId) {
            this.trigger('buttonClick', { button: buttonId });
        }

    };

})();
