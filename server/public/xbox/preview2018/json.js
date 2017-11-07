window.onload = init();

function init() {
    try {
        loadJSON(function (response) {

            // Parse JSON string into object
            var actual_JSON = JSON.parse(response);

            document.getElementById("welcome-heading").innerHTML = actual_JSON.speedWelcomeToEdge;
            document.getElementById("welcome-windows").innerHTML = actual_JSON.speedWelcomeWindows10;
            document.getElementById("speedFaster").innerHTML = actual_JSON.speedFaster;
            document.getElementById("speedGooglesBenchmark").innerHTML = actual_JSON.speedGooglesBenchmark;
            document.getElementById("pSection1Head").innerHTML = actual_JSON.speedBodyHeader;
            document.getElementById("pBodyContent").innerHTML = actual_JSON.speedBodyContent;
            document.getElementById("pBodyContent1").innerHTML = actual_JSON.speedBodyContent1;
            //document.getElementById("speedMicrosoftEdge").innerHTML = actual_JSON.speedMicrosoftEdge;
            //document.getElementById("speedFastest").innerHTML = actual_JSON.speedFastest;
            //document.getElementById("speedScore1").innerHTML = actual_JSON.speedScore;
            //document.getElementById("speedScore2").innerHTML = actual_JSON.speedScore;
            //document.getElementById("speedScore3").innerHTML = actual_JSON.speedScore;
            //document.getElementById("speedChrome").innerHTML = actual_JSON.speedChrome;
            //document.getElementById("speedChromeSlower").innerHTML = actual_JSON.speedChromeSlower;
            //document.getElementById("speedFirefox").innerHTML = actual_JSON.speedFirefox;
            //document.getElementById("speedFirefoxSlower").innerHTML = actual_JSON.speedFirefoxSlower;
            
            //document.getElementById("speedGetStarted").innerHTML = actual_JSON.speedGetStarted;
            //document.getElementById("link-bookmarks").innerHTML += actual_JSON.importBookmarks;
            //document.getElementById("link-extensions").innerHTML += actual_JSON.customizeWithExtensions;
            //document.getElementById("link-new").innerHTML += actual_JSON.seeWhatsNew;
            
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