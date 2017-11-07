//Setting all parameters to be sent in ping
var optimizelyProject = getQryStrParamValues('p');
var particularExperiment = getQryStrParamValues('e');
var particularVariation = getQryStrParamValues('v');
var uniqueNumber = getQryStrParamValues('u');

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

//Main Function
$(document).ready(function () {
        
    // Send Ping Instrumentation to COSMOS

    // Removed below condition, Ping should be sent all cases whenenver page gets loaded. It shouldn't depends on query string parameter.
    //if (optimizelyProject != undefined || particularExperiment != undefined || particularVariation != undefined || uniqueNumber != undefined) {

        optimizelyProject = (optimizelyProject != undefined) ? (optimizelyProject != null && optimizelyProject != "") ? optimizelyProject : "" : "";
        particularExperiment = (particularExperiment != undefined) ? (particularExperiment != null && particularExperiment != "") ? particularExperiment : "" : "";
        particularVariation = (particularVariation != undefined) ? (particularVariation != null && particularVariation != "") ? particularVariation : "" : "";
        uniqueNumber = (uniqueNumber != undefined) ? (uniqueNumber != null && uniqueNumber != "") ? uniqueNumber : "" : "";

        //Handling GUID, based on Cookie Values
        var strGUID = "";
        var cookieList = document.cookie.split(";");
        var regEx = /FREGuid/igm;
        var needToAdd = "1";
        //To check if cookie is undefined or present        
        if (cookieList == undefined || cookieList == null || cookieList == "") {
            //No Cookies are present so create it
            needToAdd = "1";
        }
        else {
            for (var i = 0; i < cookieList.length; i++) {
                var cookie = cookieList[i];
                var cookieGuidObjects = cookie.split(/=/);
                if (regEx.test(cookieGuidObjects[0]) && cookieGuidObjects[0].trim() == "FREGuid") {
                    //Need not create cookie in this case it is already present      
                    needToAdd = "0";
                    strGUID = cookieGuidObjects[1].toString();
                }
            }
        }
        if (needToAdd != "0") {
            createCookie();
        }

        //Function to create cookies
        function createCookie() {
            //Guid Cookie is not present so guid must be created and added to Cookie with expriation of 7 days.
            strGUID = (createGUID() + createGUID() + createGUID() + "4" + createGUID().substr(0, 3) + createGUID() + createGUID() + createGUID() + createGUID()).toUpperCase();
            var currentDate = new Date();
            currentDate.setDate(currentDate.getUTCDate() + 7);
            var cookieValue = "FREGuid=" + strGUID + ";";
            var expirationValue = "expires=" + currentDate.toUTCString() + ";";
            cookieValue = (cookieValue + " " + expirationValue + "path=/;");
            document.cookie = cookieValue;
        }

        //Method to generate random numbers
        function createGUID() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        var ul = "|ul" + encodeURIComponent(window.location.href);        
        var strTVPing = "isU457|tmen-us|op" + optimizelyProject + "|pe" + particularExperiment + "|pv" + particularVariation + "|un" + uniqueNumber + ul;

        //Identify Windows OS versions
        var strOSName = "Windows";
        var userAgent = window.navigator.userAgent;
        var OsStringList = [
                    { fullName: 'Windows10', userAgtStr: /(Windows 10.0|Windows NT 10.0)/ },
                    { fullName: 'Windows8.1', userAgtStr: /(Windows 8.1|Windows NT 6.3)/ },
                    { fullName: 'Windows8', userAgtStr: /(Windows 8|Windows NT 6.2)/ },
                    { fullName: 'Windows7', userAgtStr: /(Windows 7|Windows NT 6.1)/ },
                    { fullName: 'WindowsVista', userAgtStr: /Windows NT 6.0/ },
                    { fullName: 'WindowsServer2003', userAgtStr: /Windows NT 5.2/ },
                    { fullName: 'WindowsXP', userAgtStr: /(Windows NT 5.1|Windows XP)/ }];

        for (var i = 0; i < OsStringList.length; i++) {
            var curString = OsStringList[i];
            if (curString.userAgtStr.test(userAgent)) {
                strOSName = curString.fullName;
                break;
            }
        }

        //Service to send Ping Values
        $.ajax({
            url: "https://g.ceipmsn.com/8SE/44",
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: { MI: strGUID, LV: "1.0.0.1", OS: strOSName, TE: "33", TV: strTVPing },
            crossDomain: true
        });

    //}

});