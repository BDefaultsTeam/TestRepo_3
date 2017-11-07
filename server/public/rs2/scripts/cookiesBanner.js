var isConsentRequired = false;
var isMSCCCookie = false;
var market = document.getElementById('marketId').value;
var wedcsFlag = false;
var minimumConsentDate;
var cookieName;

var URL = "https://uhf.microsoft.com/" + market + "/shell/api/mscc?sitename=Microsoft Edge Welcome(RS2-Tabs)&domain=microsoft.com";

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
        minimumConsentDate = response.MinimumConsentDate;
        cookieName = response.CookieName;

        var JSURL = response.Js;
        var CSSURL = response.Css;
        var Banner = response.Markup;
        var Error = response.Error;
        if (isConsentRequired) {

            minimumConsentDate = Math.floor((Date.parse(new Date(response.MinimumConsentDate))) / 1e3);
            validateMinimumConsentDate();

            $('body').prepend(Banner);
            $('head').append("<script type='text/javascript' src='" + JSURL + "'></script>");
            $('head').append("<link rel='stylesheet' href='" + CSSURL + "'>");

            $("#msccBanner").css({
                left: "0px",
                width: "auto",
                opacity: "1",
                "z-index": 1
            });

            setTimeout(function () {
                containerSize();
            }, 900);

            if (getCookie(cookieName)) {
                addTrackingScript(null);
            }

        }
        else {
            //Add the All tracking events            
            addTrackingScript(null);
        }
        setTimeout(function () {            
            EdgeDiscoveryCenter.tabPage({});
        }, 100);
    },
    async:false
});

//Validates whether Consent Date is older than the MinimumConsentDate and if so deletes the MSCC cookie
function validateMinimumConsentDate() {
    var consentDate = getCookieValue(cookieName);
    if (consentDate < minimumConsentDate)
        deleteCookie(cookieName);
}

//Deletes MSCC cookie
function deleteCookie(cookieName) {
    if (getCookie(cookieName)) {
        var date = new Date();
        date.setTime(date.getTime() - (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        var domain = "domain=." + window.location.hostname;
        var cname = cookieName;
        var cvalue = "";
        var path = "path=/";
        //Checking Production Domain
        if (domain.includes(".microsoft.com"))
            domain = "domain=.microsoft.com";
        document.cookie = cname + "=" + cvalue + ";" + domain + ";" + expires + ";" + path;
    }
}

//Function to get cookie value
function getCookieValue(c_name) {
    var aCookie = document.cookie.split("; ");
    var aCrumb;
    var i;
    for (i = 0; i < aCookie.length; i++) {
        aCrumb = aCookie[i].split("=");
        if (c_name === aCrumb[0]) {
            return aCrumb[1];
        }
    }
    return 0;
}

//Function to get cookie availability after user consent
function getCookie(c_name) {
    var cookieValue = false;
    var aCookie = document.cookie.split("; ");
    var aCrumb;
    var i;
    for (i = 0; i < aCookie.length; i++) {
        aCrumb = aCookie[i].split("=");
        if (c_name === aCrumb[0]) {
            cookieValue = true;
        }
    }
    return cookieValue;
}

//To Check if Script is added already
function validateScriptReference() {
    var isScriptAlreadyLoaded = [];
    var scriptArray = isScriptLoaded();
    var noScriptArray = isNoScriptLoaded();
    //console.log(scriptArray);
    //console.log(noScriptArray);
    var url = ["//cdn.optimizely.com/js/3325070522.js", "//ad.atdmt.com/m/a.js;m=11087203742450;", "//ad.atdmt.com/m/a.html;m=11087203742450;", "//c.microsoft.com/ms.js"];

    $.each(url, function (i, val) {
        //console.log("val " + val);
        var matchedURLInScript = scriptArray.find(function (currentValue, index, arr) {
            return currentValue.includes(val);
        });

        //console.log("result " + matchedURLInScript);

        if (matchedURLInScript != null)
            isScriptAlreadyLoaded.push(true);
        else if (matchedURLInNoScript == null) {
            var matchedURLInNoScript = noScriptArray.find(function (currentValue, index, arr) {
                return currentValue.includes(val);
            });
            if (matchedURLInNoScript != null)
                isScriptAlreadyLoaded.push(true);
            else
                isScriptAlreadyLoaded.push(false);
        }
    });
    return isScriptAlreadyLoaded;
}

//To get all the Script src in the page
function isScriptLoaded() {
    var scripts = document.getElementsByTagName('script');
    var scriptArray = [];
    for (var i = scripts.length; i--;) {
        scriptArray.push(scripts[i].src);
    }
    return scriptArray;
}

//To get all the No Script src in the page
function isNoScriptLoaded() {
    var noScripts = document.getElementsByTagName('noscript');
    var noScriptArray = [];
    for (var i = noScripts.length; i--;) {
        noScriptArray.push(noScripts[i].innerHTML);
    }
    return noScriptArray;
}


var targetId = "";
function findTargetId(target) {
    return target == targetId;
}
var keyCode = 0;
$(document).keydown(function (event) {
    keyCode = event.keyCode;
});
//To check whether user has clicked any predefined links if so enables the scripts
var filteredIdArray = ["link-bookmarks", "link-extensions", "link-new"];
$(document).click(function (event) {
    targetId = event.target.id;
    if (filteredIdArray.find(findTargetId)) {
        if (keyCode == 13) {
            mscc.setConsent() == true;
        }
        var isDynamicScriptLoaded = validateScriptReference();
        setTimeout(function () {
            validateMinimumConsentDate();
            if (isConsentRequired && getCookie(cookieName) && !isMSCCCookie) {
                addTrackingScript(isDynamicScriptLoaded);
                isMSCCCookie = true;
            }
        },500);
    }           
});


$(document).mousedown(function (event) {
    if (event.which === 2) {
        targetId = event.target.id;
        if (filteredIdArray.find(findTargetId)) {
            var isDynamicScriptLoaded = validateScriptReference();
            setTimeout(function () {
                validateMinimumConsentDate();
                if (isConsentRequired && getCookie(cookieName) && !isMSCCCookie) {
                    addTrackingScript(isDynamicScriptLoaded);
                    isMSCCCookie = true;
                }
            },500);
        }
    }
});

window.onresize = function () {
    containerSize();
};


function containerSize() {
    var ls = new TimelineMax;
    var bannerRows = getRows("#msccBanner");
    if (bannerRows != 0) {

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


        if (getRows("#msccBanner") == 5) {
            var height = "0px";
            if (window.innerHeight >= 600) {
                height = "85px";
            }
            else if (window.innerHeight >= 500) {
                height = "88px";
            }
            else if (window.innerHeight >= 400) {
                height = "90px";
            }
            else if (window.innerHeight >= 300) {
                height = "92px";
            }
            else {
                height = "95px";
            }
            ls.to(".contentContainer", 0.5, {
                "top": height
            })
        }

        if (getRows("#msccBanner") == 4) {
            var height = "0px";

            if (window.innerHeight >= 600) {
                height = "60px";
            }
            else if (window.innerHeight >= 500) {
                height = "60px";
            }
            else if (window.innerHeight >= 400) {
                height = "65px";
            }
            else if (window.innerHeight >= 300) {
                height = "65px";
            }
            else {
                height = "70px";
            }

            ls.to(".contentContainer", 0.5, {
                "top": height
            })
        }

        if (getRows("#msccBanner") == 3) {

            var height = "0px";

            if (window.innerHeight >= 600) {
                height = "30px";
            }
            else if (window.innerHeight >= 500) {
                height = "35px";
            }
            else if (window.innerHeight >= 400) {
                height = "40px";
            }
            else if (window.innerHeight >= 300) {
                height = "45px";
            }
            else {
                height = "50px";
            }
            ls.to(".contentContainer", 0.5, {
                "top": height
            })
        }

        if (getRows("#msccBanner") == 2) {

            if (window.innerHeight >= 600) {
                height = "10px";
            }
            else if (window.innerHeight >= 500) {
                height = "15px";
            }
            else if (window.innerHeight >= 400) {
                height = "20px";
            }
            else if (window.innerHeight >= 400) {
                height = "25px";
            }
            else {
                height = "30px";
            }
            ls.to(".contentContainer", 0.5, {
                "top": height
            })
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

function addTrackingScript(isDynamicScriptLoaded) {

    //Optimizely
    isDynamicScriptLoaded == null ? $('head').append("<script src='https://cdn.optimizely.com/js/3325070522.js'><\/script>")
    : isDynamicScriptLoaded[0] == true ? null : $('head').append("<script src='https://cdn.optimizely.com/js/3325070522.js'><\/script>");

    //Atlas Tag
    var AtlasScript = "var e = document.createElement(\"script\");\n";
    AtlasScript += "e.async = true;\n";
    AtlasScript += "e.src = \"https://ad.atdmt.com/m/a.js;m=11087203742450;cache=\" + Math.random() + \"?\";\n";
    AtlasScript += "var s = document.getElementsByTagName(\"script\")[0];\n";
    AtlasScript += "s.parentNode.insertBefore(e, s);\n";

    isDynamicScriptLoaded == null ? $('body').append("<script>\n" + AtlasScript + " <\/script>")
       : isDynamicScriptLoaded[1] == true ? null : $('body').append("<script>\n" + AtlasScript + " <\/script>");

    var AtlasNoScript = "<iframe \n";
    AtlasNoScript += "style=\"display:none;\"\n";
    AtlasNoScript += "src=\"https://ad.atdmt.com/m/a.html;m=11087203742450;noscript=1?\">\n";
    AtlasNoScript += "<\/iframe>\n";

    isDynamicScriptLoaded == null ? $('body').append("<noscript>\n" + AtlasNoScript + " <\/noscript>")
    : isDynamicScriptLoaded[2] == true ? null : $('body').append("<noscript>\n" + AtlasNoScript + " <\/noscript>");

    // WEDCS Scripts    
    if (isDynamicScriptLoaded != null) {
        if (isConsentRequired && getCookie(cookieName)) {
            if (!wedcsFlag) {
                isDynamicScriptLoaded == null ? document.write('<script type="text/javascript" src="https://c.microsoft.com/ms.js"></script>')
                 : isDynamicScriptLoaded[3] == true ? null : document.write('<script type="text/javascript" src="https://c.microsoft.com/ms.js"></script>');
                wedcsFlag = true;
            }
        }
    }
}

document.write = function (content) {
    $('<div></div>')
      .html(content)
      .insertAfter('noscript');
};

function documentWriteMsccScript(scriptURL) {
      if (!isConsentRequired || getCookie(cookieName)) {
        if (!wedcsFlag) {
            document.write('<script type="text/javascript" src="' + scriptURL + '"></script>');
            wedcsFlag = true;
        }
    }
}
