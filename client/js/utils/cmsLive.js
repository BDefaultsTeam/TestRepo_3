/*global docCookies: true */

(function() {

    var initCmsLiveButton = function() {

        // quit if cookies.js library isn't available
        if (typeof docCookies === 'undefined') {
            return;
        }

        if (docCookies.getItem('cms') !== 'live') {
            return;
        }

        // create live indicator
        var $el = $('<div class="cmsLive">')
            .text('CMS Live')
            .css({
                position: 'fixed',
                bottom: 0,
                right: 0,
                color: '#fff',
                background: '#cc292b',
                padding: '5px 0 5px 5px',
                'z-index': 9999
            });

        // create disable button
        $('<span>').text('X')
            .appendTo($el)
            .css({
                'margin-left': '5px',
                'padding': '5px 10px',
                'background-color': 'maroon',
                'cursor': 'pointer'
            })
            .on('click', function(e) {

                // remove cms cookie at root
                docCookies.removeItem('cms', '/');

                // get current url without querystring
                var url = [location.protocol, '//', location.host, location.pathname].join('');

                // get qs values that are not cms=live
                var qsValueCount = 0;
                $.each(app.querystring, function(key, value) {
                    if (key === 'cms') {
                        return;
                    }

                    url += (qsValueCount === 0) ? '?' : '&';
                    qsValueCount++;

                    url += key + '=' + encodeURIComponent(value);
                });

                location.href = url + location.hash;
            });

        $el.appendTo(document.body);
    };

    // wait to create button until all utils are available
    setTimeout(initCmsLiveButton, 0);

})();