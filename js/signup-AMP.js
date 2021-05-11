i18n = {};
i18n.txt = {};

$(function(){
    
	var I18N_LOCALS_PATH = "/ssoauth/web/i18n/Localizer_";
	var I18N_LOCALS_DEFAULT = "/ssoauth/web/i18n/Localizer.js";
    var CONFIG_DEFAULT = "conf/AMP/config.js";
    var CONFIG_PATH = "conf/AMP/config_";
    var textFieldTimer = null;

    if (typeof Object.create === 'undefined') {
        Object.create = function (o) { 
            function F() {} 
            F.prototype = o; 
            return new F(); 
        };
    }
    
    var gObject = window.gObject = Object.create(Object.prototype, {
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
        "ampSessionToken" : {
            value : null,
            writable : true
        }
    });
    var alrt_state = "NO_STATE";
    
    
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
    

    function customAlert(state, title, message) {
        $("#alert_title").text(title);
        $("#alert_text").html(message);

        if(state == undefined) {
            return;
        }
		
        alrt_state = state;
        $("#body_div").fadeTo("fast", 0.33);
        $("#alert_dialog_box").show();
    }

    function launchSpinner(statusMsg) {
        $("#body_div").fadeTo("fast", 0.33);
        $("#spinner_box").show();
        $("#spinner_text").text(statusMsg);
    }
    
    function updateSpinner(statusMsg) {
        //        $("#body_div").fadeTo("fast", 0.33);
        $("#spinner_box").show();
        $("#spinner_text").text(statusMsg);
    }
    
    function exitSpinner() {
        $("#spinner_text").text("");
        $("#spinner_box").hide();
    }

    function validateEmail(emailAddr) {
        if (/^\w+([\.-]\w+)*@\w+([\.-]\w+)*(\.\w{2,8})+$/.test(emailAddr)) {
            return (false);
        }
        return (true);
    }
    
    var Request = {
        parameter : function(name) {
            return this.parameters()[name];
        },

        parameters : function() {
            var result = {};
            var url = window.location.href;
            var parameters = url.slice(url.indexOf('?') + 1).split('&');

            for ( var i = 0; i < parameters.length; i++) {
                var parameter = parameters[i].split('=');
                result[parameter[0]] = parameter[1];
            }
            return result;
        }
    };
    
    function handleLocalize(){
        if(gObject.langString != undefined && gObject.langString != null && gObject.langString.toLowerCase() != "en_us"){
            var suffix = gObject.langString;
            if (!i18n.list[suffix]) {
                suffix = suffix.replace(/_.*/,'');
              
            }
            var localizationString = I18N_LOCALS_DEFAULT;
            if(i18n.list[suffix]){
                localizationString = I18N_LOCALS_PATH + suffix + ".js";
            }
        
            $.ajax({
                dataType: 'script',
                type: "GET",
                cache: false,
                url: localizationString,
                success: function(response, textStatus) {
                        updateKeysWithLocals();
                },
                error: function(request, textStatus) {
                    console.log( 'Unable to import ' + localizationString +
                        '. (' + textStatus + ')' );
                    error(request, textStatus);
                }
            });
        }
        else {
            $.ajax({
                dataType: 'script',
                type: "GET",
                cache: false,
                url: I18N_LOCALS_DEFAULT,
                success: function(response, textStatus) {
                        updateKeysWithLocals();
                },
                error: function(request, textStatus) {
                    console.log( 'Unable to import ' + I18N_LOCALS_DEFAULT +
                        '. (' + textStatus + ')' );
                    error(request, textStatus);
                }
            });
        }
    }
    
    
    function handleConfigs(){
        var configString = null;
        
        if(gObject.cloudset != undefined && gObject.cloudset != null){
            configString = CONFIG_PATH + gObject.cloudset +".js";
        }else{
            configString = CONFIG_DEFAULT;
        }
    	
         
        
        $.ajax({ 
            async: false,
            type: "POST",
            cache: false,
            url: configString,  
            success: function(response){ 
            //updateKeysWithLocals();
            //  console.log("success") 
            },  
            error: function(e){  
            //console.log("Failed")                       
            }
        });  
    }
        
    function updateKeysWithLocals(){
        $(".loc_text_MAIN_TITLE").text(i18n.txt.LABEL_MAIN_TITLE);
        $(".loc_text_LEGAL_BTN").text(i18n.txt.HREF_LEGAL_BTN);
        $(".loc_text_LABEL_ORGANIZATION_COPYRIGHT").text(i18n.txt.LABEL_ORGANIZATION_COPYRIGHT );
        $(document).attr("title", i18n.txt.TITLE_PAGE);
        $("#label_userId").text(i18n.txt.LABEL_USERID );
        $("#label_signin").text(i18n.txt.BUTTON_SIGNIN);
        $("#label_password").text(i18n.txt.LABEL_PASSWORD);
        $("#anchor_forgetpass").text(i18n.txt.HREF_FORGETPASS);
        $("#label_keepmesignedin").text(i18n.txt.LABEL_KEEP_ME_SIGNEDIN);
        $("#button_signin").val(i18n.txt.BUTTON_SIGNIN);
        $("#label_signin_google").text(i18n.txt.LABEL_SIGNIN_GOOGLE);
        $("#label_signup").text(i18n.txt.LABEL_SIGNUP);
        $("#label_signup_account").text(i18n.txt.LABEL_SIGNUP);
        $("#label_signin_with").text(i18n.txt.LABEL_SIGNIN_WITH);        
        $("#anchor_signup").text(i18n.txt.HREF_SIGNUP);
        $("#anchor_signup_account").text(i18n.txt.HREF_SIGNUP);
        $("#anchor_signin").text(i18n.txt.HREF_SIGNIN);        
        $("#button_signin_google").val(i18n.txt.BUTTON_GOOGLE);
        $("#label_motocastad").text(i18n.txt.LABEL_MOTOCAST_DESC);
        $("#label_selfcaread").text(i18n.txt.LABEL_MOTOBLUR_DESC);
        $("#motocast_label_header").text(i18n.txt.LABEL_MOTOCAST_HEAD); 
        $("#selfcare_label_header").text(i18n.txt.LABEL_SELFCARE_HEAD);
        $("#button_reset_pwd").val(i18n.txt.BUTTON_RESET_PASSWORD);
        $("#button_cancel_reset").val(i18n.txt.BUTTON_CANCEL);
        
        $("#label_forgot_dialog_title").text(i18n.txt.TITLE_FORGOT_DIALOG);
        $("#label_forgot_dialog_text1").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT1);
        $("#label_forgot_dialog_text2").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT2);
        $("#label_forgot_dialog_text3").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT3);
        $("#label_forgot_dialog_email").text(i18n.txt.LABEL_USERID);

        $("#label_forgot_dialog_text4_part1").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT4_PART1);
        $("#label_forgot_dialog_text4_part2").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT4_PART2);
        $("#label_forgot_dialog_text4_part3").text(i18n.txt.LABEL_FORGOT_DIALOG_TEXT4_PART3);

        $("#verify_text3").text(i18n.txt.LABEL_VERIFICATION_4_DIGIT_CODE);
        $("#anchor_choose_mail").text(i18n.txt.HREF_CHANGE_EMAIL_ADDR);
        $("#verify_text2").text(i18n.txt.LABEL_VERIFICATION_EMAIL_SENT);
        $("#verify_text4").text(i18n.txt.LABEL_HAVENT_RECEIVED_VERIFY_EMAIL);
        $("#h2_verify_email").text(i18n.txt.LABEL_VERIFY_EMAIL_HEADER);
        $("#anchor_resend_verification_code").text(i18n.txt.HREF_RESEND_VERIFICATION_CODE);
        $("#b_signin").val(i18n.txt.BUTTON_SIGNIN);

        $("#username").attr("placeholder",  i18n.txt.LABEL_USERID_EMAIL).blur();
        $("#password").attr("placeholder",  i18n.txt.LABEL_PASSWORD).blur();
        $("#forgot_dialog_motoid").attr("placeholder",  i18n.txt.LABEL_USERID_EMAIL).blur();
        $("#cea_email_address").attr("placeholder",  i18n.txt.PLACEHOLDER_ENTER_USER_DOMAIN).blur();

        $("#lable_signup_name").text(i18n.txt.LABEL_NAME);
        $("#lable_signup_email").text(i18n.txt.LABEL_EMAIL_ADDRESS);      
        $("#lable_signup_pwd").text(i18n.txt.LABEL_PASSWORD);
        $("#lable_signup_cfpwd").text(i18n.txt.LABEL_CONFIRM_PASSWORD );
        $("#label_signup_tandc_text1").text(i18n.txt.LABEL_SIGNUP_TANDC1); 
        $("#label_signup_google_tandc_text1").text(i18n.txt.LABEL_SIGNUP_TANDC1 );
        $("#anchor_signup_tandc_link").text(i18n.txt.LABEL_SIGNUP_TANDC2);
        $("#anchor_signup_google_tandc_link").text(i18n.txt.LABEL_SIGNUP_GOOGLE_TANDC2);
        $("#label_signup_tandc_text1_1").text(i18n.txt.LABEL_SIGNUP_TANDC3);

        $("#label_signup_google_mid_text1").text(i18n.txt.LABEL_SIGNUP_GOOGLE_MID1);
        $("#label_signup_google_mid_text2").text(i18n.txt.LABEL_SIGNUP_GOOGLE_MID2);
        $("#label_signup_captcha").text(i18n.txt.TITLE_CAPTCHA );
        
        $("#alert_ok").val(i18n.txt.BUTTON_OK);

        $("#label_cea_header").text(i18n.txt.LABEL_CEA_HEADER);
        $("#label_cea_text1").text(i18n.txt.LABEL_CEA_TEXT1);
        $("#label_cea_text2").text(i18n.txt.LABEL_CEA_TEXT2);
        $("#button_cea_save").val(i18n.txt.BUTTON_SAVE);
        $("#button_cea_cancel").val(i18n.txt.BUTTON_CANCEL);

        $("#label_vr_title").text(i18n.txt.TITLE_FORGOT_DIALOG_VERIFICATION_REQUIRED);
        $("#label_vr_text1").text(i18n.txt.LABEL_FORGOT_DIALOG_VERIFICATION_REQUIRED1);
        $("#label_vr_text1_1").text(i18n.txt.LABEL_FORGOT_DIALOG_VERIFICATION_REQUIRED1_1);
        $("#anchor_vr_link").text(i18n.txt.HREF_CLICK_HERE);
        $("#button_vr_ok").val(i18n.txt.BUTTON_OK);
        // $("#signup_name").attr("placeholder",  LABEL_NAME).blur();
        // $("#signup_email").attr("placeholder",  LABEL_EMAIL_ADDRESS).blur();
        // $("#signup_pwd").attr("placeholder",  LABEL_PASSWORD).blur();
        // $("#signup_cfpwd").attr("placeholder",  LABEL_CONFIRM_PASSWORD).blur();
        $("#lable_welcome_msg").text(i18n.txt.LABEL_WELCOME);
        $("#nac_msg1").text(i18n.txt.LABEL_MOTOCASTID_CREATED); 
        $("#nac_msg2").text(i18n.txt.LABEL_CREATED_ACCOUNT_MSG); 
        $("#_bContinue").val(i18n.txt.BUTTON_CONTINUE);
        $("#signin_email").attr("placeholder",  i18n.txt.LABEL_EMAIL_ADDRESS).blur();
        $("#signin_pwd").attr("placeholder",  i18n.txt.LABEL_PASSWORD).blur();
        
        $("#create_with_google").text(i18n.txt.LABEL_SIGNUP_CREATE_ID_WITH); 
        $("#signup_with_google").text(i18n.txt.LABEL_SIGNUP_CREATE_ID_WITH); 
        $("#lbl_create_id").text(i18n.txt.LABEL_SIGNUP_CREATE_ID); 

        $("#label_signin_fillin").text(i18n.txt.LABEL_SIGNIN_FILL_IN); 
        $("#label_signin_google_fillin").text(i18n.txt.LABEL_SIGNIN_GOOGLE_FILL_IN);        
        
        $("#label_signup_err_text").text(i18n.txt.LABEL_ERR_EMAIL_AREADY_EXISTS); 
        $("#lable_err_uname").text(i18n.txt.LABEL_ERR_INVALID_UNAME);
        $("#lable_err_email").text(i18n.txt.LABEL_CEA_TEXT2); 
        $("#lable_err_npwd").text(i18n.txt.LABEL_ERR_PWD_VALIDATION_TEXT); 
        $("#lable_err_cfpwd").text(i18n.txt.LABEL_ERR_PWD_CONFIRMATION_TEXT);
        $("#button_signup_google").val(i18n.txt.BUTTON_GOOGLE);
        $("#button_signup_google_screen").val(i18n.txt.BUTTON_GOOGLE);
        $("#_bcreateacc").val(i18n.txt.BUTTON_CREATE);
        $("#_bcancel").val(i18n.txt.BUTTON_CANCEL);
        $("#google_signup_cancel").val(i18n.txt.BUTTON_CANCEL);
        $("#lable_signup_header").text(i18n.txt.LABEL_CREATE_NEW_MOTOCASTID);
        $("#lable_signup_google_header").text(i18n.txt.LABEL_CREATE_NEW_MOTOCASTID);

        $("#label_signin_header").text(i18n.txt.LABEL_SIGN_IN_WITH_EMAIL);        
        
        $("#footer_lbl_organization_copyright").text(i18n.txt.LABEL_ORGANIZATION_COPYRIGHT); 
        $("#footer_href_tos").text(i18n.txt.LABEL_TOS); 
        $("#footer_href_privacy_policy").text(i18n.txt.LABEL_PRIVACY_POLICY);   

        $("#footer_lbl_abt_your_privacy").text(i18n.txt.ABOUT_YOUR_PRIVACY);
        $("#footer_lbl_abt_your_privacy1").text(i18n.txt.ABOUT_YOUR_PRIVACY1);  
        $("#footer_href_ayp").text(i18n.txt.HREF_YOUR_PRIVACY_STMT);
        $("#footer_lbl_abt_your_privacy2").text(i18n.txt.ABOUT_YOUR_PRIVACY2);
        
        $("#user_consent_text").text(i18n.txt.USER_CONSENT_TEXT);
        $("#user_consent_link").text(i18n.txt.HREF_USER_CONSENT_STMT);        
        $("#user_consent_button_agree").val(i18n.txt.USER_CONSENT_BUTTON_AGREE);
        $("#user_consent_button_cancel").val(i18n.txt.USER_CONSENT_BUTTON_CANCEL);
        
        $("#mob_scroll_right").text(i18n.txt.LABEL_MOB_SCROLL_RIGHT_TXT);
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
            }else if(x=="amp_session_token" && x == c_name){
                gObject.ampSessionToken = y;
                rValue = "true";
                break;
            }else if(x==c_name){
                rValue = "true";
            }
        }
        return rValue;
    }
    
    function redirectVerifyCompleted() {
		
        var redirectUrl;
        if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
            if(gObject.continueUrl.search('%3F') != -1 ){
                redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
            }else{
                redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
            }
            window.open(unescape(redirectUrl),"_self");
        }
    }
    
    function align_screen_footer (div_height)
    {
        var windowHeight = window.innerHeight;
		
        if (windowHeight == undefined)
        {
            // for IE8 and below
            windowHeight = document.documentElement.clientHeight;
        }

        var footerHeight = $("#footer").height();
        var headerHeight = $("#topdiv").height();
        var bodyHeight = div_height;
        var margin = 0;

        /* consider body height as starts from top of page */
        //		bodyHeight = bodyHeight + headerHeight;
        /*
		if (windowHeight >= bodyHeight)
		{
			diff = windowHeight - bodyHeight;
			if (diff >= 50)
			{
				margin = (windowHeight - bodyHeight) - (footerHeight);
			}
			else 
			{
				margin = 50;
			}
		} else {
			margin = 50;
		}

		if (margin < 50)
		{
			margin = 50;
		}
		else if (margin >= 50 && ((windowHeight - footerHeight) - bodyHeight) > 50)
		{
			margin = windowHeight - (footerHeight + bodyHeight);
		}
		$("#page_content_div").css("padding-bottom", margin + "px"); 
*/
        if (bodyHeight > 650) {
            $("#page_content_div").css("padding-bottom", "70px"); 			
        }
    }

    function resize_divider (ref_div) {
        if ($(ref_div).attr("id") === "verify_inner_div") {
            $("#devider_div").css("margin-top", "100px");
        }
        else if ($(ref_div).attr("id") === "signup_div") {
            $("#devider_div").css("margin-top", "70px");
        }
        else if ($(ref_div).attr("id") === "new_acc_confirmation_div") {
            $("#devider_div").css("margin-top", "130px");
        }

        $("#vd_center").height($(ref_div).height());
        $("#devider_div").css("display", "inline");
    }

    var LoginView = Backbone.View.extend({
        el: "#signin_body_div",

        events: {
            "click #anchor_signup" : "showGoogleSignUp",
            "click #anchor_signin" : "showSiginIn",            
            "click #anchor_create_pwd" : "showResetPasswordView",
            "click #anchor_forgetpass" : "showForgetPasswordView",
            "click #button_signin_google" : "popupWindow",
            "click #chk_img" : "setCheckBox"
        },

        initialize: function(){
        
            if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                $("#old_browser_img_div").show();
                $("#old_browser_img_div").css("display", "block");
            }
            else {
                $("#new_browser_img_div").show();
                $("#new_browser_img_div").css("display", "block");
            }
        
            gObject.svc = Request.parameter('svc');
            // gObject.continueUrl = Request.parameter('continue_url');
            
            // This logic is repeated across almost every javascript file
            // in AMP. It should really be common, but since AMP is being
            // retired, it's not worth restructuring.
            if((Request.parameter('locale') !== undefined) && (Request.parameter('locale') != null) && (Request.parameter('locale') !== "null")){
                gObject.langString = Request.parameter('locale');
            }else {
                var language = window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage;
                language = language.replace(/-/g, "_");
                language = language.split("_");
                function cnvrt() {
                    return arguments[0].toUpperCase();
                }
                if(language.length > 1) {
                    language[1] = language[1].replace(/[a-z]/g, cnvrt);
                }
                language = language.join("_");

                gObject.langString = language;
            }
            
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
                gObject.cloudset = "qa300cn";
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

            handleLocalize();
            handleConfigs();

            if((BrowserDetect.browser === "Explorer" && BrowserDetect.version < 8)|| (BrowserDetect.browser === "Chrome" && BrowserDetect.version < 5) || 
                (BrowserDetect.browser === "Firefox" && BrowserDetect.version < 3) || (BrowserDetect.browser === "Safari" && BrowserDetect.version < 5)){
                customAlert("NO_STATE",  i18n.txt.TITLE_UNSUPPORTED_BROWSER_ERROR,  i18n.txt.MSG_UNSUPPORTED_BROWSER);
            }

            if((Request.parameter('continue_url') !== undefined)){
                gObject.continueUrl = Request.parameter('continue_url');
            }else {
                gObject.continueUrl = DEFAULT_CONTINUE_URL;
            }
            
            if(gObject.cloudset !== "unknown"){
                $("#div_create_id").attr("class", "visible");
            }

            //			this.adjust_ORbreak_line ();

            if((Request.parameter('appid') !== undefined)){
                gObject.appId = Request.parameter('appid');
            }else {
                gObject.appId = APPID;
            // customAlert("INVALID_REQUEST",  TITLE_ERROR,  MSG_INVALID_PARAMS);
            }
            
            if(gObject.appId === MOTOCAST_APPID) {
                // remove the sign up button based on the request. 
                $("#label_signup").remove();
                $("#anchor_signup").remove();
                $("#signin_motocast_img").attr("src", "images/motocast-logo.png"); 
                $("#signin_motocast_img").css("display", "block"); 
                $("#label_motocastad").text(i18n.txt.LABEL_MOTOCAST_DESC); 
            	
                if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                    document.getElementById("old_browser_img_div").runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=images/motocast-art.png, enabled=true, sizingMethod=scale)";
                    $("#old_browser_img_div").show();
                    $("#old_browser_img_div").css("display", "block");
                }
                else
                {
                    $("#td_motocast_img").attr("src", "images/motocast-art.png"); 
                    //       			$("#td_motocast_img").css("margin-left", "0"); 
                    $("#new_browser_img_div").show();
                    $("#new_browser_img_div").css("display", "block");
                }
            } else if( gObject.appId === BOP_APPID) {
                $("#signin_motocast_img").attr("src", "images/Motoroladevice-logo.png"); 
                $("#signin_motocast_img").css("display", "block"); 
                $("#label_motocastad").text(i18n.txt.LABEL_MOTODEVICE_DESC); 
        		
                $("#btm_left_motocast_div").css("margin-top", "100px");	// device mgr has diff margins for artwork img and description
                $("#motocast_img_container").css("margin-top", "60px");
        		
                if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                    document.getElementById("old_browser_img_div").runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=images/Motoroladevice-art.png, enabled=true, sizingMethod=scale)";
                    $("#old_browser_img_div").show();
                    $("#old_browser_img_div").css("display", "block");
                }
                else
                {
                    $("#old_browser_img_div").hide();
                    $("#td_motocast_img").attr("src", "images/Motoroladevice-art.png"); 
                    $("#td_motocast_img").css("margin-left", "0"); 
                    $("#new_browser_img_div").show();
                    $("#new_browser_img_div").css("display", "block");
                }
				
            } else if (gObject.appId === MOTOCARE_APPID) {	// my motocare
                $("#signin_motocast_img").attr("src", "images/AMP-motocare-logo.png"); 
                $("#signin_motocast_img").css("display", "block"); 
                $("#label_motocastad").text(i18n.txt.LABEL_MOTOCARE_DESC); 
        		
                $("#btm_left_motocast_div").css("margin-top", "100px");
        		
                if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                    document.getElementById("old_browser_img_div").runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=images/AMP-motocare-art.png, enabled=true, sizingMethod=scale)";
                    $("#old_browser_img_div").show();
                    $("#old_browser_img_div").css("display", "block");
                }
                else
                {
                    $("#td_motocast_img").attr("src", "images/AMP-motocare-art.png"); 
                    $("#td_motocast_img").css("margin-left", "0"); 
                    $("#new_browser_img_div").show();
                    $("#new_browser_img_div").css("display", "block");
                }	
            } else if(gObject.appId === OTA_APPID) {

               // $("#label_signin").text(BUTTON_NEWSIGNIN);
                $("#label_OR").remove();
                $("#label_signup").remove();
                $("#anchor_signup").remove();
                
                $("#label_motocast_id_title").text(i18n.txt.LABEL_MOTOSSOTA_ID_TITLE);
                $("#label_motocast_id_title").css("display", "block");
                
                $("#label_motocastad").text(i18n.txt.LABEL_MOTOSSOTA_ID_DESC); 
                
                $("#username").attr("placeholder",  i18n.txt.LABEL_SSOTA_USERID_EMAIL).blur();
                
               // $("#label_motocastad").remove();
                $("#btm_left_motocast_div").css("margin-top", "100px");

                if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                    document.getElementById("old_browser_img_div").runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=images/Motoroladevice-art.png, enabled=true, sizingMethod=scale)";
                    $("#old_browser_img_div").show();
                    $("#old_browser_img_div").css("display", "block");
                }
                else
                {
                    $("#td_motocast_img").attr("src", "images/Motoroladevice-art.png");
                    $("#td_motocast_img").css("margin-left", "0"); 
                    $("#new_browser_img_div").show();
                    $("#new_browser_img_div").css("display", "block");
                }				
            }else{

                $("#label_motocast_id_title").text(i18n.txt.LABEL_MOTOCAST_ID_TITLE);
                $("#label_motocast_id_title").css("display", "block");

                $("#label_motocastad").text(i18n.txt.LABEL_MOTOCAST_ID_DESC);
                $("#btm_left_motocast_div").css("margin-top", "100px");

                if (BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9) {
                    document.getElementById("old_browser_img_div").runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=images/AMP-motocastid-art.png, enabled=true, sizingMethod=scale)";
                    $("#old_browser_img_div").show();
                    $("#old_browser_img_div").css("display", "block");
                }
                else
                {
                    $("#td_motocast_img").attr("src", "images/AMP-motocastid-art.png");
                    $("#td_motocast_img").css("margin-left", "0");
                    $("#new_browser_img_div").show();
                    $("#new_browser_img_div").css("display", "block");
                }
            }
            
            this.username = $("#username");
            this.password = $("#password");
      
            this.loginButton = $("#button_signin");
            this.model.view = this;
            // this.model.bind("validated", this.validated);
        
            //If cookie present please re-direct the flow back to the calling app
            var ampCookie=getCookie("amp");
            if (ampCookie!=null && ampCookie!=""&& ampCookie=="true")
            {
                //Read the sso + userid and redirect back to the caller
                var redirectUrl;
                if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                   
                    if(gObject.continueUrl.search('%3F') != -1 ){
                        redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }else{
                        redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }
                
               
                    window.open(unescape(redirectUrl),"_self");
                }
            }
            //Temp fix for to show the "please scroll right side for singin" text for to handle mobile device case
             var ua = navigator.userAgent;
            if( ua.match(/Android/) 
                || ua.match(/Dalvik/)
                || ua.match(/GINGERBREAD/)
                || ua.match(/Linux;.*Mobile Safari/)
                || ua.match(/Linux 1\..*AppleWebKit/)){
                $("#mbt_scroll_right_div").show ();
            }
        
            align_screen_footer ($("#page_content_div").innerHeight());
            
            if(gObject.svc === "signup" || gObject.svc === "cas_google_signup"){
                $("#signin_div").hide();
                $("#signup_div").show ();
            }
            
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
        
        popupWindow : function() {
        	var return_to = 'http%3A%2F%2F'+GAE_HOSTNAME+'%2Fcallback%2Fgoogle%3Fapp_id%3D'+APPID+'%26client_type%3D2%26orig_url%3D'+gObject.amServer+'%2Fweb%2Fgoogle_signin.html%3Flocale%3D'+gObject.langString;

        	if (gObject.continueUrl.indexOf("redirect") == -1) {        	
            	return_to = return_to+'%2526continue_url%253D'+gObject.continueUrl;
        	}
        	                	
            var url = 'http://www.google.com/accounts/o8/ud?'+
            	'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'+
            	'openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
            	'openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
            	'openid.return_to='+return_to+'&	openid.mode=checkid_setup&'+
            	'openid.ui.mode=popup&'+
            	'openid.ns.ui=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fui%2F1.0&'+
            	'openid.ns.pape=http://specs.openid.net/extensions/pape/1.0&'+
            	'openid.ns.ax=http://openid.net/srv/ax/1.0&'+
            	'openid.ax.mode=fetch_request&openid.ax.type.email=http://axschema.org/contact/email&'+
            	'openid.ax.type.firstname=http://axschema.org/namePerson/first&'+
            	'openid.ax.type.lastname=http://axschema.org/namePerson/last&'+
            	'openid.ax.required=email,firstname';
            if (gObject.appId !== null) {
                
                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;
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
                                	url = url + '&openid.realm=https://'+SSO_HOSTNAME+'&openid.ns.oauth=http://specs.openid.net/extensions/oauth/1.0'+'&openid.oauth.consumer='+SSO_HOSTNAME+'&openid.oauth.scope='+gObject.googleScope;
                                }
                              }

                        }
                        window.open(url,"_self");
                    }
                	
                };

                xhr.send();
            }
            //window.open(url,"_self");
        },

        showGoogleSignUp: function(){
            $("#signin_div").hide();
            $("#signup_google_div").show();
            
            /* update the vertical divider line height as per the div height */
            //resize_divider ("#signup_google_div");
            align_screen_footer ($("#signup_google_div").innerHeight());
        },
        
        showSiginUp: function(){
            $("#signin_div").hide();
            $("#signup_div").show();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        showSiginIn: function(){
            $("#signin_div").hide();
            $("#signin_account_div").show();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        showForgetPasswordView: function() {
            $("#body_div").fadeTo("fast", 0.33);
            $("#forgot_pwd_div").show ();
            $("#button_reset_pwd").attr("disabled", true);
            $("#button_reset_pwd").attr("class", "disabled-button");
            //$("#button_reset_pwd").css("color", "#999999");
            $("#forgot_dialog_motoid").val("");
            $("#forgot_dialog_motoid").focus();
            $("#forgot_dialog_motoid").css('borderColor', '');
            $("#forgot_dialog_motoid").css('borderStyle', '');
            $("#forgot_pwd_sub_div").hide();
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

        doForgetPassword: function () {
            
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/forgetpassword";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {							
                    //console.log("Success ::"+xhr.responseText);
                    } else {
                    //console.log("Error ::");
                    }
                }
            };

            var userInfo = {
                "appid" : gObject.appId,
                "login" : gObject.mailId,
                "locale": gObject.langString                
            };
            xhr.send(JSON.stringify(userInfo));
        }
    });

    var VerifyView = Backbone.View.extend({
        
        el: "#verify_div",

        events: {
            "click #b_signin": "showSignIn",
            "click #anchor_choose_mail" : "showChangeEmailAddressView",
            "click #anchor_resend_verification_code" : "resendVerify"

        },

        initialize: function(){
        },


        showChangeEmailAddressView: function () {
            $("#change_email_addr_div").show();
            $("#cea_sub_div").hide();
            $("#cea_email_address").val('');
            $("#cea_email_address").focus();
            $("#button_cea_save").attr("disabled", true);
            $("#button_cea_save").attr("class", "disabled-button");
            //.css("color", "#999999");
            $('#cea_email_address').css('borderColor', '');
            $('#cea_email_address').css('borderStyle', '');
            $("#body_div").fadeTo("fast", 0.33);
        },
       

        resendVerify: function (hidePopup) {
            $("#verify_err_text").hide();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#verify_inner_div");
            align_screen_footer ($("#verify_div").innerHeight());
            var d    = new Date();
            if ((gObject.appId !== null) && (gObject.authToken !== null) && (gObject.userId !== null)) {
                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var url = gObject.amServer + "/app/user/verifyemail?userid=" + gObject.userId + "&appid=" + gObject.appId + "&time="+ d.getTime();
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.setRequestHeader("Accept", "application/json");
                launchSpinner(i18n.txt.MSG_SENDING_VERIFICATION_CODE);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        exitSpinner();
                        if (xhr.status == 200) {
                            var Response = JSON.parse(xhr.responseText);
                            if (Response.status == "Success") {
                                var innerResponse = JSON.parse(Response.response);
                                if (innerResponse.error == "UM_FORBIDDEN"){
                                    customAlert("NO_STATE", i18n.txt.LABEL_VMCID_HEADER, i18n.txt.MSG_UNSUCCESSFUL_ATTEMPT);
                                }else if (innerResponse.error !== "OK") {
                                    customAlert("NO_STATE",  i18n.txt.MSG_ACCOUNT_NOT_FOUND);
                                } else {
                                    if(hidePopup !== true)
                                        customAlert("NO_STATE",  i18n.txt.TITLE_VERIFICATION_CODE_RESEND ,  "<p>" + i18n.txt.MSG_VERIFICATION_CODE_HAS_SEND + "<b  style='font-weight: bold;'>" + gObject.mailId + "</b><br><br>" +  i18n.txt.MSG_CHECK_YOUR_SPAM + "</p>");  
                                } 
                            } else {
                                customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_ACCOUNT_NOT_FOUND);
                            }
                        } else {
                            customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);

                        }
                    }
                };

                var postData = {
                    "authtoken" : gObject.authToken, 
                    "appid" : gObject.appId,
                    "targetUrl": gObject.continueUrl 
                };

                xhr.send(JSON.stringify(postData));

            } else {
                customAlert("NO_STATE", i18n.txt.TITLE_ERROR, i18n.txt.MSG_INVALID_PARAMS);
            // window.close();
            }

        },

        showSignIn: function () {
           var url = unescape(gObject.continueUrl) + "&appid=" + gObject.appId
                     + "&locale=" + gObject.langString;
           window.open(url, "_self");
        },

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
			
            $("#alert_dialog_box").hide();
            $("#body_div").fadeTo("fast", 1.0);
            $("#alert_title").text("");
            $("#alert_text").html("");

            if (alrt_state === "SIGNUP_SUCCESSUP") {
                $("#signin_div").show();
                align_screen_footer ($("#page_content_div").innerHeight());

                //hide divider div
                $("#devider_div").css("display", "none");
                $("#signup_div").hide();

            } else if(alrt_state == "VERIFY_SUCCESS") {
                var redirectUrl;
                if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                    if(gObject.continueUrl.search('%3F') != -1 ){
                        redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }else{
                        redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }
                    window.open(unescape(redirectUrl),"_self");
                }

            } else if(alrt_state == "UNVERIFIED") {
                $("#verify_mailID").text(gObject.mailId);
                $("#verify_mailID").attr("original-title",gObject.mailId);
                $('#verify_mailID').tipsy();                
                $("#signin_account_div").hide();
                $("#verify_div").show();
				
                resize_divider ("#verify_inner_div");
                align_screen_footer ($("#verify_div").innerHeight());

                $("#vd1").focus();
                $("#signin_div").hide();

            } else if(alrt_state == "VERIFIED") {
                //var redirectUrl = gObject.continueUrl+"?sso_token="+gObject.authToken+"&uid="+gObject.userId;
                var redirectUrl;
                if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                
                    if(gObject.continueUrl.search('%3F') != -1 ){
                        redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }else{
                        redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }
                    window.open(unescape(redirectUrl),"_self");
                }
            } else if(alrt_state == "INVALID_REQUEST") {
                //var redirectUrl = gObject.continueUrl+"?sso_token="+gObject.authToken+"&uid="+gObject.userId;
                var redirectUrl;
                
                if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                    if(gObject.continueUrl.search('%3F') != -1 ){
                        redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }else{
                        redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                    }
                    window.open(unescape(redirectUrl),"_self");
                }
                
            }
            else {
            }
            
            alrt_state = "NO_STATE";

        }
    });

    var UserConsentView = Backbone.View.extend({
        el: "#user_consent_div",
        
        events: {
            "click #user_consent_button_cancel" : "cancelUserConsent",
            "click #user_consent_button_agree": "agreeUserConsent",
            "click #user_consent_link": "showUserConsent",
            "click #img_close": "cancelUserConsent"
        },
        
        initialize: function() {
        },

        cancelUserConsent: function(){
            var redirectUrl;
            
            if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                if(gObject.continueUrl.search('%3F') != -1 ){
                    redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                }else{
                    redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                }
                window.open(unescape(redirectUrl),"_self");
            }        	
        },
        
        agreeUserConsent: function(){
            $("#user_consent_div").hide();
            $("#body_div").fadeTo("fast", 1.0);
        },
        
        showUserConsent: function(){
            var url = 'https://portal-moto.svcmot.com/moto-web-portal/legal/?l=ko_KR&f=tos&';
            window.open(url);
        },
        
        render: function() {
            $("#signin_motocast_img1").attr("src", "images/Motoroladevice-logo.png"); 
            $("#signin_motocast_img1").css("display", "block"); 
            $("#user_consent_div").show();
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
            $("#forgot_pwd_div").hide();
            $("#body_div").fadeTo("fast", 1.0);
        },
        
        showSiginUp: function(){
            clearInterval(textFieldTimer);
            textFieldTimer = null;
            $("#forgot_pwd_div").hide();
            $("#body_div").fadeTo("fast", 1.0);

            $("#signin_div").hide();
            $("#signup_div").show ();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },

        validateForgetTextBox : function(){
            clearInterval(textFieldTimer);
            textFieldTimer = null;
       				
            $("#forgot_dialog_motoid").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
           
            if(($("#forgot_dialog_motoid").val().length > 0)){
                $("#button_reset_pwd").attr("disabled", false);
                $("#button_reset_pwd").attr("class", "primary-button");
            // $('#button_reset_pwd').focus();
            //.css("color", "#FFFFFF");
            }else{
                $("#button_reset_pwd").attr("disabled", true);
                $("#button_reset_pwd").attr("class", "disabled-button");
            //.css("color", "#999999");
            }
        },
        
        doResetPassword: function () {
            gObject.mailId = $("#forgot_dialog_motoid").val();

            launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
            
            $('#forgot_dialog_motoid').css('borderColor', '');
            $('#forgot_dialog_motoid').css('borderStyle', '');
            $("#forgot_pwd_sub_div").hide();

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
                                $("#forgot_pwd_div").hide ();
                                $("#forgot_pwd_sub_div").hide();
                                customAlert("NO_STATE", i18n.txt.TITLE_FORGOT_DIALOG_OK,i18n.txt.LABEL_FORGOT_DIALOG_OK );
                            }else if((innerResponse.error === "UM_ACCOUNT_UNVERIFIED")){
                                $("#forgot_pwd_div").hide ();
                                $("#forgot_pwd_sub_div").hide();

                                window.forgotPasswordView.showVerificationRequiredView();
                            }
                            else{
                                //customAlert("NO_STATE",  'TITLE_LOGIN_ERROR'),  'MSG_LOGIN_ERROR_INVALID_CREDENTIALS'));
                                $("#forgot_pwd_sub_div").show();
                                $('#forgot_dialog_motoid').css('borderColor', '#FF0000');
                                $('#forgot_dialog_motoid').css('borderStyle', 'solid');
                                $('#forgot_dialog_motoid').val('');
                                $('#forgot_dialog_motoid').focus();
                                $("#button_reset_pwd").attr("disabled", true);
                                $("#button_reset_pwd").attr("class", "disabled-button");
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
            $("#verification_required_div").show();
        }

    });
    
    var ChangeEmailAddressView = Backbone.View.extend({
        el: "#change_email_addr_div",

        events: {
            "click #button_cea_save": "changeEmailAddress",
            "click #button_cea_cancel": "exitChangeEmailAddressView",
            "click #img_close": "exitChangeEmailAddressView",
            "mouseup #cea_email_address" : "onMouseUp",
            "blur #cea_email_address":"stopTimer",
            "keyup #cea_email_address" : "validateButton"
        },

        initialize: function(){
        
            $("#change_email_addr_div").keydown(function(event){
		 	
                if((event.keyCode === 13) && (!$('#button_cea_cancel').is( ":focus" )) && ($('#button_cea_save').attr('disabled') !== "disabled")) {
                    $("#button_cea_save").trigger('click');
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
            if ($.trim($("#cea_email_address").val()) !== "")
            {
                clearInterval(textFieldTimer);
                textFieldTimer = null; 
		
                $("#cea_email_address").trigger("keyup");
            }
        },

        validateButton : function () {

            clearInterval(textFieldTimer);
            textFieldTimer = null;
			
            if($("#cea_email_address").val().length > 0) {
                $("#button_cea_save").attr("disabled", false);
                $("#button_cea_save").attr("class", "primary-button");
            //.css("color", "#FFFFFF");
            }else{
                $("#button_cea_save").attr("disabled", true);
                $("#button_cea_save").attr("class", "disabled-button");
            //.css("color", "#999999");
            }
        },

        exitChangeEmailAddressView: function () {

            clearInterval(textFieldTimer);
            textFieldTimer = null;
        
            $("#change_email_addr_div").hide();
            $("#vd1").focus();
            $("#body_div").fadeTo("fast", 1.0);
        },
	
    
        changeEmailAddress : function() {
            var email = $.trim($('#cea_email_address').val());

            $('#cea_email_address').css('borderStyle', '');
            $('#cea_email_address').css('borderColor', '');

            if( (email.length < 1) || (validateEmail(email)) ) {
                $("#cea_sub_div").show();
                $("#cea_email_address").val('');
                $("#cea_email_address").focus();
                $('#cea_email_address').css('borderStyle', 'solid');
                $('#cea_email_address').css('borderColor', '#FF0000');
                $("#button_cea_save").attr("disabled", true);
                $("#button_cea_save").attr("class", "disabled-button");
                //.css("color", "#999999");
                return;
            }
            
            launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
            
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/changelogin";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            var ampCookie=getCookie("amp_session_token");
            	xhr.setRequestHeader("X-AMP-SESSION-TOKEN", gObject.ampSessionToken);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    exitSpinner();
                    if (xhr.status == 200) {							
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            var innerResponse = JSON.parse(Response.response);
                            if ((innerResponse.error === "OK")) { 
                                gObject.mailId = email;
                                window.verifyView.resendVerify(true);
                                $("#verify_mailID").text(gObject.mailId);
                                $("#verify_mailID").attr("original-title",gObject.mailId);
                                $('#verify_mailID').tipsy();                                
                                $("#body_div").fadeTo("fast", 1.0);
                                $("#change_email_addr_div").hide ();
                                $("#cea_sub_div").hide();
                                setCookie("amp_session_token_string", "|amp_session_token="+Response.ampSessionToken+"|", 1);
                            }else{
                                $("#cea_email_address").val('');
                                $("#cea_email_address").focus();
                                $('#cea_email_address').css('borderStyle', 'solid');
                                $('#cea_email_address').css('borderColor', '#FF0000');
                                $("#cea_sub_div").show();
                            //customAlert("NO_STATE", handle.getLocalization(strings,'TITLE_LOGIN_ERROR'), handle.getLocalization(strings,'MSG_LOGIN_ERROR_INVALID_CREDENTIALS'));
                            //  $("#forgot_pwd_sub_div").show();
                            }
                        } else {
                            //customAlert("NO_STATE", TITLE_ERROR, MSG_SERVICE_ERROR);
                            $("#cea_email_address").val('');
                            $("#cea_email_address").focus();
                            $('#cea_email_address').css('borderStyle', 'solid');
                            $('#cea_email_address').css('borderColor', '#FF0000');
                            $("#cea_sub_div").show();
                        }
                    } else {
                        //customAlert("NO_STATE", TITLE_ERROR, MSG_SERVICE_ERROR);
                        $("#cea_email_address").val('');
                        $("#cea_email_address").focus();
                        $('#cea_email_address').css('borderStyle', 'solid');
                        $('#cea_email_address').css('borderColor', '#FF0000');
                        $("#cea_sub_div").show();
                    }
                }
                $("#button_cea_save").attr("disabled", true);
                $("#button_cea_save").attr("class", "disabled-button");
            //.css("color", "#999999");
            };

            var userInfo = {
                "appid" : gObject.appId,
                "newlogin" : email,
				"userId" : gObject.userId,
                "login" : gObject.mailId, 
 				"authtoken" : gObject.authToken
            };
            
            xhr.send(JSON.stringify(userInfo));
        }
    });
    
    
    var SignUpCredentials = Backbone.Model.extend({

        initialize: function(){
            this.bind("change", this.attributesChanged);
        },

        attributesChanged: function(){
            var valid = false;
            this.trigger("validated", valid);
        }
  
    });
    
    var SigninAccountView = Backbone.View.extend({
    	
        el: "#signin_account_div",
        events: {
//            "click #button_signup_google" : "googleSignUp",
//            "click #_bcreateacc": "createAccount",
//            "click #_bcancel": "singupCancel",
//            "keyup #signup_name" : "signUpValidate",
//            "keyup #signup_email" : "signUpValidate",
//            "keyup #signup_pwd" : "signUpValidate",
//            "keyup #signup_cfpwd" : "signUpValidate",
//            "focus #signup_name": "showHelpUNameText",
//            "focus #signup_email": "showHelpEmailText",
//            "focus #signup_pwd": "showHelpPwdText"  ,
//            "blur #signup_name": "hideHelpUNameText",
//            "blur #signup_email": "hideHelpPwdText",
//            "blur #signup_pwd": "hideNewPwdError",
//            // "blur #signup_cfpwd": "hidecfpwdError",
//            "click #anchor_signup_tandc_link": "showTandC",
            
            "click #button_signin": "performLogin",
            "keyup #username": "setUsername",
            "keyup #password": "setPassword",
            "click #anchor_signup" : "showSiginUp",
            "click #anchor_signin" : "showSiginIn",            
            "click #anchor_create_pwd" : "showResetPasswordView",
            "click #anchor_forgetpass" : "showForgetPasswordView",
            "click #anchor_signup_account" : "showSiginUp"
        },
        initialize: function(){

        },
        performLogin: function(){
            var lUser= $.trim($('#signin_email').val());
            var lPword = $('#signin_pwd').val();

            $('#label_userId').css('color', '');
            $('#signin_email').css('borderColor', '');
            $('#signin_email').css('borderStyle', '');
            $('#label_password').css('color', '');
            $('#signin_pwd').css('borderColor', '');
            $('#signin_pwd').css('borderStyle', '');

            if(lUser.length < 1) {
                $("#label_signin_account_err_text").text(i18n.txt.LABEL_ERR_LOGIN_CREDENTIALS);
                $("#signin_account_err_div").show();
                $('#label_userId').css('color', 'red');
                $('#signin_email').css('borderColor', '#FF0000');
                $('#signin_email').css('borderStyle', 'solid');
                //$('#username').val('');
                $('#signin_email').focus();
			
                return;
            }

            if(lPword.length < 1) {
                $("#label_signin_account_err_text").text(i18n.txt.LABEL_ERR_LOGIN_CREDENTIALS);
                $("#signin_err_div").show();
                $('#label_password').css('color', 'red');
                $('#signin_pwd').css('borderColor', '#FF0000');
                $('#signin_pwd').css('borderStyle', 'solid');
                $('#signin_pwd').val('');
                $('#signin_pwd').focus();

                return;
            }

            launchSpinner(i18n.txt.LABEL_SIGNING_IN);
            
            gObject.mailId = $.trim($('#signin_email').val());
      
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/signin";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {	
                        var Response = JSON.parse(xhr.responseText);
                        if (Response.status == "Success") {
                            var innerResponse = JSON.parse(Response.response);
                            if (innerResponse.error == "OK") {
                                /*Store the cookie*/
                                                                        
                                gObject.authToken = innerResponse.session.authToken;
                                gObject.userId   = encodeURIComponent(innerResponse.session.userId);
                                
                                if(innerResponse.session.userInfo.profile != undefined || innerResponse.session.userInfo.profile != null) {
                                    if((innerResponse.session.userInfo.profile.userName === undefined) || (innerResponse.session.userInfo.profile.userName === null) || (innerResponse.session.userInfo.profile.userName.length === 0))
                                        gObject.userName = innerResponse.session.userInfo.login;
                                    else 
                                        gObject.userName = innerResponse.session.userInfo.profile.userName;
	                                
                                    if((innerResponse.session.userInfo.profile.displayName === undefined) || (innerResponse.session.userInfo.profile.displayName === null) || (innerResponse.session.userInfo.profile.displayName.length === 0))
                                        gObject.displayName = gObject.userName;
                                    else 
                                        gObject.displayName = innerResponse.session.userInfo.profile.displayName;
                                } else {
                                    gObject.userName = innerResponse.session.userInfo.login;
                                    gObject.displayName = innerResponse.session.userInfo.login;                                	
                                }
                                gObject.mailId =  innerResponse.session.userInfo.login;
                                _gaq.push(['_trackEvent', 'Motocast Login', 'Motocast Login Success']);
                                
                                //TBD: Open this block to support Keep Me Sign-in feature
                                /*   if(($("#chk_img").attr("value") == "1")){
                                       var cookieKey = "|sso="+gObject.authToken+"|"+"uid="+gObject.userId+"|";
                                       setCookie("amp",cookieKey,12);
                                     }
                                 */
                                    
                                //Write a cookie to store the userID and update the signin type.
                                if(gObject.userId != null){
                                    var cookieKey = "|login_type=mCastId|";
                                    setCookie(gObject.userId,cookieKey,12);
                                }
                                setCookie("amp_session_token_string", "|amp_session_token="+Response.ampSessionToken+"|", 1);
                                if(innerResponse.session.userInfo.profile != undefined || innerResponse.session.userInfo.profile != null) {
                                    if(innerResponse.session.userInfo.profile.verificationStatus == "UNVERIFIED") {
                                        $("#verify_mailID").text(gObject.mailId);
                                        $("#verify_mailID").attr("original-title",gObject.mailId);
                                        $('#verify_mailID').tipsy();                                    
                                        $("#verify_div").show();

                                        resize_divider ("#verify_inner_div");
                                        align_screen_footer ($("#verify_div").innerHeight());
										
                                        $("#vd1").focus();
                                        $("#signin_div").hide();
                                        $("#signin_account_div").hide();
                                        window.verifyView.resendVerify(true);

                                    } else if(innerResponse.session.userInfo.profile.verificationStatus == "VERIFIED") {
                                        //var redirectUrl = gObject.continueUrl+"?sso_token="+gObject.authToken+"&uid="+gObject.userId;
                                        launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
                                        var redirectUrl;
                                        if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                                            if(gObject.continueUrl.search('%3F') != -1 ){
                                                redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                                            }else{
                                                redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                                            }
                                            window.open(unescape(redirectUrl),"_self");
                                        }
                                    }
                                    
                                    //exitSpinner();
                                    $("#body_div").fadeTo("fast", 1.0);
                                    $("#signin_account_err_div").hide();
                                    $('#label_userId').css('color', '');
                                    $('#label_password').css('color', ''); 
                                    $('#signin_email').css('borderColor', ''); 
                                    $('#signin_pwd').css('borderColor', ''); 
                                    $('#signin_email').css('borderStyle', ''); 
                                    $('#signin_pwd').css('borderStyle', ''); 
                                    $('#signin_pwd').val(''); 
                                    //$('#signin_email').val(''); 
                                }else{
                                    //getuserinfo
                                    window.signupView.getUserInfo(false);
                                  
                                }
                               
                             
                            } else {
                                exitSpinner();
                                $("#body_div").fadeTo("fast", 1.0);
                                if(innerResponse.error == "UM_ACCOUNT_LOCKED"){
                                    $("#label_signin_account_err_text").text(i18n.txt.MSG_LOGIN_ERROR_ACCOUNT_LOCKED); 
                                }else if(innerResponse.error == "UM_ACCOUNT_DISABLED"){
                                    $("#label_signin_account_err_text").text(i18n.txt.MSG_LOGIN_ERROR_ACCOUNT_DISABLED); 
                                }else if(innerResponse.error == "UM_FIRST_SIGNIN_RESET_PASSWORD"){
                                    $("#label_signin_account_err_text").text(i18n.txt.LABEL_ERR_REQ_RESET_PWD1);
                                    //$("#anchor_create_pwd").text(HREF_CREATE_PWD);
                                    //$("#label_signin_err_text2").text(LABEL_RR_REQ_RESET_PWD2);
                                    
                                    //Do forgetPassword API call 
                                    window.loginView.doForgetPassword();
                                }
                                else{
                                    $("#label_signin_account_err_text").text(i18n.txt.LABEL_ERR_LOGIN_CREDENTIALS); 
                                }
                                $("#signin_account_err_div").show();
                                $('#label_userId').css('color', 'red');
                                $('#label_password').css('color', 'red'); 
                                $('#signin_email').css('borderColor', '#FF0000'); 
                                $('#signin_pwd').css('borderColor', '#FF0000'); 
                                $('#signin_email').css('borderStyle', 'solid'); 
                                $('#signin_pwd').css('borderStyle', 'solid'); 
                                $('#signin_pwd').val(''); 
                                //$('#signin_email').val(''); 
                                $('#signin_pwd').focus(); 
                            //customAlert("NO_STATE", TITLE_LOGIN_ERROR, MSG_LOGIN_ERROR_INVALID_CREDENTIALS);
                            }
                        } else {
                            exitSpinner();
                            customAlert("NO_STATE",  i18n.txt.TITLE_LOGIN_ERROR,  i18n.txt.MSG_LOGIN_ERROR_INVALID_CREDENTIALS);
                            _gaq.push(['_trackEvent', 'Motocast Login', 'Motocast Login Fail']);
                        }
                    } else {
                        exitSpinner();
                        customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,  i18n.txt.MSG_SERVICE_ERROR);
                        _gaq.push(['_trackEvent', 'Motocast Login', 'Motocast Login Fail']);
                    }
                }
            };

            var userInfo = {
                "appid" : gObject.appId,
                "username" : lUser,
                "password" : lPword
            };

            xhr.send(JSON.stringify(userInfo));
      
            return false;
        },
        setUsername: function(e){
            this.model.set({
                username: this.username.val()
            });
            
            $("#signin_email").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            $("#signin_pwd").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            
        },

        setPassword: function(e){
            this.model.set({
                password: this.password.val()
            });
            
            $("#signin_email").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            $("#signin_pwd").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            
        },
        
        showSiginUp: function(){
            $("#signin_div").hide();
            $("#signin_account_div").hide();
            $("#signup_div").show();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        showSiginIn: function(){
            $("#signin_div").hide();
            $("#signin_account_div").show();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        showForgetPasswordView: function() {
            $("#body_div").fadeTo("fast", 0.33);
            $("#forgot_pwd_div").show ();
            $("#button_reset_pwd").attr("disabled", true);
            $("#button_reset_pwd").attr("class", "disabled-button");
            //$("#button_reset_pwd").css("color", "#999999");
            $("#forgot_dialog_motoid").val("");
            $("#forgot_dialog_motoid").focus();
            $("#forgot_dialog_motoid").css('borderColor', '');
            $("#forgot_dialog_motoid").css('borderStyle', '');
            $("#forgot_pwd_sub_div").hide();
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

        doForgetPassword: function () {
            
            var xhr = newXMLHttpRequest();//new XMLHttpRequest();
            var url = gObject.amServer + "/app/user/forgetpassword";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function() {

                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {							
                    //console.log("Success ::"+xhr.responseText);
                    } else {
                    //console.log("Error ::");
                    }
                }
            };

            var userInfo = {
                "appid" : gObject.appId,
                "login" : gObject.mailId,
                "locale": gObject.langString                
            };
            xhr.send(JSON.stringify(userInfo));
        }
    });
    
    var SignupGoogleView = Backbone.View.extend({
        
        el: "#signup_google_div",
        
        events: {
            "click #button_signup_google_screen" : "googleSignUp",
            "click #google_signup_cancel" : "signUpCancel",
            "click #anchor_signup_google_tandc_link": "showTandC",
            "click #label_signup_google_mid_text1" : "showSiginUp"
        },
        
        googleSignUp: function(){
        	var return_to = 'http%3A%2F%2F'+GAE_HOSTNAME+'%2Fcallback%2Fgoogle%3Fapp_id%3D'+APPID+'%26client_type%3D2%26orig_url%3D'+gObject.amServer+'%2Fweb%2Fgoogle_signin.html%3Flocale%3D'+gObject.langString;

        	if (gObject.svc === "cas_google_signup") {
        		gObject.continueUrl = gObject.continueUrl+"%2526svc%253Dcas_google_signup%2526src%253Dcas";
        	}
        	
        	if (gObject.continueUrl.indexOf("redirect") == -1) {        	
            	return_to = return_to+'%2526continue_url%253D'+gObject.continueUrl;
        	}
        	                	
            var url = 'http://www.google.com/accounts/o8/ud?'+
            	'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'+
            	'openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
            	'openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
            	'openid.return_to='+return_to+'&openid.mode=checkid_setup&'+
            	'openid.ui.mode=popup&'+
            	'openid.ns.ui=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fui%2F1.0&'+
            	'openid.ns.pape=http://specs.openid.net/extensions/pape/1.0&'+
            	'openid.ns.ax=http://openid.net/srv/ax/1.0&'+
            	'openid.ax.mode=fetch_request&openid.ax.type.email=http://axschema.org/contact/email&'+
            	'openid.ax.type.firstname=http://axschema.org/namePerson/first&'+
            	'openid.ax.type.lastname=http://axschema.org/namePerson/last&'+
            	'openid.ax.required=email,firstname';
            if (gObject.appId !== null) {
                
                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;
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
                                	url = url + '&openid.realm=https://'+SSO_HOSTNAME+'&openid.ns.oauth=http://specs.openid.net/extensions/oauth/1.0'+'&openid.oauth.consumer='+SSO_HOSTNAME+'&openid.oauth.scope='+gObject.googleScope;
                                }
                              }

                        }
                        window.open(url,"_self");
                    }
                	
                };

                xhr.send();
            }
            //window.open(url,"_self");
        },
        
        signUpCancel: function(){
        	if (gObject.svc === "signup") {
                window.open(SSOAUTH_URL,"_self");
        	} else {
                //hide divider div
                $("#devider_div").css("display", "none");
                $("#signup_google_div").hide();

                $("#signin_div").show();
                align_screen_footer ($("#page_content_div").innerHeight());
                
                this.reset_signup_screen ();        		
        	}        	
        },
        
        showTandC: function(){
            openLegalLink();
        },
        
        showSiginUp: function(){
            $("#signup_google_div").hide();
            $("#signup_div").show();

            /* update the vertical divider line height as per the div height */
            resize_divider ("#signup_div");
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        reset_signup_screen: function () {
            $('#signup_name').val('');
            $('#signup_email').val('');
            $('#signup_pwd').val('');
            $('#signup_cfpwd').val('');

            $('#lable_signup_name').css('color', '');
            $('#lable_signup_email').css('color', '');
            $('#lable_signup_pwd').css('color', '');
            $('#lable_signup_cfpwd').css('color', '');
                
            $('#signup_name').css('borderColor', '');
            $('#signup_email').css('borderColor', '');
            $('#signup_pwd').css('borderColor', '');
            $('#signup_cfpwd').css('borderColor', '');

            $('#signup_name').css('borderStyle', '');
            $('#signup_email').css('borderStyle', '');
            $('#signup_pwd').css('borderStyle', '');
            $('#signup_cfpwd').css('borderStyle', '');
		        
            $('#page_lvl_err_div').hide();
            $('#div_err_uname').hide();
            $('#div_err_email').hide();
            $('#div_err_npwd').hide();
            $('#div_err_cfpwd').hide();
                
            $("#_bcreateacc").attr("disabled", true);
            $("#_bcreateacc").attr("class", "disabled-button");
        },
    });

    var SignupView = Backbone.View.extend({
        el: "#signup_div",

        events: {
            "click #button_signup_google" : "googleSignUp",
            "click #_bcreateacc": "createAccount",
            "click #_bcancel": "singupCancel",
            "click #captchaClick": "refreshCaptha",
            "keyup #signup_name" : "signUpValidate",
            "keyup #signup_email" : "signUpValidate",
            "keyup #signup_pwd" : "signUpValidate",
            "keyup #signup_cfpwd" : "signUpValidate",
            "focus #signup_name": "showHelpUNameText",
            "focus #signup_email": "showHelpEmailText",
            "focus #signup_pwd": "showHelpPwdText"  ,
            "blur #signup_name": "hideHelpUNameText",
            "blur #signup_email": "hideHelpPwdText",
            "blur #signup_pwd": "hideNewPwdError",
            // "blur #signup_cfpwd": "hidecfpwdError",
            "click #anchor_signup_tandc_link": "showTandC"
        },
        
        initialize: function(){
            $("#_bcreateacc").attr("disabled", true);
            $("#_bcreateacc").attr("class", "disabled-button");
            
            if (serverCfg.captchaEnabled) {
                $("#captcha_div").removeClass('hidden');
            }
        },

        refreshCaptha: function(){
            refreshCaptchaView();
        },

        googleSignUp: function(){
           var return_to = 'http%3A%2F%2F'+GAE_HOSTNAME+'%2Fcallback%2Fgoogle%3Fapp_id%3D'+APPID+'%26client_type%3D2%26orig_url%3D'+gObject.amServer+'%2Fweb%2Fgoogle_signin.html%3Flocale%3D'+gObject.langString;
           if (gObject.svc === "cas_google_signup") {
              gObject.continueUrl = gObject.continueUrl+"%2526svc%253Dcas_google_signup%2526src%253Dcas";
            }

           if (gObject.continueUrl.indexOf("redirect") == -1) {
              return_to = return_to+'%2526continue_url%253D'+gObject.continueUrl;
           }

           var url = 'http://www.google.com/accounts/o8/ud?'+
                'openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&'+
                'openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
                'openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&'+
                'openid.return_to='+return_to+'&openid.mode=checkid_setup&'+
                'openid.ui.mode=popup&'+
                'openid.ns.ui=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fui%2F1.0&'+
                'openid.ns.pape=http://specs.openid.net/extensions/pape/1.0&'+
                'openid.ns.ax=http://openid.net/srv/ax/1.0&'+
                'openid.ax.mode=fetch_request&openid.ax.type.email=http://axschema.org/contact/email&'+
                'openid.ax.type.firstname=http://axschema.org/namePerson/first&'+
                'openid.ax.type.lastname=http://axschema.org/namePerson/last&'+
                'openid.ax.required=email,firstname';
            if (gObject.appId !== null) {

                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var scopeUrl = gObject.amServer + "/app/user/googleScope?appid=" + gObject.appId;
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
                                	url = url + '&openid.realm=https://'+SSO_HOSTNAME+'&openid.ns.oauth=http://specs.openid.net/extensions/oauth/1.0'+'&openid.oauth.consumer='+SSO_HOSTNAME+'&openid.oauth.scope='+gObject.googleScope;
                                }
                              }

                        }
                        window.open(url,"_self");
                    }
                	
                };

                xhr.send();
            }
            //window.open(url,"_self");
        },
        
        showTandC: function(){
            openLegalLink();
        },
        
        showHelpUNameText: function() {
            $("#lable_uname_help").text(i18n.txt.LABEL_UNAME_HINT_TEXT);
        },
        
        showHelpEmailText: function() {
            $("#lable_email_help").text(i18n.txt.LABEL_EMAIL_HINT_TEXT);
        },

        showHelpPwdText: function() {
            $("#lable_npwd_help").text(i18n.txt.LABEL_PWD_VALIDATION_HINT_TEXT);
        },
        
        hideHelpUNameText: function() {
            $("#lable_uname_help").text('');
            $('#lable_signup_name').css('color', '');
            $('#signup_name').css('borderColor', '');
            $('#signup_name').css('borderStyle', '');
            $('#div_err_uname').hide();    
            
            $("#vd_center").height($('#signup_div').height());
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        hideHelpPwdText: function() {
        
            $("#lable_email_help").text('') ;
            $('#lable_signup_email').css('color', '');
            $('#signup_email').css('borderColor', '');
            $('#signup_email').css('borderStyle', '');
            $('#div_err_email').hide();
            $('#page_lvl_err_div').hide();
			
            $("#vd_center").height($('#signup_div').height());
            align_screen_footer ($("#signup_div").innerHeight());
        },


        hideNewPwdError : function() {
            $("#lable_npwd_help").text('') ;
            $('#lable_signup_pwd').css('color', '');
            $('#signup_pwd').css('borderColor', '');
            $('#signup_pwd').css('borderStyle', '');
            $('#div_err_npwd').hide();
            
            $("#vd_center").height($('#signup_div').height());
            align_screen_footer ($("#signup_div").innerHeight());
        },
      
        hidecfpwdError : function() {
            $('#lable_signup_cfpwd').css('color', '');
            $('#signup_cfpwd').css('borderColor', '');
            $('#signup_cfpwd').css('borderStyle', '');
            $('#div_err_cfpwd').hide();
            
            $("#vd_center").height($('#signup_div').height());
            align_screen_footer ($("#signup_div").innerHeight());
        },
        
        signUpValidate: function(){
            $("#signup_name").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            $("#signup_email").text().replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
            
            if(($.trim($("#signup_name").val()) != "") && ($("#signup_name").val().length > 0) && ($("#signup_name").val().search('@') == -1) && ($("#signup_name").val().length < 100) && ($("#signup_email").val().length > 0) && ($("#signup_pwd").val().length > 0) && ($("#signup_cfpwd").val().length > 0)){
                $("#_bcreateacc").attr("disabled", false);
                $("#_bcreateacc").attr("class", "primary-button");
            }else{
                $("#_bcreateacc").attr("disabled", true);
                $("#_bcreateacc").attr("class", "disabled-button");
            }
        // align_screen_footer ($('#body_div').innerHeight());
        },
        
        singupCancel: function(){
        	if (gObject.svc === "signup"  || gObject.svc === "cas_google_signup") {
		    if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                if(gObject.continueUrl.search('%3F') != -1 || 
                        gObject.continueUrl.search('\\?') != -1){
			    redirectUrl = gObject.continueUrl+"&appid="+escape(gObject.appId)+"&locale="+gObject.langString;
			}else{
			    //redirectUrl = SSOAUTH_URL + "/login?continueUrl=" + gObject.continueUrl+"&appid="+escape(gObject.appId)+"&locale="+gObject.langString;
			    redirectUrl = gObject.continueUrl+"?appid="+escape(gObject.appId)+"&locale="+gObject.langString;
			}
			window.open(unescape(redirectUrl),"_self");
		    }
		    else {
			window.open(SSOAUTH_URL + "/login?appid=" + gObject.appId,"_self");
		    }
        	} else {
                //hide divider div
                $("#devider_div").css("display", "none");
                $("#signup_div").hide ();

                $("#signin_div").show();
                align_screen_footer ($("#page_content_div").innerHeight());
                
                this.reset_signup_screen ();        		
        	}        	
        },

        reset_signup_screen: function () {
            $('#signup_name').val('');
            $('#signup_email').val('');
            $('#signup_pwd').val('');
            $('#signup_cfpwd').val('');

            $('#lable_signup_name').css('color', '');
            $('#lable_signup_email').css('color', '');
            $('#lable_signup_pwd').css('color', '');
            $('#lable_signup_cfpwd').css('color', '');
                
            $('#signup_name').css('borderColor', '');
            $('#signup_email').css('borderColor', '');
            $('#signup_pwd').css('borderColor', '');
            $('#signup_cfpwd').css('borderColor', '');

            $('#signup_name').css('borderStyle', '');
            $('#signup_email').css('borderStyle', '');
            $('#signup_pwd').css('borderStyle', '');
            $('#signup_cfpwd').css('borderStyle', '');
		        
            $('#page_lvl_err_div').hide();
            $('#div_err_uname').hide();
            $('#div_err_email').hide();
            $('#div_err_npwd').hide();
            $('#div_err_cfpwd').hide();

            $("#_bcreateacc").attr("disabled", true);
            $("#_bcreateacc").attr("class", "disabled-button");
        },

        createAccount: function () {
        // if ((verifyObj.appid !== null) && (verifyObj.authToken !== null) && (verifyObj.userId !== null)) 
        {
                var signup_name  = $('#signup_name').val();
                var signup_email  = $('#signup_email').val();
                var signup_pwd = $('#signup_pwd').val();
                var signup_captcha =  $('#signup_captcha').val();
                $('#lable_signup_name').css('color', '');
                $('#lable_signup_email').css('color', '');
                $('#lable_signup_pwd').css('color', '');
                $('#lable_signup_cfpwd').css('color', '');

                $('#signup_name').css('borderColor', '');
                $('#signup_email').css('borderColor', '');
                $('#signup_pwd').css('borderColor', '');
                $('#signup_cfpwd').css('borderColor', '');

                $('#signup_name').css('borderStyle', '');
                $('#signup_email').css('borderStyle', '');
                $('#signup_pwd').css('borderStyle', '');
                $('#signup_cfpwd').css('borderStyle', '');

                $('#page_lvl_err_div').hide();
                $('#div_err_uname').hide();
                $('#div_err_email').hide();
                $('#div_err_npwd').hide();
                $('#div_err_cfpwd').hide();
     
                signup_name = signup_name.replace(/^\s+|\s+$/g, '');
                if(!(/^.+$/.test(signup_name)) || signup_name.length > 100 || /\'/.test(signup_name) == true || 
                 signup_name.search('&') != -1 || signup_name.search('<') != -1 || signup_name.search('>') != -1 || 
                 signup_name.search('"') != -1 || signup_name.search('/') != -1 || /\\/.test(signup_name) == true ) {
                    $('#lable_signup_name').css('color', 'red');
                    $('#signup_name').css('borderColor', 'red');
                    $('#signup_name').css('borderStyle', 'solid');
                    $("#signup_name").focus();
                    $('#div_err_uname').show();

                    $("#_bcreateacc").attr("disabled", true);
                    $("#_bcreateacc").attr("class", "disabled-button");
                    
                    $("#vd_center").height($('#signup_div').height());
                    align_screen_footer ($('#signup_div').innerHeight());
                    return;
                }

                if( (signup_email < 1) || (validateEmail(signup_email)) ) {
                    $('#lable_signup_email').css('color', 'red');
                    $('#signup_email').css('borderColor', 'red');
                    $('#signup_email').css('borderStyle', 'solid');
                    $("#signup_email").val('');
                    $("#signup_email").focus();
                    $('#div_err_email').show();
                    $("#_bcreateacc").attr("disabled", true);
                    $("#_bcreateacc").attr("class", "disabled-button");

                    $("#vd_center").height($('#signup_div').height());
                    align_screen_footer ($('#signup_div').innerHeight());
                    return;
                }

                if($("#signup_pwd").val().length < 6) {
                    $('#lable_signup_pwd').css('color', 'red');
                    $('#signup_pwd').css('borderColor', 'red');
                    $('#signup_pwd').css('borderStyle', 'solid');
                    $('#div_err_npwd').show();
                    $("#signup_pwd").val('');
                    $("#signup_pwd").focus();
                    $("#signup_cfpwd").val('');
                    $("#_bcreateacc").attr("disabled", true);
                    $("#_bcreateacc").attr("class", "disabled-button");
                    //.css("color", "#999999");

                    /* update the vertical divider line height as per the div height */
                    $("#vd_center").height($('#signup_div').height());
                    align_screen_footer ($('#signup_div').innerHeight());
                    return;
                }

                /* if new password contains all blank spaces */
                if ((($.trim($("#signup_pwd").val()) === "") || (!(/^[^\s]*$/.test($("#signup_pwd").val()))))) {
                    $('#lable_signup_pwd').css('color', 'red');
                    $('#signup_pwd').css('borderColor', 'red');
                    $('#signup_pwd').css('borderStyle', 'solid');
                    $("#signup_pwd").val('');
                    $("#signup_pwd").focus();
                    $("#signup_cfpwd").val('');
                    $('#div_err_npwd').show();
		            
                    $("#button_save").attr("disabled", true);
                    $("#button_save").attr("class", "disabled-button");

                    /* update the vertical divider line height as per the div height */
                    $("#vd_center").height($('#inner_div_change_pwd').height());
                    align_screen_footer ($('#page_content_div').innerHeight());

                    return;
                }

                if($("#signup_pwd").val() !== $("#signup_cfpwd").val() ) {
                    $('#lable_signup_cfpwd').css('color', 'red');
                    $('#signup_cfpwd').css('borderColor', 'red');
                    $('#signup_cfpwd').css('borderStyle', 'solid');
                    $('#div_err_cfpwd').show();

                    $("#signup_cfpwd").val('');
                    $("#signup_cfpwd").focus();
                    $("#_bcreateacc").attr("disabled", true);
                    $("#_bcreateacc").attr("class", "disabled-button");
                    //.css("color", "#999999");

                    /* update the vertical divider line height as per the div height */
                    $("#vd_center").height($('#signup_div').height());
                    align_screen_footer ($('#signup_div').innerHeight());

                    // customAlert("NO_STATE", TITLE_ERROR, MSG_NEW_CNFM_PWD_NOT_EQUAL);
                    return;
                }

                gObject.mailId = signup_email;

                launchSpinner(i18n.txt.MSG_SIGNUP_IN_PROCCESS);
                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var url = gObject.amServer + "/app/user/signup?type=MOTOID";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.onreadystatechange = function() {
                    var refreshCapt = true;
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var Response = JSON.parse(xhr.responseText);

                            if (Response.status == "Success") {
                                var innerResponse = JSON.parse(Response.response);
                                if (innerResponse.error === "OK") {
                                    //Call getuser For to show the verifications
                                    gObject.userId = innerResponse.session.userId;
                                    gObject.authToken = innerResponse.session.authToken;
                                    gObject.accountCreatedNow = "Yes";
                                    setCookie("amp_session_token_string", "|amp_session_token="+Response.ampSessionToken+"|", 1);
                                    window.signupView.getUserInfo(true);
                                    refreshCapt = false;
                                    _gaq.push(['_trackEvent', 'Motocast Signup', 'Motocast Signup Success']);
                                } else if(innerResponse.error === "UM_ACCOUNT_EXISTS"){
                                    // customAlert("NO_STATE",  TITLE_ERROR, MSG_ACCOUNT_ALREADY_IN_USE);
                                    $('#lable_signup_email').css('color', 'red');
                                    $('#signup_email').css('borderColor', 'red');
                                    $('#signup_email').css('borderStyle', 'solid');
                                    $("#signup_email").focus();
                                    $('#page_lvl_err_div').show();

                                    $("#signup_name").val('');
                                    $("#signup_email").val('');
                                    $("#signup_pwd").val('');
                                    $("#signup_cfpwd").val('');

                                    $("#_bcreateacc").attr("disabled", true);
                                    $("#_bcreateacc").attr("class", "disabled-button");

                                    $("#vd_center").height($('#signup_div').innerHeight());
                                    $("#body_div").fadeTo("fast", 1.0);
                                    exitSpinner();
                                } else if(innerResponse.error === "UM_INVALID_PASSWORD" ){
                                    customAlert("NO_STATE",  i18n.txt.TITLE_ERROR, i18n.txt.LABEL_VMCID_ERR_MSG);
                                    _gaq.push(['_trackEvent', 'Motocast Signup', 'Motocast Signup Fail']);
                                    exitSpinner();
                                }else if(innerResponse.error === "INVALID_CAPTCHA_RESP"){
                                    customAlert("NO_STATE",   i18n.txt.TITLE_ERROR,  i18n.txt.LABEL_INVALID_CAPTCHA_RESPONSE);
                                    exitSpinner();
                                }else {
                                    customAlert("NO_STATE",   i18n.txt.TITLE_ERROR,  i18n.txt.TITLE_SIGNUP_ERROR);
                                    _gaq.push(['_trackEvent', 'Motocast Signup', 'Motocast Signup Fail']);
                                    exitSpinner();
                                }
                            } else{
                                customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,   i18n.txt.MSG_SERVICE_ERROR);
                                _gaq.push(['_trackEvent', 'Motocast Signup', 'Motocast Signup Fail']);
                                exitSpinner();
                            }
                        } else {
                            customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,   i18n.txt.MSG_SERVICE_ERROR);
                            _gaq.push(['_trackEvent', 'Motocast Signup', 'Motocast Signup Fail']);
                            exitSpinner();
                        }
                    //exitSpinner();
                    //$("#body_div").fadeTo("fast", 1.0);
                       if(refreshCapt){
                            refreshCaptchaView();
                       }
                    }
                    align_screen_footer ($('#signup_div').innerHeight());
                };
                grecaptcha.execute(GCAPTCHA_SITE_KEY, {action: 'signup_input'}).then(function(token) {
                    var greCaptchaAction = "signup_input";
                    var pData = {
                            "appid" : gObject.appId,
                            "login" : $.trim(signup_email),
                            "password" : signup_pwd,
                            "userName": $.trim(signup_name),
                            "displayName" : $.trim(signup_name),
                            "language" : gObject.langString,
                            "captcha":  $.trim(signup_captcha),
                            "greCaptcha": $.trim(token),
                            "greCaptchaAction" : greCaptchaAction
                        };
                        xhr.send(JSON.stringify(pData));
                });
            }
        },
        getUserInfo: function(signUp) {
            if (( gObject.appId !== null) && ( gObject.authToken !== null) && ( gObject.userId !== null)) {
                launchSpinner(  i18n.txt.MSG_PLEASE_WAIT);
                var xhr = newXMLHttpRequest();//new XMLHttpRequest();
                var url = gObject.amServer + "/app/user/getuserinfo?userid=" +  gObject.userId + "&appid=" +  gObject.appId + "&authtoken=" +  encodeURIComponent(gObject.authToken) +"&email="+ gObject.mailId;

                xhr.open("GET", url, true);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.onreadystatechange = function() {

                    if (xhr.readyState == 4) {
                        // $("#body_div").fadeTo("fast", 1.0);
                        if (xhr.status == 200) {
                            var Response = JSON.parse(xhr.responseText);
                            if (Response.status == "Success") {
                                var innerResponse = JSON.parse(Response.response);
                                if (innerResponse.error === "OK") {
                                    if(innerResponse.userInfo.profile != undefined || innerResponse.userInfo.profile != null) {
                                        if((innerResponse.userInfo.profile.userName === undefined) || (innerResponse.userInfo.profile.userName === null) || (innerResponse.userInfo.profile.userName.length === 0))
                                            gObject.userName = innerResponse.userInfo.login;
                                        else
                                            gObject.userName = innerResponse.userInfo.profile.userName;
    	                                
                                        if((innerResponse.userInfo.profile.displayName === undefined) || (innerResponse.userInfo.profile.displayName === null) || (innerResponse.userInfo.profile.displayName.length === 0))
                                            gObject.displayName = gObject.userName;
                                        else
                                            gObject.displayName = innerResponse.userInfo.profile.displayName;
                                    } else {
                                        gObject.userName = innerResponse.userInfo.login;
                                        gObject.displayName = innerResponse.userInfo.login;                                	
                                    }
                                    gObject.mailId =  innerResponse.userInfo.login;

                                    //Write a cookie to store the userID and update the signin type.
                                    if(gObject.userId != null){
                                        var cookieKey = "|login_type=mCastId|";
                                        setCookie(gObject.userId,cookieKey,12);
                                    }
                                    
                                    if(innerResponse.userInfo.profile.verificationStatus == "UNVERIFIED") {
                                        $("#verify_mailID").text(gObject.mailId);
                                        $("#verify_mailID").attr("original-title",gObject.mailId);
                                        $('#verify_mailID').tipsy(); 
                                    
                                        if(signUp === true)
                                            $("#verify_text1").text(i18n.txt.LABEL_EMAIL_NOT_BEEN_VERIFIED_FOR_SIGNUP );
                                    
                                        $("#verify_div").show();

                                        resize_divider ("#verify_inner_div");
                                        align_screen_footer ($("#verify_div").innerHeight());
										
                                        $("#vd1").focus();
                                        
                                        if(signUp === true)
                                        $("#signup_div").hide();
                                        
                                        $("#signin_div").hide();
                                        window.verifyView.resendVerify(true);
                                        $("#body_div").fadeTo("fast", 1.0);

                                    } else if(innerResponse.userInfo.profile.verificationStatus == "VERIFIED") {
                                        
                                        if(signUp === true){
                                            exitSpinner();
                                            $("#body_div").fadeTo("fast", 1.0);
                                            var label =  $("#lable_welcome_msg").text();
                                        
                                            if(gObject.displayName !== null || gObject.displayName !== undefined){

                                                var tempStr = unescape(gObject.displayName);
                                                var splitted = tempStr.split(" ");
                                                label = label + " " + splitted[0] + "!";
                                            }
                                            $("#lable_welcome_msg").text(label);
                                            $("#nac_email_id").text(gObject.mailId);
                                            $("#new_acc_confirmation_div").show();
                                            $("#signup_div").hide();

                                            resize_divider ("#new_acc_confirmation_div");
                                            align_screen_footer ($("#new_acc_confirmation_div").innerHeight());
                                        }else{
                                            launchSpinner(  i18n.txt.MSG_PLEASE_WAIT);
                                            var redirectUrl;
                                            if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                                                if(gObject.continueUrl.search('%3F') != -1 ){
                                                    redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                                                }else{
                                                    redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString;
                                                }
                                                window.open(unescape(redirectUrl),"_self");
                                            }
                                        }

                                    /*
                                        var redirectUrl;
                                        if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                                        if(gObject.continueUrl.search('%3F') != -1 ){
                                            redirectUrl = gObject.continueUrl+"&sso_token="+escape(gObject.authToken)+"&uid="+escape(gObject.userId);
                                        }else{
                                            redirectUrl = gObject.continueUrl+"?sso_token="+escape(gObject.authToken)+"&uid="+escape(gObject.userId);
                                        }
                                        window.open(unescape(redirectUrl),"_self");
                                        }
                                         */
                                    }
                               
                                }else if(innerResponse.error === "UM_INVALID_SESSION"){
                                    customAlert("INVALID_REQUEST",  i18n.txt.TITLE_ERROR,   i18n.txt.MSG_INVALID_PARAMS);
                                    exitSpinner();
                                } else {
                                    customAlert("INVALID_REQUEST",  i18n.txt.TITLE_ERROR,   i18n.txt.MSG_INVALID_DATA);
                                    exitSpinner();
                                // align_screen_footer ($('#body_div').innerHeight());
                                }
                            } else {
                                customAlert("NO_STATE",  i18n.txt.TITLE_ERROR,   i18n.txt.MSG_SERVICE_ERROR);
                                exitSpinner();
                            }
                        }
                    }
                };
                xhr.send();
            }

            return false;
        }
    });

    function refreshCaptchaView(){
        var captchaURL = $("#captchaImage").attr("src");
        captchaURL = captchaURL.replace(captchaURL.substring(captchaURL.indexOf("=")+1, captchaURL.length), Math.floor(Math.random()*9999999999));
        $("#captchaImage").attr("src", captchaURL);
    }

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

            $("#verification_required_div").hide();
            $("#body_div").fadeTo("fast", 1.0);
        },

        exitDialogBox: function () {
            $("#verification_required_div").hide();
            $("#body_div").fadeTo("fast", 1.0);
        }
    });
    
    var WelcomeSignupView = Backbone.View.extend({
        el: "#new_acc_confirmation_div",

        events: {
            "click #_bContinue": "redirectBackToCaller"
        },

        initialize: function() {
        },

        redirectBackToCaller: function() {
            launchSpinner(i18n.txt.MSG_PLEASE_WAIT);
            var redirectUrl;
            if((gObject.continueUrl != undefined) && (gObject.continueUrl != null)){
                if(gObject.continueUrl.search('%3F') != -1 ){
                    redirectUrl = gObject.continueUrl+"&sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString+"&email="+gObject.mailId;
                }else{
                    redirectUrl = gObject.continueUrl+"?sso_token="+escape(encodeURIComponent(gObject.authToken))+"&uid="+escape(gObject.userId)+"&locale="+gObject.langString+"&email="+gObject.mailId;
                    
                }
                window.open(unescape(redirectUrl),"_self");
            }
        }
    });
   
    var FooterView = Backbone.View.extend({
        el:"#footer",
    	
        events: {
            "click #footer_href_tos": "showTermsofService",
            "click #footer_href_privacy_policy": "showPrivacyPolicy"
        },
    	
        initialize: function() {
        },
    	
        showTermsofService: function(){
            openLegalLink();
        },
        
        showPrivacyPolicy: function(){
            openLegalLink();
        }
    
    });
   
    
    $(window).load(function () {
        window.loginView = new LoginView({
            model: new Credentials()
        });
        window.alertBox = new AlertBoxView();
        window.verifyView = new VerifyView();
    
        window.signupView = new SignupView({
            model: new SignUpCredentials()
        });
        window.forgotPasswordView = new ForgotPasswordView();
        window.changeEmailAddrView = new ChangeEmailAddressView();
        window.verificationReqView = new VerificationRequiredView();
        window.welcomeSignupView = new WelcomeSignupView();
        window.footerView = new FooterView();
        window.signInAccountView = new SigninAccountView();
        window.signupGoogleView = new SignupGoogleView();
        
        window.userConsentView = new UserConsentView();
        if(gObject.langString === "ko_KR" && gObject.appId === BOP_APPID) {
            //window.userConsentView.render();
        }
    });
});

