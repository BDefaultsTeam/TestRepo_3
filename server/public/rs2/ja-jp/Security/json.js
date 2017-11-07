window.onload = init();

function init() {
    try {
        loadJSON(function (response) {
            var actual_JSON = JSON.parse(response);
            document.getElementById("welcome-heading").innerHTML = actual_JSON.speedWelcomeToEdge;
            document.getElementById("welcome-windows").innerHTML = actual_JSON.speedWelcomeWindows10;
            document.getElementById("speedFaster").innerHTML = actual_JSON.speedFaster;
            document.getElementById("speedGooglesBenchmark").innerHTML = actual_JSON.speedGooglesBenchmark;
            document.getElementById("speedGetStarted").innerHTML = actual_JSON.speedGetStarted;
            document.getElementById("link-bookmarks").innerHTML += actual_JSON.importBookmarks;
            document.getElementById("link-extensions").innerHTML += actual_JSON.customizeWithExtensions;
            document.getElementById("link-new").innerHTML += actual_JSON.seeWhatsNew;
        });
    }
    catch (err) {
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    try {
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'messages.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
    catch (err) {
    }
}