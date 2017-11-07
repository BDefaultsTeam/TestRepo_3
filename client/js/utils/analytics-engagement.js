(function() {


    // utility method to schedule a future event to track user engagement
    var engagementTimeoutIds = [];
    var delayedEvent = function(eventName, delaySeconds) {
        var timeoutId = setTimeout(function() {
            /* jshint newcap: false */
            if (typeof MscomCustomEvent !== 'undefined') {
                /* global MscomCustomEvent: true */
                MscomCustomEvent('ms.interactionType', '4', 'ms.cmpnm', eventName);
                //console.log('custom event: ' + eventName);
            }
        }, delaySeconds * 1000);

        engagementTimeoutIds.push(timeoutId);
    };

    app.startEngagementEvents = function() {

        // start a sequence of events to track user engagement
        delayedEvent('engagement-1', 1);
        delayedEvent('engagement-2', 2);
        delayedEvent('engagement-3', 3);
        delayedEvent('engagement-4', 4);
        delayedEvent('engagement-5', 5);
        delayedEvent('engagement-6', 6);
        delayedEvent('engagement-7', 7);
        delayedEvent('engagement-8', 8);
        delayedEvent('engagement-9', 9);
        delayedEvent('engagement-10', 10);
        delayedEvent('engagement-15', 15);
        delayedEvent('engagement-20', 20);
        delayedEvent('engagement-25', 25);
        delayedEvent('engagement-30', 30);
        delayedEvent('engagement-40', 40);
        delayedEvent('engagement-50', 50);
        delayedEvent('engagement-60', 60);
        delayedEvent('engagement-90', 90);
        delayedEvent('engagement-120', 120);
        delayedEvent('engagement-180', 180);
        delayedEvent('engagement-240', 240);
        delayedEvent('engagement-300', 300);

        // cancel enagement events if the user navigates or switches away from the current tab
        document.addEventListener('visibilitychange', function(){
            if (document.hidden) {
                _.each(engagementTimeoutIds, function(timeoutId) {
                    clearTimeout(timeoutId);
                });
                engagementTimeoutIds = [];
                //console.log('cancelled engagement events');
            }
        });
    };

})();


