window.onload = init();

function init() {
    try {
        loadJSON(function (response) {

            // Parse JSON string into object
            do {
                var actual_JSON = JSON.parse(response);
            } while (actual_JSON == null || actual_JSON == "undefined" || actual_JSON =="")
            //document.getElementById("welcome-tagline").innerHTML = actual_JSON.tabsWelcomeWindows10;
            document.getElementById("welcome-claim").innerHTML = actual_JSON.tabsWelcomeClaim;
            document.getElementById("video-overlay-1").innerHTML = actual_JSON.tabsTabPreviews;
            document.getElementById("video-overlay-2").innerHTML = actual_JSON.tabsOneAtATime;
            document.getElementById("video-overlay-3").innerHTML = actual_JSON.tabsAllAtOnce;
            document.getElementById("video-overlay-4").innerHTML = actual_JSON.tabsForLater;
            document.getElementById("video-overlay-5").innerHTML = actual_JSON.tabsBringBack;



            document.getElementById("link-bookmarks").innerHTML += actual_JSON.importBookmarks;
            document.getElementById("link-extensions").innerHTML += actual_JSON.customizeWithExtensions;
            document.getElementById("link-new").innerHTML += actual_JSON.seeWhatsNew;

            document.getElementById("speedGetStarted").innerHTML = actual_JSON.speedGetStarted;

            document.getElementById("welcome-heading").innerHTML = actual_JSON.speedWelcomeToEdge;
            document.getElementById("welcome-tagline1").innerHTML = actual_JSON.welcomeTagline1
            document.getElementById("welcome-tagline2").innerHTML = actual_JSON.welcomeTagline2;
            document.getElementById("welcome-tagline3").innerHTML = actual_JSON.welcomeTagline3;
        });
    }
    catch (err) {
        //alert(err);
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    try {
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'messages.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
    catch (err) {
        //alert(err);
    }
}