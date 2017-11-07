var isConsentRequired = false;
var market = document.getElementById('marketId').value;

var URL = "https://uhf.microsoft.com/" + market + "/shell/api/mscc?domain=microsoft.com";

var mscc_eudomain = getQryStrParamValues('mscc_eudomain');
if (mscc_eudomain) {
    if (mscc_eudomain.toLowerCase() == "true")
        URL += "&mscc_eudomain=true";
    else
        URL += "&mscc_eudomain=false";
}

// JSLL Scripts
$('head').append("<meta name='ms.appid' content='JS:Msedgefre'/>");

$.ajax({
    url: URL,
    cache: false,
    success: function (response) {
        var output = JSON.stringify(response);
        isConsentRequired = response.IsConsentRequired;
        var JSURL = response.Js;
        var CSSURL = response.Css;
        var Banner = response.Markup;
        var Error = response.Error;
        if (isConsentRequired) {
            $('body').prepend(Banner);
            $('head').append("<script type='text/javascript' src='" + JSURL + "'></script>");
            $('head').append("<link rel='stylesheet' href='" + CSSURL + "'>");

            $("#msccBanner").css({
                left: "0px",
                width: "auto",
                opacity: "0",
                "z-index": 1
            });

            setTimeout(function () {
                containerSize();
            }, 800);

            if (localStorage.getItem("EDGEFRESpeed_UserConsent") == "1") {
                addTrackingScript();
            }

        }
        else {
            //Add the All tracking events            
            addTrackingScript();
        }
        setTimeout(function () {
            EdgeDiscoveryCenter.speedPage({});
        }, 100);
    },
    async: false
});

var targetId = "";
function findTargetId(target) {
    return target == targetId;
}
//To check whether user has clicked any predefined links if so enables the scripts
var filteredIdArray = ["speedDetailsHere", "link-bookmarks", "link-extensions", "link-new"];
$(document).click(function (event) {
    targetId = event.target.id;
    if (filteredIdArray.find(findTargetId)) {
        if (isConsentRequired && (localStorage.getItem("EDGEFRESpeed_UserConsent") != "1")) {
            addTrackingScript();
            localStorage.setItem("EDGEFRESpeed_UserConsent", "1");
        }
    }
});

window.onresize = function () {
    containerSize();
};


function containerSize() {

    var bannerRows = getRows("#msccBanner");
    if (bannerRows != 0) {
        $("#welcome-heading").css({ "padding-top": "20px" });
        // Reduce the Banner Font size 
        if (window.innerHeight >= 600) {
            $("#msccBanner").css({
                "font-size": "13px"
            });
        }
        else if (window.innerHeight >= 500) {
            $("#msccBanner").css({
                "font-size": "12px"
            });
        }
        else if (window.innerHeight >= 400) {
            $("#msccBanner").css({
                "font-size": "11px"
            });
        }
        else {
            $("#msccBanner").css({
                "font-size": "10px"
            });
        }


        if (getRows("#msccBanner") >= 5) {
            $("#msccBanner").css({
                "font-size": "10px",
                opacity: "1"
            });
        }

        if (getRows("#msccBanner") == 4) {
            $("#msccBanner").css({
                "font-size": "11px",

                opacity: "1"
            });
        }

        if (getRows("#msccBanner") == 3) {
            $("#msccBanner").css({
                "font-size": "12px",

                opacity: "1"
            });

        }

        if (getRows("#msccBanner") == 2) {
            $("#msccBanner").css({
                "font-size": "13px",

                opacity: "1"
            });

        }
    }
}

function getRows(selector) {
    var height = $(selector).height();
    if (height == null) {
        return 0;
    }
    var line_height = $(".cc-text").css('line-height');
    line_height = parseFloat(line_height);
    if (isNaN(line_height))
        line_height = 26;
    var rows = height / line_height;
    return Math.round(rows);
}

//Function to get query string value based on parameter
function getQryStrParamValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0].toLowerCase() == param.toLowerCase()) {
            if (urlparam[1] != null)
                return urlparam[1].toLowerCase();
        }
    }
}

function addTrackingScript() {

    //Optimizely
    $('head').append("<script src='https://cdn.optimizely.com/js/3325070522.js'><\/script>");

    //Atlas Tag
    var AtlasScript = "var e = document.createElement(\"script\");\n";
    AtlasScript += "e.async = true;\n";
    AtlasScript += "e.src = \"https://ad.atdmt.com/m/a.js;m=11087203742450;cache=\" + Math.random() + \"?\";\n";
    AtlasScript += "var s = document.getElementsByTagName(\"script\")[0];\n";
    AtlasScript += "s.parentNode.insertBefore(e, s);\n";

    var AtlasNoScript = "<iframe \n";
    AtlasNoScript += "style=\"display:none;\"\n";
    AtlasNoScript += "src=\"https://ad.atdmt.com/m/a.html;m=11087203742450;noscript=1?\">\n";
    AtlasNoScript += "<\/iframe>\n";

    $('body').append("<script>\n" + AtlasScript + " <\/script>");
    $('body').append("<noscript>\n" + AtlasNoScript + " <\/noscript>");

    // WEDCS Scripts    
    if (isConsentRequired && localStorage.getItem("EDGEFRESpeed_UserConsent") != "1") {
        document.write('<script type="text/javascript" src="https://c.microsoft.com/ms.js"></script>');
    }
}

document.write = function (content) {
    $('<div></div>')
      .html(content)
      .insertAfter('noscript');
};

function documentWriteMsccScript(scriptURL) {
    if (!isConsentRequired || localStorage.getItem("EDGEFRESpeed_UserConsent") == "1") {
        document.write('<script type="text/javascript" src="' + scriptURL + '"></script>');
    }
}

