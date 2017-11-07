/*global MscomCustomEvent:true */
/*jshint newcap:false */
(function() {


    // NOTE: additional interaction type reference here:
    // https://microsoft.sharepoint.com/sites/mscomdata/Pages/wedcs-interaction-type-tagging.aspx

    app.analytics.listen(function(eventName, data) {

        // make sure global exists
        if (typeof MscomCustomEvent === 'undefined') {
            return;
        }

        switch (eventName) {
            case 'pageView':
                MscomCustomEvent('cot', '0');
                break;
            case 'videoPlay':
                MscomCustomEvent('ms.InteractionType','100','cn', data.videoId);
                break;
            case 'videoCompleted':
                MscomCustomEvent('ms.InteractionType','103','cn', data.videoId);
                break;
            case 'socialShare':
                MscomCustomEvent('ms.link_type','social','cn', data.socialType);
                break;
            case 'completeProcess':
                MscomCustomEvent('ms.interactionType', '22', 'cn', data.title);
                break;
        }

    });

})();
