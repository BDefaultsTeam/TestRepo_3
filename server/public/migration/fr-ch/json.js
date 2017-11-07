window.onload = init('mkt');

function init(market) {
    try {
        loadJSON(market, function (response) {
            // Parse JSON string into object
            var actual_JSON = JSON.parse(response);

            document.title = actual_JSON.Header.Main;
            document.getElementById("title").innerHTML = actual_JSON.Header.Main;
            document.getElementById("subtitle").innerHTML = actual_JSON.Header.Secondary;

            // Favorites section text
            document.getElementById("lblNumber1").innerHTML = actual_JSON.Tabs.Tab1;
            document.getElementById("favourites_head").innerHTML = actual_JSON.Tabs.Tab1;
            document.getElementById("favourites_hover_text").innerHTML = actual_JSON.Span.Tab1;
            document.getElementById("fav").innerHTML = actual_JSON.Button.Button1;

            // Surf safely section text
            document.getElementById("lblNumber2").innerHTML = actual_JSON.Tabs.Tab2;
            document.getElementById("surf_safely_head").innerHTML = actual_JSON.Tabs.Tab2;            
            document.getElementById("surf_safely_hover_text").innerHTML = actual_JSON.Span.Tab2;
            document.getElementById("learn").innerHTML = actual_JSON.Button.Button2;

            // Extension section text
            document.getElementById("lblNumber3").innerHTML = actual_JSON.Tabs.Tab3;
            document.getElementById("extension-heading").innerHTML = actual_JSON.Tabs.Tab3;            
            document.getElementById("extension_hover_text").innerHTML = actual_JSON.Span.Tab3;
            document.getElementById("extension").innerHTML = actual_JSON.Button.Button3;

            document.getElementById("final_text").innerHTML = actual_JSON.Tabs.Tab4;
            document.getElementById("pDiscoveryContent").innerHTML = actual_JSON.Span.Tab4;
            document.getElementById("more-tips").innerHTML = actual_JSON.Button.Button4;

            // Set Alternative text for all images
            //document.getElementById("divFavoritesBox").setAttribute("alt", actual_JSON.Alt.Favoritesillustration);
            document.getElementById("imgNumber1").setAttribute("alt", actual_JSON.Alt.One);
            document.getElementById("imgSurfExpand").setAttribute("alt", actual_JSON.Alt.Safetyillustration);
            document.getElementById("imgSurfSafely").setAttribute("alt", actual_JSON.Alt.Safetyshield);
            document.getElementById("imgNumber2").setAttribute("alt", actual_JSON.Alt.Two);
            document.getElementById("LR").setAttribute("alt", actual_JSON.Alt.Extensionsillustration);
            document.getElementById("imgNumber3").setAttribute("alt", actual_JSON.Alt.Three);

            // Set Aria label value to read through narrator
            document.getElementById("scaleWrap").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel1);
            document.getElementById("divFavoritesBox").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel2);
            document.getElementById("imgSurfSafely").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel3);
            document.getElementById("LR").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel4);
            document.getElementById("divDiscoverySection").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel5);
            document.getElementById("more-tips").setAttribute("aria-label", actual_JSON.AriaLabel.AriaLabel6);

        });
    }
    catch (err) {
        //alert(err);
    }
}

function loadJSON(market, callback) {
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