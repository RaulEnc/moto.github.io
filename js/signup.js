i18n = {};
i18n.txt = {};

$(function(){
    var I18N_LOCALS_PATH = "/ssoauth/web/i18n/Localizer";
//    var I18N_LOCALS_AMP_PATH = "/ssoauth/web/i18n/AMP/Localizer_";
//    var I18N_LOCALS_AMP_DEFAULT = "/ssoauth/web/i18n/AMP/Localizer.js";
    var CONFIG_PATH = "/ssoauth/web/conf/config";
    var APP_CONFIG_PATH = "/ssoauth/web/conf/apps/config";
    var APPID = 'DPOQDFUXWO5C7YKNFV74A617EEA6SJQR';
    var textFieldTimer = null;

    var legalLinks = [
        {locale:'en_US', url:'https://www.motorola.com/us/legal/motorola-legal-and-privacy-policy'},
        {locale:'en_CA', url:'https://www.motorola.com/us/legal/privacy-policy'},
        {locale:'fr_CA', url:'https://www.motorola.com/us/legal/privacy-policy'},
        {locale:'pt_BR', url:'https://www.motorola.com.br/legal/privacy-policy'},
        {locale:'es_VOID', url:'http://latam.motorola.com/consumers/About_Motorola-Legal-Privacy_Policy/About_Motorola-Legal-Privacy_Policy,es_latam,pg.html'},
        {locale:'es_MX', url:'https://www.motorola.com.mx/legal/privacy-policy'},
        {locale:'es_AR', url:'http://www.motorola.com.ar/legal/privacy-policy'},
        {locale:'en_GB', url:'https://www.motorola.co.uk/legal/privacy-policy'},
        {locale:'fr_FR', url:'https://www.motorola.fr/legal/privacy-policy'},
        {locale:'de_DE', url:'https://www.motorola.de/legal/terms-of-use'},
        {locale:'en_AU', url:'https://www.motorola.co.uk/legal/privacy-policy'},
        {locale:'zh_CN', url:'http://www.motorola.com.cn/legal/privacy-policy'},
        {locale:'ja_JP', url:'http://www.motorola.co.jp/legal/privacy-policy'},
    ];

    var homepageLinks = [
           {locale:'en_US', url:'http://www.motorola.com'},
           {locale:'en_CA', url:'http://www.motorola.ca'},
           {locale:'fr_CA', url:'http://fr.motorola.ca'},
           {locale:'pt_BR', url:'http://www.motorola.com.br'},
           {locale:'es_VOID', url:'http://latam.motorola.com'},
           {locale:'es_MX', url:'http://www.motorola.com.mx'},
           {locale:'es_AR', url:'http://www.motorola.com.ar'},
           {locale:'en_GB', url:'http://www.motorola.co.uk'},
           {locale:'fr_FR', url:'http://www.motorola.fr'},
           {locale:'de_DE', url:'http://www.motorola.de'},
           {locale:'en_AU', url:'http://www.motorola.com.au'},
           {locale:'zh_CN', url:'http://www.motorola.com.cn'},
           {locale:'ja_JP', url:'http://www.motorola.co.jp'},
    ];

    if (typeof Object.create === 'undefined') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    
    var gObject = Object.create(Object.prototype, {
        "svc" : {
            value : null,
            writable : true
        },
        "continueUrl" : {
            value : null,
            writable : true
        },
        "langString" : {
            value : null,
            writable : true
        },
   
        "authToken" : {
            value : null,
            writable : true
        },
        "userId" : {
            value : null,
            writable : true
        },
        "userName" : {
            value : null,
            writable : true
        },
        "appId" : {
            value : null,
            writable : true
        },
        "displayName" : {
            value : null,
            writable : true
        },
        "mailId" : {
            value : null,
            writable : true
        },
        "amServer" : {
            value : null,
            writable : true
        },
        "cloudset" : {
            value : null,
            writable : true
        },
        "accountCreatedNow" : {
            value : null,
            writable : true
        },
        "googleScope" : {
            value : null,
            writable : true
        },
        "tokenFromUserPrincipal" : {
            value : null,
            writable : true
        }
    });
    var alrt_state = "NO_STATE";
    
    function isDef( val ) {
        return typeof(val) != 'undefined';
    }

    function isNil( val ) {
        return typeof(val) == 'undefined' || val === null;
    }

    function enco( uriComponentStr ) {
        return encodeURIComponent(uriComponentStr);
    }

    function deco( uriComponentStr ) {
        return decodeURIComponent(uriComponentStr);
    }

    /* DEBUG = false; // set to false to disable debugging
    old_console_log = console.log;
    console.log = function() {
        if ( DEBUG ) {
            old_console_log.apply(this, arguments);
        }
    }*/
    function newXMLHttpRequest() {
        var xmlreq = false;
        if (window.XMLHttpRequest) {
            xmlreq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // Try ActiveX
            try {
                xmlreq = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e1) {
                // first method failed
                try {
                    xmlreq = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e2) {
                // both methods failed
                }
            }
        }
        return xmlreq;
    }


    function rmParam(url, paramName) {
        return url
            .replace(new RegExp('([&?])'+paramName+'=[^&]*&','g'),"$1")
            .replace(new RegExp('[&?]'+paramName+'=[^&]*$','g'),"");
    }
    
    function getPageLink(locale, pageLinkArray) {
        // First look for an exact locale match.
        for (var i=0; i < pageLinkArray.length; ++i) {
            if (pageLinkArray[i].locale == locale) {
                return pageLinkArray[i].url;
            }
        }

        var localeParts = parseLocale(locale,'');

        // If no locale exactly matches, then look for a match on the
        // country. The first match wins.
        for (var i=0; i < pageLinkArray.length; ++i) {
            var currCountry = parseLocale(pageLinkArray[i].locale,'')[1];
            if (currCountry == localeParts[1]) {
                return pageLinkArray[i].url;
            }
        }

        // If there was still no match, then look for a match on the
        // language. The first match wins.
        for (var i=0; i < pageLinkArray.length; ++i) {
            var currLanguage = parseLocale(pageLinkArray[i].locale,'')[0];
            if (currLanguage == localeParts[0]) {
                return pageLinkArray[i].url;
            }
        }

        // If there was no match at all, then return the first in the list.
        return pageLinkArray[0].url;
    }

    window.openLegalLink = function() {
        window.open(getPageLink(gObject.langString, legalLinks));
    };

    window.openHomepageLink = function() {
        window.open(getPageLink(gObject.langString, homepageLinks));
    };

    function customAlert(state, title, message) {
        $("#alert_title").text(title);
        $("#alert_text").html(message);

        if(state == undefined) {
            return;
        }
    
        alrt_state = state;
        $("#body_div").fadeTo("fast", 0.33);
        $("#alert_dialog_box").removeClass('hidden');
    }

    function launchSpinner(statusMsg) {
        $("#body_div").fadeTo("fast", 0.33);
        $("#spinner_box").removeClass('hidden');
        $("#spinner_text").text(statusMsg);
    }
    
    function updateSpinner(statusMsg) {
        //        $("#body_div").fadeTo("fast", 0.33);
        $("#spinner_box").removeClass('hidden');
        $("#spinner_text").text(statusMsg);
    }
    
    function exitSpinner() {
        $("#spinner_text").text("");
        $("#spinner_box").addClass('hidden');
    }

    var Request = {
        parameter : function(name) {
            return this.parameters()[name];
        },

        parameters : function() {
            var result = {};
            var url = window.location.href;
            var start = url.indexOf('?');
            start = start < 0 ? url.length : start + 1;
            var end = url.indexOf('#');
            end = end < 0 ? url.length : end;
            var parameters = url.slice(start,end).split('&');

            for ( var i = 0; i < parameters.length; i++) {
                var parameter = parameters[i].split('=');
                result[parameter[0]] = parameter[1];
            }
            return result;
        }
    };
   
    function replaceParam(url, name, value) {
        name = encodeURIComponent(name);
        var urlAndHash = url.split('#',2);
        var urlAndParams = urlAndHash[0].split('?',2);
        var urlBase = urlAndParams[0];
        var paramsStr = urlAndParams.length < 2 ? '' : '&'+urlAndParams[1];
        var re = RegExp('&'+name+'(=[^&]*)?');
        var newParamStr = '';
        if (!isNil(value)) {
            value = encodeURIComponent(value);
            newParamStr = '&' + name + '=' + value;
        }
        if (re.test(paramsStr)) {
            paramsStr = paramsStr.replace(re, newParamStr);
        }
        else {
            paramsStr += newParamStr;
        }
        paramsStr = paramsStr.slice(1);
        var result = urlBase;
        if (paramsStr.length > 0) {
            result += '?' + paramsStr;
        }
        if (urlAndHash.length > 1) {
            result += '#' + urlAndHash[1];
        }
        return result;
    }

    // Apply the settings for the app that is calling for signin. This
    // involves showing the appropriate parts of the UI depending on
    // what the app supports.
    function applyAppRules() {
    }

    function importScript(url1, url2, success, error) {
        if (!url1) {
            return;
        }

        // TODO: Have separate error1 and error2 callbacks to
        // correspond to url1 and url2 failures? Also make them
        // default to the success callback if not specified.
        $.ajax({
            dataType: 'script',
            type: "GET",
            cache: false,
            url: url1,
            success: function(response, textStatus) {
                if (url2) {
                    importScript(url2, null, success, error);
                }
                else {
                    success(response, textStatus)
                }
            },
            error: function(request, textStatus) {
                console.log( 'Unable to import ' + url1 +
                    '. (' + textStatus + ')' );
                error(request, textStatus);
            }
        });
    }

    // Import multiple javascirpt files in parallel using ajax calls.
    // {urls} is an array of URL pairs, each of which is an array with
    // two entries: a baseline URL and a secondary URL. The script at
    // baseline URL is imported first, and if that succeeds, then the
    // script at the secondary URL will be imported. The secondary URL
    // can be null. Once importing of all the URL pairs has finished,
    // either {success} or {error} will be called, depending on whether
    // any of the imports encountered errors.
    function importScriptsInParallel(urls, success, error) {
        // Keep track of the number of successes and failures to
        // determine when everything has completed and whether there
        // was any error.
        var totalCnt = urls.length;
        var successCnt = 0;
        var errorCnt = 0;
        var handleCompletion = function() {
            // If all the imports have completed, then call either
            // {success} or {error} as appropriate.
            if (successCnt + errorCnt >= totalCnt) {
                if (errorCnt) {
                    error();
                }
                else {
                    success();
                }
            }
        };

        // When an import (both baseline and secondary) has completed
        // successfully, this function is called.
        var successWrap = function() {
            ++successCnt;
            handleCompletion();
        };

        // When an import (both baseline and secondary) has completed
        // with an error, this function is called.
        var errorWrap = function() {
            ++errorCnt;
            handleCompletion();
        };

        // Call importScript() for each URL pair. The importScript()
        // function handles importing the baseline URL followed by
        // the secondary URL, and it executes the appropriate callback
        // when both are complete.
        for (var u in urls) {
            var urlPair = urls[u];
            importScript(urlPair[0], urlPair[1], successWrap, errorWrap);
        }
    }

    function updateKeysWithLocals() {
        $(document).attr("title", i18n.txt.TITLE_PAGE);
        $(".loc_text_LEGAL_BTN").text(i18n.txt.HREF_LEGAL_BTN);
        $("#label_signup_captcha").text(i18n.txt.TITLE_CAPTCHA );
        // For each localization key defined, put the corresponding text
        // into the appropriate HTML elements as indicated by their classes.
        for (var k in i18n.txt) {
            var v = i18n.txt[k];
            $(".loc_text_"+k).text(v);
            $(".loc_val_"+k).val(v);
            $(".loc_placeholder_"+k).attr('placeholder', v).blur();
        }
    }

    function refreshCaptchaView(){
        var captchaURL = $("#captchaImage").attr("src");
        captchaURL = captchaURL.replace(captchaURL.substring(captchaURL.indexOf("=")+1, captchaURL.length), Math.floor(Math.random()*9999999999));
        $("#captchaImage").attr("src", captchaURL);
    }

    var Credentials = Backbone.Model.extend({

        initialize: function(){
            this.bind("change", this.attributesChanged);
        },

        attributesChanged: function(){
            var valid = false;
            if (this.get('username') && this.get('password'))
                valid = true;
            this.trigger("validated", valid);
        }
  
    });
    
    function setCookie(c_name,value,exdays)
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    }

    function getCookie(c_name)
    {
        var i,x,y,ARRcookies=document.cookie;
        var rValue = "false";
        cookiearray = ARRcookies.split("|");
        for (i=0;i<cookiearray.length;i++)
        {
            x=cookiearray[i].substr(0,cookiearray[i].indexOf("="));
            y=cookiearray[i].substr(cookiearray[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x=="sso")
            {
                gObject.authToken = y;
            }else if(x=="uid"){
                gObject.userId = y;
            }else if(x==c_name){
                rValue = "true";
            }
        }
        return rValue;
    }

    function getCookie2(c_name)
    {
        console.log( 'COOKIE:' + document.cookie );
        var i,x,y,ARRcookies=document.cookie;
        var rValue = "";
        var cookiearray =new Array;
        cookiearray = ARRcookies.split(";")
        for (i=0;i<cookiearray.length;i++)
        {
            x=cookiearray[i].substr(0,cookiearray[i].indexOf("="));
            y=cookiearray[i].substr(cookiearray[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if(x==c_name){
                rValue = y;
            }
        }
        return rValue;
    }

    function redirectWithUidAndToken() {
        var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"=";
        
        var uid = Request.parameter('uid');
        var email = Request.parameter('motoid');
        var token = gObject.tokenFromUserPrincipal;

        if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
             if (gObject.continueUrl != "null") {
                 continueUrl = continueUrl+ gObject.continueUrl;
                 if(gObject.continueUrl.indexOf('?') > -1 || gObject.continueUrl.indexOf('%3F') > -1) {
                     continueUrl = continueUrl + "%26locale%3D"+ gObject.langString;
                 } else{
                     continueUrl = continueUrl + "%3Flocale%3D"+ gObject.langString;
                 }
                 continueUrl = continueUrl + "&uid="+ escape(uid)
                        +"&sso_token="+ escape(token)
                        +"&email="+ email
                        +"&skiplink=true";
             } else {
                 continueUrl = continueUrl+ gObject.amServer + "/web/manage_account_details.html"
                    +"%3Flocale%3D"+ gObject.langString;
             }
       }
       var time = new Date().getTime() - window.performance.timing.navigationStart;
       var login_type="moto";
       var xhr1 = newXMLHttpRequest();//new XMLHttpRequest();
       var url1 = gObject.amServer + "/app/user/sendTime?login_type=" + login_type + "&email=" + email + "&time="+ time;
       xhr1.open("GET", url1, true);
       xhr1.setRequestHeader("Content-type", "application/json");
       xhr1.setRequestHeader("Accept", "application/json");
       xhr1.onreadystatechange = function() {     
         if (xhr1.readyState == 4) {
	       console.log( 'time taken is ' + time + ' ' +gObject.startTime);
         }
       }  
        xhr1.send();
        window.open(unescape(continueUrl),"_self");
    }

    function parseLocale(locale, defaultCountry) {
        var localeParts = locale.split(/[^a-zA-Z0-9]+/);
        localeParts[0] = localeParts[0].toLowerCase();
        if (localeParts.length > 1) {
            localeParts[1] = localeParts[1].toUpperCase();
        }
        else if (!isNil(defaultCountry)) {
            localeParts[1] = defaultCountry;
        }
        return localeParts;
     }

    function showPage() {
        $("#page_content_wrapper").removeClass("hidden");
        $("#footer").removeClass("hidden");
    }
    
    function validateEmail(emailAddr) {
        if (/^\w+([\.-]\w+)*@\w+([\.-]\w+)*(\.\w{2,8})+$/.test(emailAddr)) {
            return (true);
        }
        return (false);
    }

    var LoginView = Backbone.View.extend({
        el: "#signin_div",

        events: {
            "click #button_signin": "performLogin",
            "keyup #username": "setUsername",
            "keyup #password": "setPassword",
            "click #anchor_signup" : "showSiginUp",
            "click #signup_email_link" : "showSiginUp",
            "click #anchor_create_pwd" : "showResetPasswordView",
            "click #forgetpass_link" : "showForgetPasswordView",
            "click #signin_google_button" : "popupWindow",
            "click #signin_facebook_button" : "popupFacebook",
            "click #chk_img" : "setCheckBox",
            "click #captchaClick": "refreshCaptha",

            "click #button_link_google" : "link_signin_google",
            "click #button_link_skip" : "skip_google_signin",
            "click #button_link_cancel" : "cancel_google_signin",
            "click #legal_link" : "showTandC",

            "click #button_link_confirm" : "linkGoogleID",
            "click #button_link_return" : "redirectToTarget",
            "click #button_link_retry" : "redirectToLinkPage",
            "click #button_use_google_signin" : "logoutThenUseGoogleSignIn"
        },

        initialize: function(){
            var self = this;

            if (Request.parameter('locale')) {
                gObject.langString = Request.parameter('locale');
            } else {
                gObject.langString = window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage;
            }
            gObject.langString = parseLocale(gObject.langString).join("_");

            gObject.amServer = window.location.protocol + "//" + window.location.host + "/ssoauth";

            // Move this to central function. Parse a configurable string array.
            if (window.location.host.indexOf("motorola") >= 0) {
                gObject.cloudset = "motorola";
            }
            if (window.location.host.indexOf("svcmot") >= 0) {
                gObject.cloudset = "svcmot";
            }
            if (window.location.host.indexOf("sdc100") >= 0) {
                gObject.cloudset = "sdc100";
            }
            if (window.location.host.indexOf("sdc200") >= 0) {
                gObject.cloudset = "sdc200";
            }
            if (window.location.host.indexOf("sdc300") >= 0) {
                gObject.cloudset = "sdc300";
            }
            if (window.location.host.indexOf("qa200") >= 0) {
                gObject.cloudset = "qa200";
            }
            if (window.location.host.indexOf("qa300") >= 0) {
                gObject.cloudset = "qa300";
            }
            if (window.location.host.indexOf("qa300cn") >= 0) {
                gObject.cloudset = "qa300cn"
            }
            if (window.location.host.indexOf("sdc200cn") >= 0) {
                gObject.cloudset = "sdc200cn"
            }
            if (window.location.host.indexOf("barney") >= 0) {
                gObject.cloudset = "barney";
            }
            if (window.location.host.indexOf("motorola.com.cn") >= 0) {
                gObject.cloudset = "motorolacn";
            }
            
            if((Request.parameter('continue_url') !== undefined)){
                gObject.continueUrl = Request.parameter('continue_url');
            }else {
                gObject.continueUrl = '';
            }
           
            gObject.returnParam = 'TARGET';

            if((Request.parameter('TARGET') !== undefined)){
                gObject.continueUrl = Request.parameter('TARGET');
            }
            else if((Request.parameter('service') !== undefined)){
                gObject.continueUrl = Request.parameter('service');
                gObject.returnParam = 'service';
            }
            
            if (Request.parameter('appid') !== undefined) {
                gObject.appId = Request.parameter('appid');
            }
            else {
                // Move this to central function. Parse a configurable string array.
                if (gObject.continueUrl.indexOf("custhelp") >= 0) {
                    gObject.appId = "ZI2FIY5LS7R8EE1WJBZ6MUBHXUF517H7";
                }
                else if (gObject.continueUrl.indexOf("moto-web-portal") >= 0) {
                    gObject.appId = "3E5B3B3675CF11E09A0BFCC04724019B";
                }
                else if (gObject.continueUrl.indexOf("mymotocast") >= 0) {
                    gObject.appId = "AF9EA44075CF11E09DE076C14724019B";
                }
                else if (gObject.continueUrl.indexOf("testclient") >= 0) {
                    gObject.appId = "BBF2DD1475DA11E0B1C5F4CD4724019B";
                } else {
                    gObject.appId = APPID;
                }
            }
            
            gObject.pageName = Request.parameter('pg');
            if (!gObject.pageName) {
                if (Request.parameter('email_login') == '1') {
                    gObject.pageName = 'email_login';
                }
                if (Request.parameter('new') == '1') {
                    gObject.pageName = 'new';
                }
            }
            if (!gObject.pageName) {
                // linkGoogleID.jsp defines DEFAULT_PG inline.
                gObject.pageName = window.DEFAULT_PG || 'main';
            }
          //  handleLocalize_withAMP();
            var locCfgUrl1 = I18N_LOCALS_PATH + ".js";
            var locCfgUrl2 = null;
            if (gObject.langString && gObject.langString != 'en_US') {
                var suffix = gObject.langString;
                if (!i18n.list[suffix]) {
                  suffix = suffix.replace(/_.*/, '');
                }
                locCfgUrl2 = I18N_LOCALS_PATH + "_" + suffix + ".js";
            }
			
            var cldCfgUrl1 = CONFIG_PATH + ".js";
            var cldCfgUrl2 = null;
            if (gObject.cloudset) {
                cldCfgUrl2 = CONFIG_PATH + "_" + gObject.cloudset + ".js";
            }
          
            var appCfgUrl1 = APP_CONFIG_PATH + ".js";
            var appCfgUrl2 = null;
            if (gObject.appId) {
                appCfgUrl2 = APP_CONFIG_PATH + "_" + gObject.appId + ".js";
            }

            var cb = function() {
                self.finishInit();
            };

            // Import the Localization, Cloud, and App configs. finishInit()
            // will then be called regardless of whether they succeed or fail.
            // This is important because issues with redirects cause cases
            // where there is no specific config (like an app ID with no
            // custom settings file) to appear as errors. See the comment in
            // the function importScript() for more detail.

            importScriptsInParallel( [
                    [locCfgUrl1,locCfgUrl2],
                    [cldCfgUrl1,cldCfgUrl2],
                    [appCfgUrl1,appCfgUrl2]
                ], cb, cb);

        },

        refreshCaptha: function(){
           refreshCaptchaView();
         },

        getUserPrincipalToken: function() {
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/getUserPrincipal";

            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var Response = JSON.parse(xhr.responseText);
                    if (Response.status == "Success") {
                        var innerResponse = JSON.parse(Response.response);
                        gObject.tokenFromUserPrincipal = innerResponse.ssoToken;
                    }
                }
            };

            xhr.send();
        },

        finishInit: function() {
            updateKeysWithLocals();
            applyAppRules();

            if((BrowserDetect.browser === "Explorer" && BrowserDetect.version < 8)|| (BrowserDetect.browser === "Chrome" && BrowserDetect.version < 5) ||
                (BrowserDetect.browser === "Firefox" && BrowserDetect.version < 3) || (BrowserDetect.browser === "Safari" && BrowserDetect.version < 5)){
                customAlert("NO_STATE",  i18n.txt.TITLE_UNSUPPORTED_BROWSER_ERROR,  i18n.txt.MSG_UNSUPPORTED_BROWSER);
            }
           
            if (!gObject.continueUrl) {
                gObject.continueUrl = DEFAULT_CONTINUE_URL;
            }
            
            var redirecting = false;

            if(gObject.pageName == 'link') {
                if (serverCfg.skipLinkGoogle) {
                    $("#body_div").hide();
                    $("#spinner_box").removeClass('hidden');
                    $("#spinner_text").text(i18n.txt.MSG_PLEASE_WAIT);
                    redirectWithUidAndToken();
                }
                $("#link_google_page").removeClass('hidden');
                if (appCfg.linkGoogleRequired) {
                    $('.for_opt').addClass('hidden');
                }
                else {
                    $('.for_req').addClass('hidden');
                }
            }
            else if(gObject.pageName == 'link_confirm') {
                $("#link_confirm_page").removeClass('hidden');
                var gmail = unescape(Request.parameter('email'));
                var motoid = unescape(Request.parameter('motoid'));
                var appId = Request.parameter('appid');
                
                // if the gmail doesn't exist in SSO DB, then we allow the link. 
                if (Request.parameter('errorMsg') == 'reapproval') {
                    var state = window.location.href;
                    state = rmParam(state, 'errorMsg');
                    state = rmParam(state, 'param1');
                    state = rmParam(state, 'email');
                    var redirectUri = 'https://' + SSO_HOSTNAME + '/' +
                        'account-service-1.0/oauth2callback/google?app_id=' +
                        gObject.appId + '&client_type=2';

                    var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                    var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;
                    xhr.open("GET", scopeUrl, true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.setRequestHeader("Accept", "application/json");

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            var url = '';
                            if (xhr.status == 200) {
                                var Response = JSON.parse(xhr.responseText);
                                if (Response.status == "Success") {
                                    var innerResponse = JSON.parse(Response.response);

                                    if (innerResponse.error == "OK") {
                                        gObject.googleScope = innerResponse.scope;
                                        url = 'https://accounts.google.com/o/oauth2/auth?'+
                                            'response_type=code'+
                                            '&access_type=offline'+
                                            '&approval_prompt=force'+
                                            '&scope='+gObject.googleScope +
                                            '&client_id=' + innerResponse.clientID+
                                            '&redirect_uri='+encodeURIComponent(redirectUri)+
                                            '&state='+encodeURIComponent(state);
                                    }
                                }
                            }
                            if(url) {
                                launchSpinner();
                                window.open(url,"_self");
                            }
                        }
                    };
                    xhr.send();
                }

                if (Request.parameter('errorMsg') == 'ServerError') {
                    $('#linking_error_div').removeClass('hidden');
                }
                else if (Request.parameter('uid') == undefined) {
                    $('#confirm_div').removeClass('hidden');
                }
                else {
                    var muid = Request.parameter('muid');
                    var uid = Request.parameter('uid');

                    // implicit linking if the google ID is the same as moto ID. 
                    if ((gmail!=undefined) && (gmail.toLowerCase() == motoid.toLowerCase())
                            && (muid == uid)) {
                        redirectWithUidAndToken();
                    }
                    else {
                        $('#link_exists_div').removeClass('hidden');
                    }
                }
            }
            else {
                if (serverCfg.captchaEnabled) {
                    $("#captcha_div").removeClass('hidden');
                }
                $("#signin_facebook_page").addClass('hidden');
                if (Request.parameter('al') == '1') {
                    appCfg.autoLogin = true;
                }
                if (Request.parameter('show_email') == '1') {
                    appCfg.autoLogin = false;
                    appCfg.hideEmailLogin = false;
                }
                if (gObject.pageName == 'email_login') {
                    appCfg.hideEmailLogin = false;
                    appCfg.googleRequired = false;
                    $("#signin_email_page").removeClass('hidden');
                }
                else {
                    if (appCfg.autoLogin) {
                        redirecting = true;
                        this.popupWindow();
                    }
                    if (appCfg.googleRequired) {
                        $("#signin_google_page").removeClass('hidden');
                    } else {
                        $("#signin_google_page").removeClass('hidden');
		    }


                    if (appCfg.hideEmailLogin) {
                        $('#signin_email_link_sect').addClass('hidden');
                        $('.for_opt').addClass('hidden');
                    } else {
                        $("#signin_email_page").removeClass('hidden');
                        $('#signin_email_link_sect').addClass('hidden');
                    }

                    if (serverCfg.showEmailLoginOnly) {
                        $("#signin_email_page").removeClass('hidden');
                        $("#signin_google_page").addClass('hidden');
                    }

                    if (appCfg.showFacebookLogin) {
                        $("#signin_facebook_page").removeClass('hidden');
                        // facebook js utility
                        window.fbAsyncInit = function() {
                            FB.init({
                            appId      : FACEBOOK_CLIENTID,
                            xfbml      : true,
                            version    : 'v2.1'
                            });
                        };

                        (function(d, s, id){
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) {return;}
                            js = d.createElement(s); js.id = id;
                            js.src = "//connect.facebook.net/en_US/sdk.js";
                            fjs.parentNode.insertBefore(js, fjs);
                            }(document, 'script', 'facebook-jssdk'));
                    }

                    if (gObject.pageName == 'new') {
                        $('.for_signin').addClass('hidden');
                        $('.for_signup').removeClass('hidden');
                        if (appCfg.googleRequired) {
                            $('#signin_email_link_sect').addClass('hidden');
                        }
                    }
                }
            }

            this.username = $("#username");
            this.password = $("#password");
      
            this.loginButton = $("#button_signin");
            this.model.view = this;
        
            //If cookie present please re-direct the flow back to the calling app
            var ampCookie=getCookie("amp");
            if (ampCookie!=null && ampCookie!=""&& ampCookie=="true")
            {
                //Read the sso + userid and redirect back to the caller
                var redirectUrl;
                if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                   
                    if(gObject.continueUrl.search('%3F') != -1 ){
                        redirectUrl = gObject.continueUrl+"&sso_token="+escape(gObject.authToken)+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }else{
                        redirectUrl = gObject.continueUrl+"?sso_token="+escape(gObject.authToken)+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }
                
               
                    window.open(unescape(redirectUrl),"_self");
                }
            }

            if (redirecting) {
                launchSpinner();
            }
            else {
                showPage();
            }
        },
       
        showTandC: function() {
            openLegalLink();
        },

        setCheckBox : function () {
            
            if ($("#chk_img").attr("value") == "0")
            {
                $("#chk_img").attr("src", "images/checkbox_on.png");
                $("#chk_img").attr("value", "1");
            }
            else
            {
                $("#chk_img").attr("src", "images/checkbox_off.png");
                $("#chk_img").attr("value", "0");
            }
        },

        statusChangeCallback : function(response)  {
                if (response.status === 'connected') {
                    var fbToken = response.authResponse.accessToken;
                    var xhr = new XMLHttpRequest();
                    var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+gObject.continueUrl;
                    var callbackUrl = gObject.amServer + "/app/user/verifyFBToken?"
                            + "appid=" + gObject.appId
                            + '&orig_url='+enco(
                                AMP_HOSTNAME+'/web/google_signin.html'+
                                '?locale='+gObject.langString+
                                '&continue_url='+enco(continueUrl)+
                                '&svc=cas_google_signup'+
                                '&src=cas'+
                                '&appid='+gObject.appId
                                );

                    xhr.open("POST", callbackUrl, true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.setRequestHeader("Accept", "application/json");

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                $('#confirm_div').addClass('hidden');
                                $('#link_exists_div').addClass('hidden');
                                $('#linking_error_div').addClass('hidden');
                                var Response = JSON.parse(xhr.responseText);
                                if (Response.status == "Redirect") {
                                    var redirect_url = Response.response;
                                    window.open(unescape(redirect_url),"_self");
                                }
                            } else {
                            //    var Response = JSON.parse(xhr.responseText);
                            launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
                            }
                        }
                    }

                    var jsonBody = {"facebookToken": fbToken};
                    xhr.send(JSON.stringify(jsonBody));
                } 
            },

        popupFacebook: function() {
	        var self = this;
            //var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+gObject.continueUrl;
            //var url = 'https://www.facebook.com/dialog/oauth?'+
            //    '&client_id=278181305710716'+
            //    '&redirect_uri='+enco('https://idm-qa200.appspot.com/callback/facebook')+
            //    '&response_type=token&scope=email';
            // window.open(url,"_self");

	        FB.Event.subscribe('auth.statusChange', self.statusChangeCallback);
            FB.login(function(response)
                     {}, {scope: 'email, public_profile'});
        },

        
        popupWindow : function() {
            // set default appID to CAS app ID. 
            if (gObject.appId == null) {
                gObject.appId = APPID; 
            }
                
            // Google only supports OAuth2 now. 
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;
            var url = "";
            xhr.open("GET", scopeUrl, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            var innerResponse = JSON.parse(Response.response);

                            if (innerResponse.error == "OK") {
                                gObject.googleScope = innerResponse.scope;
                                var continueUrl = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+gObject.continueUrl);
                                return_to = 'https%3A%2F%2F'+SSO_HOSTNAME+'%2Faccount-service-1.0%2Foauth2callback%2Fgoogle%3Fapp_id%3D'+gObject.appId+'%26client_type%3D2'
                                var state= encodeURIComponent(AMP_HOSTNAME+'/web/google_signin.html?svc=cas_google_signup&src=cas&locale='+gObject.langString+'&appid='+gObject.appId+'&continue_url='+continueUrl);
                                url = 'https://accounts.google.com/o/oauth2/auth?'+
                                'response_type=code'+
                                '&access_type=offline'+
                                '&approval_prompt=force'+
                                '&scope='+gObject.googleScope +
                                '&client_id=' + innerResponse.clientID+
                                '&redirect_uri='+return_to+
                                '&state='+state;
                           } else {
                                customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);
                           }
                        }

                    }
                    window.open(url,"_self");
                }
                
            };

            xhr.send();
        },
        
        setUsername: function(e){
            this.model.set({
                username: this.username.val()
            });
            
            $("#username").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            $("#password").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            
        },

        setPassword: function(e){
            this.model.set({
                password: this.password.val()
            });
            
            $("#username").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            $("#password").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            
        },

        showSiginUp: function(){
            var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+(gObject.continueUrl);
            var info = "continue_url="+encodeURIComponent(continueUrl)+"&locale="+gObject.langString+"&appid="+gObject.appId+"&svc=cas_google_signup";
            var url = AMP_HOSTNAME+"/web/signup.html?"+info;
            window.open((url),"_self");
        },

        showForgetPasswordView: function() {
            $("#body_div").fadeTo("fast", 0.33);
            $("#forgot_pwd_div").removeClass('hidden');
            $("#button_reset_pwd").attr("disabled", true);
            $("#button_reset_pwd").addClass("disabled-button");
            //$("#button_reset_pwd").css("color", "#999999");
            $("#forgot_dialog_motoid").val("");
            $("#forgot_dialog_motoid").focus();
            $("#forgot_dialog_motoid").css('borderColor', '');
            $("#forgot_dialog_motoid").css('borderStyle', '');
            $("#forgot_pwd_sub_div").addClass('hidden');
        },

        showResetPasswordView: function() {
            var url;
            gObject.svc = "first_signin_reset_pwd";
            if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                var info = "continue_url="+gObject.continueUrl+"&locale="+gObject.langString+"&appid="+gObject.appId+"&login="+gObject.mailId+"&svc="+gObject.svc;
                var url = gObject.amServer+"/web/steps_to_verify.html?"+info;
                window.open(unescape(url),"_self");
            }
        },

        performLogin: function(){
        	document.cookie="org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE="+gObject.langString+";"
            var lUser= $.trim($('#username').val());
            $('#username').val($.trim($('#username').val()));
            var lPword = $('#password').val();
            
            $('#label_userId').css('color', '');
            $('#username').css('borderColor', '');
            $('#username').css('borderStyle', '');
            $('#label_password').css('color', '');
            $('#password').css('borderColor', '');
            $('#password').css('borderStyle', '');

            if(lUser.length < 1) {
                $("#label_signin_err_text1").text(i18n.txt.LABEL_ERR_LOGIN_CREDENTIALS);
                $("#signin_err_div").show();
                $('#label_userId').css('color', 'red');
                $('#username').css('borderColor', '#FF0000');
                $('#username').css('borderStyle', 'solid');
                $('#username').val('');
                $('#username').focus();
      
                return false;
            }

            if(lPword.length < 1) {
                $("#label_signin_err_text1").text(i18n.txt.LABEL_ERR_LOGIN_CREDENTIALS);
                $("#signin_err_div").show();
                $('#label_password').css('color', 'red');
                $('#password').css('borderColor', '#FF0000');
                $('#password').css('borderStyle', 'solid');
                $('#password').val('');
                $('#password').focus();

                return false;
            }
      
            return true;
        },

        // cancel google sign in and return to the application page.  
        skip_google_signin: function () {
            redirectWithUidAndToken();
        },
        
        cancel_google_signin: function () {
            this.logoutThenSignIn('show_email', true);
        },
        
        link_signin_google: function() 
        {
            var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login%3F";
            if((gObject.continueUrl != "null") && (gObject.continueUrl !== undefined)) {
                continueUrl = continueUrl + gObject.returnParam+"%3D"+encodeURIComponent(gObject.continueUrl);
            } else {
               continueUrl = continueUrl + gObject.returnParam+"%3D" + DEFAULT_CONTINUE_URL; 
            }


            if (gObject.appId == "null" || gObject.appId == undefined) {
                gObject.appId = "DPOQDFUXWO5C7YKNFV74A617EEA6SJQR";
            }

            var cas_hostname=window.location.protocol + "//" + window.location.host + "/ssoauth";
            var uid = Request.parameter('uid');
            
            var token = Request.parameter('onetimeToken');
            var email= Request.parameter('motoid');
            var info = "&continue_url="+encodeURIComponent(continueUrl)
                       +"&svc=cas_google_signup%26src=cas"
                       + "&appid="+gObject.appId +"&motoid="+email 
                       + "&onetimeToken="+token
                       + "&muid="+uid;

           var state = cas_hostname + '/web/linkGoogleID.jsp?pg=link_confirm'+ 
                     '&locale=' +gObject.langString+ info; 

           var redirect_uri = 'https%3A%2F%2F'+SSO_HOSTNAME+'%2Faccount-service-1.0%2Foauth2callback%2Fgoogle%3Fapp_id%3D'+gObject.appId+'%26client_type%3D2';

           var xhr = newXMLHttpRequest();
           var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;

           xhr.open("GET", scopeUrl, true);
           xhr.setRequestHeader("Content-type", "application/json");
           xhr.setRequestHeader("Accept", "application/json");

           var url = "https://accounts.google.com/o/oauth2/auth";
           xhr.onreadystatechange = function() {
               if (xhr.readyState == 4) {

                   if (xhr.status == 200) {
                       var Response = JSON.parse(xhr.responseText);
                       if (Response.status == "Success") {
                           var innerResponse = JSON.parse(Response.response);

                           if (innerResponse.error == "OK") {
                               gObject.googleScope = innerResponse.scope;
                               url = 'https://accounts.google.com/o/oauth2/auth?'
                                          + 'response_type=code&access_type=offline'
                                          + '&scope=' + gObject.googleScope
                                          + '&client_id=' + innerResponse.clientID 
                                          + '&redirect_uri=' + redirect_uri 
                                          + '&state=' + encodeURIComponent(state);
                           }
                       } else {
                            customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);
                       }
                   }
                   window.open(url,"_self");
               }
           };

           xhr.send();

        },

        redirectToTarget: function() {
            var redirectUrl;
            var uid = Request.parameter('muid');
            var token = gObject.tokenFromUserPrincipal;
            var email= Request.parameter('motoid');
            
            var redirectUrl = gObject.continueUrl
                +"&uid="+escape(uid)+"&locale="+gObject.langString
                +"&email="+escape(email)+"&skiplink=true";
            
            window.open(unescape(redirectUrl),"_self");
        },

        redirectToLinkPage: function() {
            var uid = Request.parameter('muid');
            var token = gObject.tokenFromUserPrincipal;
            var email= Request.parameter('motoid');
            
            var redirectUrl = window.location.protocol + "//"
                + window.location.host
                + "/ssoauth/web/linkGoogleID.jsp?pg=link"
                + "&uid=" + uid
                + "&locale=" + gObject.langString
                + "&motoid=" + email
                + "&appid=" + gObject.appId;
            
            var targetURL = gObject.continueUrl;
            if (targetURL) {
                targetURL = deco(targetURL);
                // If there is a TARGET param within the continue URL,
                // then use that instead of the full URL.
                var re = /(TARGET|service)=([^&]*)/;
                var match = re.exec(targetURL);
                if (match != null) {
                    var returnParam = match[1];
                    targetURL = deco(match[2]);
                    /*
                    var urlParts = targetURL.split(/(TARGET|service)=/, 2);
                    if (urlParts.length > 1) {
                            // Get the TARGET param value. (Stop at the next
                            // param as indicated by "&" delimiter.)
                            targetURL = deco(urlParts[1].split("&")[0]);
                    }
                    */
                    redirectUrl += "&"+returnParam+"=" + enco(targetURL);
                } else {
                    redirectUrl += "&TARGET="+ enco(targetURL);
                }
            }

            window.open(redirectUrl,"_self");
        },

        logoutThenUseGoogleSignIn: function() {
            this.logoutThenSignIn('al');
        },

        logoutThenSignIn: function(loginOption, wrapTargetUrl) {
            var ssoauthUrl = window.location.protocol + "//" + window.location.host + "/ssoauth";
            var continueUrl = ssoauthUrl + "/login?pg=main";
        
            if((gObject.continueUrl != "null") && (gObject.continueUrl !== undefined)) {
                if(wrapTargetUrl) {
                    continueUrl += "&"+gObject.returnParam+"=" + gObject.continueUrl;
                }
                else {
                    continueUrl = decodeURIComponent(gObject.continueUrl);
                }
            }

            if((gObject.appId != null) && (gObject.appId !== undefined)) {
                continueUrl = continueUrl + "&appid=" + gObject.appId;
            }

            if ((gObject.langString != null) && (gObject.langString != undefined)) {
                continueUrl = continueUrl + "&locale=" + gObject.langString;
            }

            continueUrl = continueUrl + "&" + loginOption + "=1";

            var xhr = new XMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/signout";
   
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {
   
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            window.location = ssoauthUrl + "/logout?service=" + encodeURIComponent(continueUrl);
                        } else {
                            customAlert("NO_STATE", i18n.txt.TITLE_ERROR, i18n.txt.MSG_SERVICE_ERROR);
                        }
                    } else {
                        customAlert("NO_STATE", i18n.txt.TITLE_ERROR, i18n.txt.MSG_SERVICE_ERROR);
                    }
                }
            };
   
            xhr.send();
        },

        linkGoogleID: function() {
           var 	continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?";

           if((gObject.continueUrl != "null") && (gObject.continueUrl !== undefined)) {
              continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+gObject.continueUrl;
           }
        	var info = "%26continue_url="+(continueUrl)+"%26svc=cas_google_signup%26src=cas";
            var uid = Request.parameter('muid');
            var token = Request.parameter('onetimeToken');
            var googleID = unescape(Request.parameter('email'));

            var xhr = new XMLHttpRequest();

            var linkUrl = gObject.amServer + "/app/user/linkGoogleID?userid=" + uid 
                + "&appid=" + gObject.appId + "&authtoken=" + enco(token);
            xhr.open("POST", linkUrl, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        $('#confirm_div').addClass('hidden');
                        $('#link_exists_div').addClass('hidden');
                        $('#linking_error_div').addClass('hidden');
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            var innerResponse = JSON.parse(Response.response);

                            if (innerResponse.error == "UM_LINK_SUCCESS" || 
                                innerResponse.error == "UM_MOTOID_ALREADY_LINKED_TO_THIS_GOOGLEID") {
                                var email= Request.parameter('motoid');
                                var redirectUrl = gObject.continueUrl
                                     +"&uid="+escape(uid)+"&locale="+gObject.langString
                                     +"&email="+escape(email)+"&skiplink=true";

                                 window.open(unescape(redirectUrl),"_self");
                            } else if (innerResponse.error == "UM_LINK_GOOGLEID_IN_USE") { 
                                $('#link_exists_div').removeClass('hidden');
                            } else {
                                $('#linking_error_div').removeClass('hidden');
                            }
                        }
                    } else {
                        $('#linking_error_div').removeClass('hidden');
                    }
                }
            }
            var jsonBody = {"googleID": googleID};
            xhr.send(JSON.stringify(jsonBody));
        }

    });

    var AlertBoxView = Backbone.View.extend({
        el: "#alert_dialog_box",

        events: {
            "click #alert_ok": "exitAlert",
            "click #img_close": "exitAlert"
        },

        initialize: function(){
        },

        exitAlert: function () {
      
            $("#alert_dialog_box").addClass('hidden');
            $("#body_div").fadeTo("fast", 1.0);
            $("#alert_title").text("");
            $("#alert_text").html("");

            alrt_state = "NO_STATE";

        }
    });

    var ForgotPasswordView = Backbone.View.extend({
        el: "#forgot_pwd_div",

        events: {
            "click #button_reset_pwd": "doResetPassword",
            "click #button_cancel_reset": "exitForgotDiv",
            "click #img_close": "exitForgotDiv",
            "click #label_forgot_dialog_text4_part2" : "showSiginUp",
            "mouseup #forgot_dialog_motoid" : "onMouseUp",
            "blur #forgot_dialog_motoid":"stopTimer",
            "keyup #forgot_dialog_motoid": "validateForgetTextBox"
        },

        initialize: function(){
            $("#forgot_pwd_div").keydown(function(event){
     
                if((event.keyCode === 13) && (!$('#button_cancel_reset').is( ":focus" )) && ($('#button_reset_pwd').attr('disabled') !== "disabled")) {
                    $("#button_reset_pwd").trigger('click');
                    return false;
                }
            });
        },

        onMouseUp: function () {
      
            if (textFieldTimer === null)
            {
                textFieldTimer = setInterval(this.check_text_field, 500);
            }
        },

        stopTimer: function () {
            clearInterval(textFieldTimer);
            textFieldTimer = null;
        },
    
        check_text_field: function () {

            if ($.trim($("#forgot_dialog_motoid").val()) !== "")
            {
                clearInterval(textFieldTimer);
                textFieldTimer = null;
    
                $("#forgot_dialog_motoid").trigger("keyup");
            }
        },

        exitForgotDiv: function () {
            clearInterval(textFieldTimer);
            textFieldTimer = null;
            $("#forgot_pwd_div").addClass('hidden');
            $("#body_div").fadeTo("fast", 1.0);
        },
        
        showSiginUp: function(){
            clearInterval(textFieldTimer);
            textFieldTimer = null;
            $("#forgot_pwd_div").addClass('hidden');
            $("#body_div").fadeTo("fast", 1.0);
            var continueUrl = window.location.protocol + "//" + window.location.host + "/ssoauth/login?"+gObject.returnParam+"="+(gObject.continueUrl);
            var info = "continue_url="+encodeURIComponent(continueUrl)+"&locale="+gObject.langString+"&appid="+gObject.appId+"&svc=signup";
            var url = AMP_HOSTNAME+"/web/signup.html?"+info;
            window.open((url),"_self");

        },

        validateForgetTextBox : function(){
            clearInterval(textFieldTimer);
            textFieldTimer = null;
               
            $("#forgot_dialog_motoid").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
           
            if(($("#forgot_dialog_motoid").val().length > 0) && validateEmail($("#forgot_dialog_motoid").val()) ){
                $("#button_reset_pwd").attr("disabled", false);
                $("#button_reset_pwd").removeClass("disabled-button");
            // $('#button_reset_pwd').focus();
            //.css("color", "#FFFFFF");
            }else{
                $("#button_reset_pwd").attr("disabled", true);
                $("#button_reset_pwd").addClass("disabled-button");
            //.css("color", "#999999");
            }
        },
        
        doResetPassword: function () {
            gObject.mailId = $("#forgot_dialog_motoid").val();
            launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
            
            $('#forgot_dialog_motoid').css('borderColor', '');
            $('#forgot_dialog_motoid').css('borderStyle', '');
            $("#forgot_pwd_sub_div").addClass('hidden');

            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/forgetpassword";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    exitSpinner();
                    if (xhr.status == 200) {
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            var innerResponse = JSON.parse(Response.response);
                            if ((innerResponse.error === "OK")) {
                                $("#forgot_pwd_div").addClass('hidden');
                                $("#forgot_pwd_sub_div").addClass('hidden');
                                customAlert("NO_STATE", i18n.txt.TITLE_FORGOT_DIALOG_OK, i18n.txt.LABEL_FORGOT_DIALOG_OK );
                            }else if((innerResponse.error === "UM_ACCOUNT_UNVERIFIED")){
                                $("#forgot_pwd_div").addClass('hidden');
                                $("#forgot_pwd_sub_div").addClass('hidden');

                                window.forgotPasswordView.showVerificationRequiredView();
                            }
                            else if((innerResponse.error == "UM_FORBIDDEN")){
                                $("#forgot_pwd_div").addClass('hidden');
                                $("#forgot_pwd_sub_div").addClass('hidden');
                                customAlert("NO_STATE", i18n.txt.HREF_FORGETPASS, i18n.txt.MSG_UNSUCCESSFUL_ATTEMPT);
                            }else{
                                //customAlert("NO_STATE",  'TITLE_LOGIN_ERROR'),  'MSG_LOGIN_ERROR_INVALID_CREDENTIALS'));
                                $("#forgot_pwd_sub_div").removeClass('hidden');
                                $('#forgot_dialog_motoid').css('borderColor', '#FF0000');
                                $('#forgot_dialog_motoid').css('borderStyle', 'solid');
                                $('#forgot_dialog_motoid').val('');
                                $('#forgot_dialog_motoid').focus();
                                $("#button_reset_pwd").attr("disabled", true);
                                $("#button_reset_pwd").addClass("disabled-button");
                            //.css("color", "#999999");

                            }
                        } else {
                            customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);
                        }
                    } else {
                        customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);
                    }
                }
            };

            var userInfo = {
                "appid" : gObject.appId,
                "login" : gObject.mailId,
                "locale": gObject.langString
            };
            xhr.send(JSON.stringify(userInfo));
        },

        showVerificationRequiredView: function() {
            $("#verification_required_div").removeClass('hidden');
        }

    });
    
    
    var VerificationRequiredView = Backbone.View.extend({
        el: "#verification_required_div",

        events: {
            "click #button_vr_ok": "exitDialogBox",
            "click #img_close": "exitDialogBox",
            "click #anchor_vr_link": "showResetVerifyAccountInfoWindow"
        },

        initialize: function() {
        },

        showResetVerifyAccountInfoWindow: function() {
            var authInfo = "appid="+gObject.appId +"&login="+gObject.mailId+"&locale="+gObject.langString;
            var url = gObject.amServer+"/web/steps_to_verify.html?"+authInfo;
            window.open(url);

            $("#verification_required_div").addClass('hidden');
            $("#body_div").fadeTo("fast", 1.0);
        },

        exitDialogBox: function () {
            $("#verification_required_div").addClass('hidden');
            $("#body_div").fadeTo("fast", 1.0);
        }
    });
    
   
    $(window).load(function () {
        $("#signin_email_link").click(function() {
            // Rather than just showing the email sign-in fields, add
            // email_login=1 to the URL. This will reload the page
            // with the email sign-in fields shown by default. This is
            // important for two reasons... it allows use of the back
            // button, and if CAS returns as error, the user will be
            // retunred to the email sign-in page where they can see
            // the sign-in error (which is part of the email sign-in
            // form and thus hidden on the normal sign-in page).
            // Ideally we would achieve this without reloading the
            // page, but for now, this should provide a simple and
            // reliable solution.
            var url = window.location.href;
            url = replaceParam(url, 'pg', 'email_login');
            window.location.assign(url);
        });

        window.loginView = new LoginView({
            model: new Credentials()
        });
        window.alertBox = new AlertBoxView();
        window.forgotPasswordView = new ForgotPasswordView();
        window.verificationReqView = new VerificationRequiredView();

        // The main View will show the page when it is ready, but as a
        // failsafe, show it after a few seconds regardless.
        setTimeout(showPage, 5000);
    });
});
