/*global mscc:true */

(function() {
    var insertScript = function(src, async, onload) {
        var e = document.createElement('script');
        e.async = !!async;
        e.onload = onload;
        e.src = src;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
    };

    app.onMsccConsent = function(action) {
        if (typeof mscc !== 'undefined' && !mscc.hasConsent()) {
            mscc.on('consent', action);
        } else {
            action();
        }
    };

    window.insertMsccScript = function(src, async, onload) {
        app.onMsccConsent(function() {
            insertScript(src, async, onload);
        });
    };

    window.documentWriteMsccScript = function(src, async) {

        var insertAction = function() {
            insertScript(src, async);
        };

        if (typeof mscc !== 'undefined' && !mscc.hasConsent()) {
            mscc.on('consent', insertAction);
        } else {
            // jshint evil: true
            document.write('<script type="text/javascript" src="' + src + '"></script>');
        }
    };

})();
