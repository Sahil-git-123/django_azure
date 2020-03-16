/**
 * @author Richa
 */
//Constants defined by chetan
 
 var HASH='#';
 var INDUSTRY_COLOR='215d4b';
 var TCCC_COLOR='bf0000';
 var PEPSICO_COLOR='004a97';
 var DANONE_COLOR='7030a0';
 var NESTLE_COLOR='00b0f0';
 var PVTLABEL_COLOR='548235';
 var REDBULL_COLOR='7f7f7f';
 var PEPPER_COLOR='ff7582';
 var OTHERS_COLOR='bf9000';
 var RED_COLOR='c00000';
 var GREEN_COLOR='507c33';
 var DARK_GREEN_COLOR='507c33';
//document.addEventListener('deviceready', onDeviceReady, false);
var url;
if(document.location.href == "" || document.location.href == "index.html?logout=true" ){
    url = "index.html";
}else {
    try{
        url = document.location.href.match(/[^\/]+$/)[0];
    }catch(e){
        url = "index.html";
    }
}
//alert(url);
//alert(localStorage.getItem('selected_process_id'));
//alert('URL : ' + url);
switch(url)
{
    case 'index.html' :
        //alert(localStorage.getItem('selected_process_id'));
        if(localStorage.getItem('selected_process_id')=="")
        {
            window.location='options.html';
        }
        else if(localStorage.getItem('selected_process_id')!=null)
        {
            sessionStorage.clear();//Added on 03-JUL-2019, Pratik. For redirecting to index page if user has closed the browser tab and reopened it.
            localStorage.clear();//Added on 03-JUL-2019, Pratik. For redirecting to index page if user has closed the browser tab and reopened it.
            window.location='index.html';//Added on 03-JUL-2019, Pratik. For redirecting to index page if user has closed the browser tab and reopened it.
            //window.location='chat.html';//Commented on 03-JUL-2019, Pratik.
        }
        break;
    case 'options.html' : 
        if(localStorage.getItem('selected_process_id')==null)
        {
            window.location='index.html';
        }
        else if(localStorage.getItem('selected_process_id')!="")
        {
            window.location='chat.html';
        }
        break;
    case 'chat.html' : 
        if(localStorage.getItem('selected_process_id')==null)
        {
            window.location='index.html';
        }
        else if(localStorage.getItem('selected_process_id')=="")
        {
            window.location='options.html';
        }
        else if( sessionStorage.getItem('id')!="" &&  sessionStorage.getItem('excel_data')==null) //Added on 03-JUL-2019, Pratik. For redirecting to index page if user has closed the browser tab and reopened it.
        {
            sessionStorage.clear();
            localStorage.clear();
            window.location='index.html';
        }
        break;
}
function onDeviceReady() {
	
};

var plotGraphs = [];
var logDetails =[]; //[{'msg_text' : 'hi', 'msg_time' : '2018-04-02 20.09.29', 'is_question' : 'true', 'response_time': 2}]
/* admin_dashboard */
var micCounter = 0, helpCounter = 0, likeCounter = 0, dislikeCounter = 0,exporttopptCounter = 0,profileupdateCounter = 0,themeupdateCounter = 0,quickaccessCounter = 0,
/*===================Code By Chetan=======================*/
request400Counter=0,
request404Counter=0,
request500Counter=0,
request504Counter=0,
/*===================End=======================*/
getVoice, idleTime = 0, togglevoice = false; 
var getMessageText, promptQuestion = '';
var tzoffset = (new Date()).getTimezoneOffset() * 60000;	
var pageFlag = 0;
var quesTag = [];

var yesWords = ["absolutely","affirmative","agree","all right","amen","aye","beyond a doubt","by all means",
				"certainly","definitely","even so","exactly","fine","gladly","good","granted","accept","good enough",
				"concur","guess","if you must","indubitably","just so","most assuredly","naturally","of course",
				"ofcourse","ok","okay","positively","precisely","right on","righto","sure thing","sure","surely","true",
				"undoubtedly","unquestionably","very well","whatever","willingly","without fail",
			        "ya","yea","yeah","yep","yes","yessir","yup","yes sir","yes sure","cool","go ahead",
				"yepp","please","yuh","proceed","hmm","totally","done","show"];
				
var noWords = ["disagree","no","uh-uh","nix","nope","nay","na","nah","no way","no way jose","negative","veto","out of question","false",
				"no sir","not likely","thumbs down","go fish","not","not really","never","no thanks","by no means",
				"nae","no indeed","naw","not","forget it","void","forbid","nothing","refuse","decline","turndown","pass","not now"];
				
var demoInferChange = {
	"Tom Awareness Of Revlon,Garnier In All Regions For Round 5":"TOM Awareness in Round 5 is highest for Revlon across all regions",
	"Tom Awareness Of Revlon,Avon,Garnier In All Regions For Round 5":"TOM Awareness in Round 5 is highest for Revlon across all regions",
	"Awareness of Avon in All Regions for Round 5":"Awareness of Avon is highest in Urban region at 33% in Round 5"
}; 


var demoQuesChange = {
"Tom Awareness is highest at 33% in the Metro region and lowest at 23% in the Rural region" : "<b>Would you like to see :</b> The TOM Awareness for Garnier, Revlon & Avon in all regions in Round 5?",
"TOM Awareness in Round 5 is highest for Revlon across all regions" : "<b>Whats next? Would you like to see:</b> What is the Spont Awareness for Avon in all regions for Round 5?",

"Penetration is highest at 46% in the Metro region and lowest at 29% in the Rural region" : "<b>Would you like to know :</b> What is the Penetration of Avon in all regions for Round 4?",                          

"Avon has the maximum Volume at 731.0 (000 kg) & Nivea has the minimum Volume at 91.0 (000 kg) in 2017Q4" : "<b>Would you like to know :</b> What is the Value of Avon, Olay & Nivea for all quarters?",
"Avon has maximum Value of 1143.0 (Million INR) in 2017Q4 & minimum Value of 567.0 (Million INR) in 2015Q3" : "<b>Whats next? Would you like to see :</b> What is the Average Price of Avon, Olay & Nivea from 2017q1 to 2017q4?",

"Indonesia has the highest Unit Sales at 2780('000) in  Sep17":"<b>Would you like to see :</b> What is the comparison of Unit Sales performance across countries in Sep17 for Skin Cleansing for Olay?",
"Indonesia has the highest Unit Sales at 854('000) in  Sep17":"<b>Would you like to know :</b> What is Volume Share percent of Indonesia in Sep17 across brands?",
"Biggest chunk is held by Avon at 21% in  Sep17":"<b>Would you like to know :</b> What is the relation between Volume Sales & Value Sales in Indonesia in Sep17 across brands?",

"Biggest chunk is held by Avon of 21% in MAT Sep17" : "<b>Whats next? Would you like to see:</b> What is Volume sales for Avon, Olay and Nivea brands from 2017Q1 to 2017Q3?",
"Avon has maximum Volume of 590.0 (000 kg) in 2017Q1 & minimum Volume of 311.0 (000 kg) in 2017Q3" : "<b>Would you like to know :</b> What is Penetration for Avon, Olay and Nivea brands from 2017Q1 to 2017Q3?",
"Avon has maximum Penetration of 5.52% in 2017Q1." : "<b>Would you like to see :</b> What is Unaided awareness trend for Avon, Olay and Nivea?",
"Unaided Awareness Of Nivea,Avon,Olay In Urban For  All Rounds" : "<b>Whats next? Would you like to see:</b> Tell me the trend of Current consumption of Avon, Olay and Nivea"
};

/* -- Previous Question
"Revlon has maximum Penetration 0.38% in 2017Q2." : "<b>Whats next? Would you like to see:</b> What is the Frequency for Revlon across all quarters in HHP?",
"Revlon has maximum Frequency 1.4 (trips) in 2017Q1." : "<b>Would you like to know :</b> What is Volume Share for sep17 in India across brands in RMS?",
"Biggest chunk is held by Avon of 27% in  Sep17" : "<b>Would you like to see :</b> What is Value Share for sep17 in India across brands in RMS?",
"Biggest chunk is held by Shiseido of 31% in  Sep17" : "<b>Whats next? Would you like to see:</b> What is Unaided Awareness of Revlon across All Rounds in Brandtrack?",
"Unaided Awareness is highest at 74% in Round 3" : "<b>Would you like to know :</b> What is Ever Used of Revlon across All Rounds in Brandtrack?"

*/


var idleInterval = setInterval(timerIncrement,60000); // 1 minute

 Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side, this.message_type = arg.message_type, this.divName = arg.divName, this.caption = arg.caption;
        this.draw = function (_this) {
            return function () {
                var $message;
                var curtime = formatAMPM(new Date());
                if(_this.message_side === 'right')
                {
                	$message = $($('#message_template_sender').clone().html());
                	$message.find('#text_place').html(_this.text);
                	$message.find('.message-time-sender').html(curtime);
                	
                }else if(_this.message_side === 'left' && _this.message_type === 'text'){
                	
                	$message = $($('#message_template_receiver_text').clone().html());
                	$message.find('#text_place').html(_this.text);
                	$message.find('.message-time-receiver').html(curtime);
                	
                }else if(_this.message_side === 'left' && _this.message_type === 'load'){
                	$message = $($('#message_template_receiver_text').clone().html());
                	//$message = $($('#message_template_receiver').clone().html());
                	$message.find('#text_place').html(_this.text);
                	//$message.find('#inference').html(_this.text);
                	$message.find('.receiver').attr('id',_this.divName);
                	$message.find('.receiver').addClass('loading_div');
                	$message.find('.message-time-receiver').html(curtime);
                	
                }else if(_this.message_side === 'left' && _this.message_type === 'graph'){                	
                    $message = $($('#message_template_receiver').clone().html());
                    $message.find('#inference').html(_this.text);
                    //$message.find('#caption').html(_this.caption);
                    //$message.find('.plotSpace').append('<canvas id="'+_this.divName+'"></canvas>');
                    if(_this.caption === 'map'){
                        $message.find('.plotSpace').remove();

                        $message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: auto; height: auto !important;");
                        //$message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: 60vw;");
                        $message.find('.wrapper_div').append('<div class="plotSpace" id="'+ _this.divName +'"></div>');
                    }else if(_this.divName.indexOf("table") != -1){
                        $message.find('.plotSpace').remove();
                        $message.find('.wrapper_div').removeAttr("style").attr("style","margin-bottom:30px;"); //.attr("style","position: relative; width: auto !important;");
                        $message.find('.wrapper_div').append('<div class="plotSpace" id="'+ _this.divName +'"></div>');
                        $message.find('.plotSpace').attr("style","position: relative; width: 100%; height: 100% !important; overflow-y:auto;"); //.addClass('table-responsive')
                    }else if(_this.caption === 'treemap'){ //Added on 20-FEB-2020, Pratik. 
                        $message.find('.plotSpace').remove();

                        $message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: auto; height: auto !important;");
                        //$message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: 60vw;");
                        $message.find('.wrapper_div').append('<div class="plotSpace" id="'+ _this.divName +'"></div>');
                    }
                    else if(_this.caption === 'waterfall'){ //Added on 20-FEB-2020, Nisha.
                        $message.find('.plotSpace').remove();

                        $message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: auto; height: auto !important;");
                        //$message.find('.wrapper_div').removeAttr("style").attr("style","position: relative; width: 60vw;");
                        $message.find('.wrapper_div').append('<div class="plotSpace" id="'+ _this.divName +'"></div>');
                    }
                    else{
                        $message.find('.plotSpace').attr('id',_this.divName);
                        $message.find('#caption').html(_this.caption);
                    }                	
                    //$message.find('.plotSpace').attr('width','600px');
                    $message.css('clear','both');
                    $message.find('.wrapper_div').removeClass('hidden');
                    //$message.find('.plotSpace').removeClass('hidden');
                    $message.find('.message-time-receiver').html(curtime);
                }
                //$('.messages').append($message);
                if(_this.message_type === 'graph' || _this.caption === 'answer'){
                        ////console.logquesTag);
                        var parentDiv;
                        $.each(quesTag, function(key,value){
							// console.log('key :',key);
							// console.log('value :',value);
							// alert('1');
							// console.log('value.infer :'+value.infer);
							// console.log('value.infer1 :'+_this.text);
                            if(value.infer === _this.text){
								//alert('l23');
                                parentDiv = value.divID;
                            }
                        });
                        //console.log('pdiv  :'+parentDiv);
                        ////console.log$("#"+parentDiv).length);
                        quesTag = quesTag.filter(function(e1) {
                            return e1.divID !== parentDiv;
                        });
                        ////console.logquesTag);
                        //$($message).insertAfter('#'+parentDiv);
                        $('#'+parentDiv).closest('.message-body').after($message);
                        $('#'+parentDiv).closest('.message-body').remove();
                        $message.closest('.message-body').attr('id',parentDiv);
                        //$('#'+parentDiv).closest('.message-main-receiver').remove();

                }else if(_this.message_type === 'text' && _this.divName != ""){
                    $('#'+_this.divName).after($message);
                }else{
                    $('.message .container #conversation').append($message);
                }
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
	};
/*=====Code By Chetan=========*/	

function InitSessionStorageCounters(id)
{
	var initialValue = {};
            initialValue.micCounter = 0;
            initialValue.helpCounter  = 0;
            initialValue.likeCounter = 0;
            initialValue.dislikeCounter = 0;
            initialValue.exporttopptCounter = 0;
            initialValue.profileupdateCounter = 0;
            initialValue.themeupdateCounter = 0;
            initialValue.quickaccessCounter  = 0;
            initialValue.request400Counter = 0;
            initialValue.request404Counter = 0;
            initialValue.request500Counter = 0;
            initialValue.request504Counter = 0;
		
	var initialString= JSON.stringify(initialValue);
		
	sessionStorage.setItem("log_"+id,initialString);
}	
function SetSessionStorageCounters(id,micCounter,helpCounter,likeCounter,dislikeCounter,exporttopptCounter,profileupdateCounter,themeupdateCounter,quickaccessCounter,request400Counter,request404Counter,request500Counter,request504Counter)
{
	var currentSessionObj=GetSessionStorageCounters(id);
	
	var sessionValue = {};
		sessionValue.micCounter = parseInt(currentSessionObj.micCounter)+micCounter;
		sessionValue.helpCounter  = parseInt(currentSessionObj.helpCounter)+helpCounter;
		sessionValue.likeCounter = parseInt(currentSessionObj.likeCounter)+likeCounter;
		sessionValue.dislikeCounter = parseInt(currentSessionObj.dislikeCounter)+dislikeCounter;
		sessionValue.exporttopptCounter = parseInt(currentSessionObj.exporttopptCounter)+exporttopptCounter;
		sessionValue.profileupdateCounter = parseInt(currentSessionObj.profileupdateCounter)+profileupdateCounter;
		sessionValue.themeupdateCounter = parseInt(currentSessionObj.themeupdateCounter)+themeupdateCounter;
		sessionValue.quickaccessCounter  = parseInt(currentSessionObj.quickaccessCounter)+quickaccessCounter;
		sessionValue.request400Counter = parseInt(currentSessionObj.request400Counter)+request400Counter;
		sessionValue.request404Counter = parseInt(currentSessionObj.request404Counter)+request404Counter;
		sessionValue.request500Counter = parseInt(currentSessionObj.request500Counter)+request500Counter;
		sessionValue.request504Counter = parseInt(currentSessionObj.request504Counter)+request504Counter;
	
	var sessionString= JSON.stringify(sessionValue);
	
	sessionStorage.setItem("log_"+id,sessionString);		
}	
function GetSessionStorageCounters(id)
{
	var sessionJson = JSON.parse(sessionStorage.getItem("log_"+id));
	return sessionJson;
}
/*=====End=========*/	

$("form.signin-form input").change(function(e) {  if($(this).val().trim().length==0) { $(this).parent().find('div.error').html($(this).attr('error')); } else { $(this).parent().find('div.error').html(''); } });
$('#signInBtn').on("click",function(event){
	event.preventDefault();
	var flag=false;
	var checkData = {};

	if($('#email').val().trim().length==0)
	{
        $('#email').parent().find("div.error").html($('#email').attr('error'));
        flag=true;
	}
    if($('#password').val().trim().length==0)
    {
        $('#password').parent().find("div.error").html($('#password').attr('error'));
        flag=true;
    }
    if(flag)
	{
		return false;
	}

    $("#loader").show();
    checkData.emailID = $('#email').val();
	checkData.password = $('#password').val();
	checkData.action = 'signIn';
	
	var response = autoresponse('api.php', checkData);
	////console.logresponse);
	if(response.status == 500){
		$('.signInResponse').text("Incorrect credentials. Please try again.");
	}
	else{
	    if($("#rememberme").is(":checked")==true)
        {
            set_cookie("email",response.email,365);
            set_cookie("password",checkData.password,365);
        }
        else
        {
            delete_cookie('email');
            delete_cookie('password');
		}
		var getFirstName ='';
		try
		{
                    var name=response.first_name.trim().split(' ');
                    getFirstName = name[0];
		}catch(e) { }
		
		sessionStorage.setItem('id',response.user_id);
		sessionStorage.setItem('excel_data','[]');
                localStorage.setItem('user_id',response.user_id); //Added on 02-JUL-2019, Pratik. For Auto Login.
		localStorage.setItem('first_name',getFirstName);
		localStorage.setItem('email',response.email);
		localStorage.setItem('userSessionID',Date.now());
		localStorage.setItem('python_ver',response.python_ver);
		/*===============Added By Chetan=================*/
        localStorage.setItem('process_ids',response.process_ids);
        localStorage.setItem('client_id',response.client_id);
        localStorage.setItem('client_logo',response.client_logo);
        localStorage.setItem('process_name',response.process_name);
        try {
            var process_ids=response.process_ids.split(',');
            if(process_ids.length==1)
            {
                localStorage.setItem('selected_process_id',process_ids[0]);
                
                InitSessionStorageCounters(process_ids[0]);
                InitSessionStorageLogDetails(process_ids[0]);
				
                window.location = 'chat.html';
            }
            else if(process_ids.length>1)
            {	
                for(var i=0;i<process_ids.length;i++){
                    InitSessionStorageCounters(process_ids[i]);
                    InitSessionStorageLogDetails(process_ids[i]);
                }					
                localStorage.setItem('selected_process_id',"");
                window.location = 'options.html';
            }
        }catch (e) {

        }

        /*=================   End   =================*/

	}
    $("#loader").hide();
	
});

$('.signOut').on("click",function(event){
	event.preventDefault();
	
	showFeedback();	
	var currentProcess = localStorage.getItem('selected_process_id');
	$("#confirm-modal .modal-body").html('Are you sure you want to end the session?');
    $("#confirm-modal #btn-yes").off('click');
    $("#confirm-modal #btn-yes").on('click',function(){
	if(currentProcess != ""){
            SetSessionStorageCounters(currentProcess,micCounter,helpCounter,likeCounter,dislikeCounter,exporttopptCounter,profileupdateCounter,themeupdateCounter,quickaccessCounter,request400Counter,request404Counter,request500Counter,request504Counter);
	}
    	$("#confirm-modal").hide();
            $("#loader").show();
            logout();
        });
	$("#confirm-modal").show();

});
/*====Code by chetan====*/
function logout()
{
	var response;
	var process_ids=localStorage.getItem('process_ids');
	process_ids = process_ids.split(',');
	if(process_ids.length==1){
            var postData = createLogEntryObject(localStorage.getItem('selected_process_id'));
            postData.action = "addLog";
            response = autoresponse('api.php', postData);
	}else if(process_ids.length>1){
		for(var i=0;i<process_ids.length;i++){
                    var postData = createLogEntryObject(process_ids[i]);
                    postData.action = "addLog";
                    response = autoresponse('api.php', postData);
		}
	}
			
	if(response.status == 500)
	{
		$("#loader").hide();
		$("#alert-modal .modal-body").html("We seem to have run into a problem while logging out. Please try again!");
		$("#alert-modal").show();
	}else 
	{
		//InitSessionStorageCounters(localStorage.getItem('selected_process_id'));
		localStorage.clear();
		sessionStorage.clear();
		window.location = './index.html?logout=true';
	   
	}
}

function createLogEntryObject(id){
		var obj=GetSessionStorageCounters(id);
		var postData = {};
		var tzoffset = (new Date()).getTimezoneOffset() * 60000;
		//var process_name=id;
		logDetails=GetSessionStorageLogDetails(id);
		postData.logged_user_id = sessionStorage.getItem("id");
		postData.pyResponse = JSON.stringify(logDetails);
		postData.sessionID = localStorage.getItem('userSessionID'); //Date.now();
		postData.recordDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
		postData.appName = id;
		postData.userID = localStorage.getItem("first_name");
		/*=====Code By Chetan=========*/
		postData.micCount = obj.micCounter;
		postData.helpCount = obj.helpCounter;
		postData.likeCount = obj.likeCounter;
		postData.dislikeCount = obj.dislikeCounter;
		postData.exporttopptCount = obj.exporttopptCounter; /* admin_dashboard */
		postData.profileupdateCount = obj.profileupdateCounter; 
		postData.themeupdateCount = obj.themeupdateCounter;	
		postData.quickaccessCount = obj.quickaccessCounter;	
		/*=====End=========*/	
		/*=====Code By Chetan=========*/	
		postData.request400Count = obj.request400Counter;
		postData.request404Count = obj.request404Counter;
		postData.request500Count = obj.request500Counter;
		postData.request504Count = obj.request504Counter;
		/*=====End=========*/	
		return postData;
}

/*====End====*/
$('#optionBack').on("click",function(event){
	var currentProcess = localStorage.getItem('selected_process_id');
	localStorage.setItem('selected_process_id',"");
	/*=====Code By Chetan=========*/
	////console.logrequest400Counter,request404Counter,request500Counter,request504Counter);
	
	SetSessionStorageCounters(currentProcess,micCounter,helpCounter,likeCounter,dislikeCounter,exporttopptCounter,profileupdateCounter,themeupdateCounter,quickaccessCounter,request400Counter,request404Counter,request500Counter,request504Counter);
	/*====End====*/
    window.location = 'options.html';
});

$('#forgotPwd').on('click',function(event){
	event.preventDefault();
	if($('#forgot_email').val().trim().length==0)
    {
        $('#forgot_email').parent().find("div.error").html($('#forgot_email').attr('error'));
        return false;
    }
    $("#loader").show();
    var setData = {};
    setData.emailID = $('#forgot_email').val();
    setData.action = 'forgotPwd';
    ////console.logsetData);
    var response = autoresponse('api.php', setData);
    ////console.logresponse);
    $("#loader").hide();
    if(response.status == 500){
        $("#alert-modal .modal-body").html(response.message);
        $("#alert-modal").show();
    }
    else{
        $("#alert-modal .modal-body").html(response.message);
        $("#alert-modal").show();
        var execPython = {};
        //execPython.emailID = $('#forgot_email').val();
        execPython.action = 'sendEmail';
        autoresponseAsync('api.php', execPython);
    }

	
});

firstMessage = function(){
	//onDeviceReady();
	var process_ids=localStorage.getItem('process_ids');
	process_ids = process_ids.split(',');
	if(process_ids.length==1){
		$('#signOutChat').removeClass('hidden');		
	}else if(process_ids.length>1){
		$('#optionBack').removeClass('hidden');
		$("#process_name").text(localStorage.getItem('process_name'));
		$('.processAlert').removeClass('hidden');		
	}	
	var d = new Date();	
	var firstName = localStorage.getItem('first_name');
	if(d.getHours()>4 && d.getHours()<=11){
            if(firstName == 'Demo'){
                sendMessage('Good Morning! Lets start this day, shall we?<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }else{
                sendMessage('Good Morning, '+ firstName +'! Lets start this day, shall we?<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }		
	}else if(d.getHours()>11 && d.getHours()<=15){
            if(firstName == 'Demo'){
                sendMessage('Good Afternoon! I am glad you are back.<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }else{
                sendMessage('Good Afternoon, '+ firstName +'! I am glad you are back.<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }
	}else if(d.getHours()>15 && d.getHours()<=22){
            if(firstName == 'Demo'){
                sendMessage('Good Evening! I am glad you are back.<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }else{
                sendMessage('Good Evening, '+ firstName +'! I am glad you are back.<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }
	}else if(d.getHours()>22 || d.getHours()<4){
            if(firstName == 'Demo'){
                sendMessage('Hello! Hope you had a lovely day!<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }else{
                sendMessage('Hello '+ firstName +'! Hope you had a lovely day!<br>How can I help you today? <img style="height:20px;" class="smiley" src="./tools/img/smiley.png" alt="Smiley face">','left','text','','');
            }
	}
    var question_session_key="q_p_"+localStorage.getItem('selected_process_id');
    var questions=sessionStorage.getItem(question_session_key);
    var pythonFile="python_"+localStorage.getItem('client_id')+"_"+localStorage.getItem('selected_process_id')+".py"
    if(questions!=null)
    {
        questions=questions.split('$$');
        $.each(questions,function(k,v){
            setTimeout(function(){ getBotResponse(v.trim(),pythonFile,false); },200);
        });
    }
	InitSessionStorageLogDetails(localStorage.getItem('selected_process_id'));
};

getMessageText = function () {
    var $message_input;
    $message_input = $('#comment');//$('.message_input');
    return $message_input.val();
};

sendMessage = function (text,message_side,message_type,graph_divname,caption) {	
	
    var $messages, message, loadMsg;
    contWord2='';
    if (text.trim() === '') {
        return;
    }	
    $messages = $('.messages');
    message = new Message({
        text: text,
        message_side: message_side,
        message_type: message_type,
        divName: graph_divname,
        caption: caption
    });
    ////console.logmessage);
    //alert("Came to sendMessage");
    message.draw();
    if(togglevoice == true){
    	setInterval(getVoice(text),10000);
    }   	
    
    var scroll = $('#conversation').scrollTop() + $('#conversation').height();
	$('.message').scrollTop(scroll+100);
	$('.message').height();
	
	if(message_side=='right'){
            $('#comment').val('');
            // Display your loading image (centered on your screen)
            //$('body').append("<img class='loading_img' style='top: 45%; position: absolute; height: 100px; width: 100px;background: black;left: 45%;' src='http://www.klk.com.my/wp-content/themes/klk/images/loading-ajax.gif'/>");
            var respDivID = Math.random().toString(36).slice(2);
            quesTag.push({
                ques: text.toLowerCase().replace(/jiffy/g, "").replace(/[']/gi, '').replace(/[^\w\s%]/gi, ' ').trim(),
                divID: respDivID
            });
            ////console.log('quewsrion ',quesTag);
            loadMsg =  new Message({
			text: '<img src="tools/img/loading.gif">',
            message_side: 'left',
            message_type: 'load',
            divName: respDivID, //'loading_div', 
            caption: ''
            });
            loadMsg.draw();
            $('.message').scrollTop(scroll+100);
            $('.message').height();
            getLoadingMessage();
	}else{
            //$('.loading_img').css('visibility', 'hidden');
            //$('.loading_div').closest('.message-main-receiver').remove();
            //$('.loading_div:last').closest('.message-main-receiver').remove();
	}
	
	return;
    
							
    //return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);   
};

getBotResponse = function(text,pythonFile,store){ //pythonFile='',store=true
	pythonFile = typeof pythonFile !== 'undefined' ? pythonFile : '';
  	store = typeof store !== 'undefined' ? store : true;
	//alert(text);
	sendMessage(text,'right','','','');		
	if(pythonFile=='')
	{
		//pythonFile="python_"+localStorage.getItem('client_id')+"_"+localStorage.getItem('selected_process_id')+".py"
		pythonFile="./myfirstsite/python_demo.py"
		//alert(pythonFile);
	}
	var Objectresponse = {
            "hi":"Hi! <br>How can I help you?",
            "hello":"Hello! <br>How can I help you?",
            "hey" : "hey!",
            "test":"just for test",
            "samplequestion" : "Here are a few SAMPLE Questions to get you started: <br>TOM all brands metro round 1<br>Unaided Awareness Fal metro all rounds<br>Purchase Occasion Share Olay all regions R4",
            "samplequestions" : "Here are a few SAMPLE Questions to get you started: <br><br>TOM all brands metro round 1<br>Unaided Awareness Fal metro all rounds<br>Purchase Occasion Share Olay all regions R4",
            "tomavonmurr2": {"kind": "bar", "prompt_ques": "Would you also like to ask : What is the Top Of Mind for Olay in Metro, Urban, Rural Round 2?", "title": "Top Of Mind of Avon in Metro,Urban,Rural for Round 2", "caption": "Base:Metro Round 2=183\nBase:Urban Round 2=159\nBase:Rural Round 2=93||", "ques": "tom avon mur r2", "xlabel": "", "file": "{'columns':['Avon'],'index':['Metro','Urban','Rural'],'data':[[27],[22],[25]]}", "ylabel": "Percentage", "infer": "Top Of Mind is highest at 27% in the Metro region and lowest at 22% in the Urban region"}
	};
	var modified_clientmsg=text.toLowerCase().replace(/jiffy/g, "").replace(/[']/gi, '').replace(/[^\w\s%]/gi, ' ').trim();
	var modified_clientmsg1=modified_clientmsg.replace(/ /g,"").trim();
	////console.logmodified_clientmsg);
	////console.logmodified_clientmsg1);
	
	/*if(promptQuestion != ''){
            if(yesWords.indexOf(modified_clientmsg) != -1 || modified_clientmsg.includes("yes ")){
                var pyReq = {};
                pyReq.question = promptQuestion.toLowerCase().substr(promptQuestion.indexOf(':')+1);//;
                pyReq.userID = localStorage.getItem('first_name');
                pyReq.action = "callPython";
                promptQuestion='';

                chatresponse('api.php', pyReq);			
            }else if(noWords.indexOf(modified_clientmsg) != -1 || modified_clientmsg.includes("no ")){
                sendMessage("Okay! Please ask me another question.",'left','text','','');
            }else{
                sendMessage("I'm Sorry! I didn't get you. Would you like to ask again?",'left','text','','');
            }
	}*/
	if(new RegExp(yesWords.join("\\b|\\b")).test(modified_clientmsg)){
		alert('tt');
            if(promptQuestion != ''){
                ////console.logmodified_clientmsg);
				alert('tt11');
                var pyReq = {};
                pyReq.text=promptQuestion.substr(promptQuestion.indexOf(':')+1);
                if(store) { InsertQuestionToSessionStorage(pyReq.text); }
                pyReq.question = promptQuestion.toLowerCase().substr(promptQuestion.indexOf(':')+1).trim();
                pyReq.staticques = promptQuestion.toLowerCase().substr(promptQuestion.indexOf(':')+1).trim();//Added on 18-SEP-2018, Pratik. Static Question stored in local Storage.
                pyReq.userID = localStorage.getItem('first_name');	
                pyReq.pythonFile = pythonFile;
                if(localStorage.getItem('python_ver') != 0){
                    pyReq.python_ver = localStorage.getItem('python_ver');
                }
                pyReq.action = "callPython";
                pyReq.store=store;
                promptQuestion='';
                ////console.logquesTag);
                $.each(quesTag, function(key,value){
					alert('2');
                    if(value.ques === modified_clientmsg){
                        value.ques = pyReq.question;
                    }
                });
                chatresponse('api.php', pyReq);
            }else{
                var parentDiv ="";
                ////console.logquesTag);
                 $.each(quesTag, function(key,value){
					 alert('3');
                    if(value.ques === modified_clientmsg){
                        parentDiv = value.divID;
                        if(store) { InsertQuestionToSessionStorage(modified_clientmsg); }

                    }
                });
                $('#'+parentDiv).closest('.message-body').remove(); 
                sendMessage("In the face of a problem, people say - 'Why Me?'<br> I say - 'Try me!' <br> <b>Go ahead! Ask me a Question!</b>",'left','text','','');
                quesTag = quesTag.filter(function(e1) {
                    return e1.divID !== parentDiv;
                });
            }				
	}else if(new RegExp(noWords.join("\\b|\\b")).test(modified_clientmsg) && modified_clientmsg.replace( /  +/g, ' ' ).indexOf("no of") == -1){
            promptQuestion='';
            var parentDiv ="";
            ////console.logquesTag);
             $.each(quesTag, function(key,value){
				 alert('4');
                if(value.ques === modified_clientmsg){
                    parentDiv = value.divID;
                    if(store) { InsertQuestionToSessionStorage(modified_clientmsg); }

                }
            });
            $('#'+parentDiv).closest('.message-body').remove();  
            sendMessage("Okay, may be not! Go on, ask me another question.",'left','text','','');
            quesTag = quesTag.filter(function(e1) {
                return e1.divID !== parentDiv;
            });
	}
	else if(modified_clientmsg === "help"){		
            var parentDiv ="";

            var helpString = "<br>";
            for(var i=0;i<helpTip.length;i++){
                helpString = helpString +"<li>"+ helpTip[i]+"</li>";
            }

            $.each(quesTag, function(key,value){
				alert('5');
                if(value.ques === modified_clientmsg){
                    parentDiv = value.divID;
                    if(store) { InsertQuestionToSessionStorage(modified_clientmsg); }
                }
            });
            $('#'+parentDiv).closest('.message-body').remove();  
            sendMessage("<b>TIPS!</b><br><br><b>Best Practices:</b><br><ul>" +helpString +"</ul>",'left','text','','');
            quesTag = quesTag.filter(function(e1) {
                return e1.divID !== parentDiv;
            });
            if(store!=false)
            {
                helpCounter = helpCounter + 1;
            }
            promptQuestion='';
	}else if(modified_clientmsg === "bye"){
            var parentDiv ="";
            ////console.logquesTag);
            $.each(quesTag, function(key,value){
				alert('6');
                if(value.ques === modified_clientmsg){
                    parentDiv = value.divID;
                    //if(store) { InsertQuestionToSessionStorage(modified_clientmsg); }
                }
            });
            $('#'+parentDiv).closest('.message-body').remove(); 
            sendMessage('Goodbye '+ localStorage.getItem('first_name') +'! Have a great day ahead!','left','text','','');
            quesTag = quesTag.filter(function(e1) {
                return e1.divID !== parentDiv;
            });
            promptQuestion='';	
            setTimeout(function(){			
                var process_ids=localStorage.getItem('process_ids');
                process_ids = process_ids.split(',');
                //$('#signOut').click();
                if(process_ids.length==1){
                        $('#signOutChat').click();		
                }else if(process_ids.length>1){
                        $('#optionBack').click();
                }
            }, 1000);
            //$('#signOut').click();
	}else if(Objectresponse[modified_clientmsg1]){
            var parentDiv ="";
            ////console.logquesTag);
             $.each(quesTag, function(key,value){
				 //alert('7');
                if(value.ques === modified_clientmsg){
					parentDiv = value.divID;
					//if(store) { InsertQuestionToSessionStorage(modified_clientmsg); }
                }
            });
            $('#'+parentDiv).closest('.message-body').remove(); 
            sendMessage(Objectresponse[modified_clientmsg1].replace(/%button/g,''),'left','text','','');
            quesTag = quesTag.filter(function(e1) {
                return e1.divID !== parentDiv;
            });
            //createResponse((Objectresponse[modified_clientmsg1]));
	}else{	
	alert('yy');
	alert(text);
            promptQuestion='';	
            if(text.length>0)
            {
                var pyReq = {};
                pyReq.text=text;
                //if(store) { InsertQuestionToSessionStorage(pyReq.text); }
                //pyReq.question = modified_clientmsg; //.replace(/[']/gi, '').replace(/[^\w\s]/gi, ' ');
               // pyReq.staticques = modified_clientmsg;//Added on 18-SEP-2018, Pratik. Static Question stored in local Storage.
				// alert('pyReq.staticques :'+pyReq.staticques);
                pyReq.pythonFile = pythonFile;
                //pyReq.userID = localStorage.getItem('first_name');
				//console.log('question :'+ question);
				//console.log('staticques :'+ staticques);
				console.log('pythonFile :'+ pythonFile);
				//console.log('userID :'+ userID);
                // if(localStorage.getItem('python_ver') != 0){
                    // pyReq.python_ver = localStorage.getItem('python_ver');
                // }
                // pyReq.store=store;
                pyReq.action = "callPython";
                //if(navigator.onLine){
                    //alert('online');
                chatresponse('api.php', pyReq);
                /*} else {
                    $("#loader").hide();
                $("#alert-modal .modal-body").html('Please check your internet connection!');
                $("#alert-modal").show();
                $('#loading_div').closest('.message-main-receiver').remove();
                sendMessage("Uh-oh! Due to internet disconnect, I couldn't retrieve the chart.",'left','text','','');
                } */
            }
	}
	
};

createResponse = function(pyResp,store){
    // alert("pyResp : " + pyResp);
	// console.log('pyResp :' +pyResp.file);
	if(pyResp !== null){
        if('error' in pyResp){
            var parentDiv = '';
            $.each(quesTag, function(key,value){
				alert('8');
                //if(value.ques === pyResp.ques){//Commented on 18-SEP-2018, Pratik.
                if(value.ques === pyResp.staticques){//Added on 18-SEP-2018, Pratik. Now compairing question with Statis Question.
                //if(value.ques.trim() === pyResp.ques.toLowerCase().trim()){
                    parentDiv = value.divID;
                    value.infer = pyResp.error;
                }
            });
            //alert ("Parent Div 1 : " + parentDiv);
            sendMessage(pyResp.error,'left','text','','answer');
            if('prompt_ques' in pyResp){
                if(pyResp.prompt_ques != ''){
                    promptQuestion = pyResp.prompt_ques;
                    sendMessage(promptQuestion,'left','text',parentDiv,'');
                }
            }
        }else if(!('file' in pyResp)){
                var parentDiv ="";
                //console.log"Ques Tag : " + quesTag);
                $.each(quesTag, function(key,value){
					alert('9');
                //if(value.ques === pyResp.ques){//Commented on 18-SEP-2018, Pratik.
                if(value.ques === pyResp.staticques){//Added on 18-SEP-2018, Pratik. Now compairing question with Statis Question.
                    //if(value.ques.trim() === pyResp.ques.toLowerCase().trim()){
                        parentDiv = value.divID;
                        value.infer = pyResp.caption;
                    }
                });
                //alert ("Parent Div 2 : " + parentDiv);
                sendMessage(pyResp.caption,'left','text','','answer');
                if('prompt_ques' in pyResp){
                    if(pyResp.prompt_ques != ''){
                        promptQuestion = pyResp.prompt_ques;
                        sendMessage(promptQuestion,'left','text',parentDiv,'');
                    }
                }
        }else if('file' in pyResp){
				// console.log("checking: " + pyResp.hasOwnProperty('prompt_ques'));
                // sendMessage("Call chart js",'left','graph','');
                //sendMessage("Call chart js",'left','graph','');
				//console.log('demoInferChange :' +pyResp.infer);
				if(demoInferChange[pyResp.infer]){
					pyResp.infer = demoInferChange[pyResp.infer];
                }
                if(pyResp.hasOwnProperty('prompt_ques') && localStorage.getItem('selected_process_id') == '6'){
					if(demoQuesChange[pyResp.infer]){
                        pyResp.prompt_ques = demoQuesChange[pyResp.infer];
                    }
                }
				plotGraph(pyResp,store);				
        }else{
			var parentDiv = "";
            $.each(quesTag, function(key,value){
				alert('10');
                //if(value.ques === pyResp.ques){//Commented on 18-SEP-2018, Pratik.
                if(value.ques === pyResp.staticques){//Added on 18-SEP-2018, Pratik. Now compairing question with Statis Question.
                //if(value.ques.trim() === pyResp.ques.toLowerCase().trim()){
                    parentDiv = value.divID;
                    //value.infer = pyResp.error;
                }
            });
            //alert ("Parent Div 3 : " + parentDiv);
            sendMessage("I'm not sure I understand. Curious about what I can do for you?<br>Check out the tips sections on the left sidebar.","left","text","","answer");
        }
    }else{
        var parentDiv = "";
        $.each(quesTag, function(key,value){
			alert('11');
            //if(value.ques === pyResp.ques){//Commented on 18-SEP-2018, Pratik.
            if(value.ques === pyResp.staticques){//Added on 18-SEP-2018, Pratik. Now compairing question with Statis Question.
            //if(value.ques.trim() === pyResp.ques.toLowerCase().trim()){
                parentDiv = value.divID;
                //value.infer = pyResp.error;
            }
        });
        //alert ("Parent Div 4 : " + parentDiv);
        sendMessage('Sorry! Im a little buggy <i class="fa fa-bug"></i> <br> My engineers will be disappointed to hear that.','left','text','','answer');
        //'Oops! I cant seem to find the answer you are looking for...I shall look into it. Would you like to ask something else?  '
    }
};

$('.jiffy-icontips, #glossary_tips').on('click', function(){
	$(".test-close1").click();
	$("#help-modal").show();
});

$('.jiffy-iconsend').on('click', function(event) {
	event.preventDefault();
    return getBotResponse(getMessageText());
});
$('#comment').keypress(function(e) { 	
    if (e.which === 13) {
    	e.preventDefault();
	//event.preventDefault();
    	return getBotResponse(getMessageText());
    }
});
function getViewport() {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
        viewPortHeight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
     else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
        viewPortHeight = document.documentElement.clientHeight
    }

    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewPortWidth, viewPortHeight];
}

$('#exportToPPT i.fa-download').on('click',function(event){
	event.preventDefault();
      //  console.log('inside the export');
	if(logDetails.length == 0){
        //$("#loader").hide();
	    $("#alert-modal .modal-body").html('No charts to export!');
	    $("#alert-modal").show();
	}
	else{
	    /* admin_dashboard */
	    exporttopptCounter = exporttopptCounter + 1;
            $("#loader").show();
			console.log('logDetails',logDetails);
            setTimeout(function(){
		genPPT(logDetails);
	    },500);
		
	}
});

/*admin_dashboard*/
$('#quickaccess').on('click',function(event){
	event.preventDefault();	
	quickaccessCounter = quickaccessCounter +1;
});

$('#conversation').on('click','.jiffy_like, .jiffy_dislike' ,function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    }else {
      	var curInference = $(this).parents('.like-wrapper').find('#inference').html();
      	
      	$(this).parents('.like-wrapper').find('.jiffy_dislike').removeClass('active');
        $(this).parents('.like-wrapper').find('.jiffy_like').removeClass('active');

        $(this).addClass('active');       

        var divname = $(this).closest('.message-text-receiver').find('.plotSpace').attr('id');
        var btn_type = $(this).attr('id');
        if(btn_type === 'like_btn'){
            /*$("#alert-modal .modal-body").html('Thank you, '+ localStorage.getItem('first_name') +'!');
            $("#alert-modal").show();*/
            likeCounter++;
            logDetails.forEach(function(key,value){
                //if(key.divName == divname){ commented on 9/May/18  - since maps are not getting caught - admin_dashboard
                if(key.divName.includes(divname)){
                    key.isLiked = 1;
                    key.isDisliked = 0;
                }
            });
        }
        if(btn_type === 'dislike_btn'){   
            $("#dislike-modal #dislikeFeedback").val('');
            $("#dislike-modal .modal-body").find("#noTextAlert").hide();

            $("#dislike-modal #quesDiv").html(divname);
            $("#dislike-modal #dislikedInference").html(curInference); 	
            $("#dislike-modal").show();

            dislikeCounter++;

            logDetails.forEach(function(key,value){
                //if(key.divName == divname){ commented on 9/May/18  - since maps are not getting caught - admin_dashboard
                if(key.divName.includes(divname)){
                    key.isLiked = 0;
                    key.isDisliked = 1;
                }
            });
        }
    }
});

$("#dislike-modal #btn-confirm").on('click' , function(){ 
	////console.log$('#dislikeFeedback').val().trim().length);
	if($('#dislikeFeedback').val().trim().length > 0){
		var ogInfer = $("#dislikedInference").html();
		var userInfer = $("#dislikeFeedback").val();
		var question = '';
		var divname = $("#dislike-modal #quesDiv").html();
		
		logDetails.forEach(function(key,value){
                    if(key.divName.includes(divname)){
                        question = key.msg_text;
                    }
		});
		
		var inferSuggest = {};
 		inferSuggest.sessionID = localStorage.getItem('userSessionID');
 		inferSuggest.userEmail = localStorage.getItem('email');
 		inferSuggest.quesText = question;
		inferSuggest.userText = userInfer;
		inferSuggest.ogInfer = ogInfer;
		inferSuggest.client_id = localStorage.getItem('client_id');
		inferSuggest.process_id = localStorage.getItem('selected_process_id');
		inferSuggest.recordDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
		inferSuggest.action = 'inferSuggest';	
		var response = autoresponse('api.php', inferSuggest);
		if(response.status == 200){
                    $("#dislike-modal").hide();
                    $("#alert-modal .modal-body").html('Thank you for your help, '+ localStorage.getItem('first_name') +'!');
		    $("#alert-modal").show();
                }else{
                    $("#alert-modal .modal-body").html('Oops! Something went wrong. Please try again!');
                    $("#alert-modal").show();
                }
    }else{
        $("#dislike-modal .modal-body").find("#noTextAlert").show();
    }
});
/*--------------Export to excel---------------------------*/
$('#conversation').on('click','.exportToExcel' ,function (event) 
{	
	var chartdivName = $(this).closest('.message-text-receiver').find('.plotSpace').attr('id');
	
	var sessionExcelData = GetSessionStorageExcelData();
	//alert (sessionExcelData);
	for(var i=0; i<sessionExcelData.length;i++){
            if(chartdivName in sessionExcelData[i]){
                ////console.logsessionExcelData[i][chartdivName]);
                saveFile(sessionExcelData[i][chartdivName]);
                break;
            }
	}
});	
function GetSessionStorageExcelData()
{
	var data=sessionStorage.getItem("excel_data");
	return JSON.parse(data);
}
function SetSessionStorageExcelData(row)
{
    var data=GetSessionStorageExcelData();
    data.push(row);
    var data=sessionStorage.setItem("excel_data",JSON.stringify(data));
}

function formatjson(divName, jsdata)
{
	var monthQuarter = {
	  	3: "Q1",
	  	6: "Q2",
	  	9: "Q3",
	  	12: "Q4"
	};
	var results =[];
	output = {};	
	var fileContent = JSON.parse(jsdata.file.replace(/'/g,'"'));
	var ci = fileContent.columns;
	var fi = fileContent.index;
        //console.log('Chart Type : ' + jsdata.kind);
        //console.log('Data Value : ' + fileContent.datavalue);
    var datavalue = fileContent.datavalue; // added by nisha to get datavalue of waterfall chart
	var da = fileContent.data;
	
	
	var max = da[0][0], min = da[0][0];

	var chartType = jsdata.kind;
	////console.log'da',da,'chartType',chartType);
	//code by chetan : add bubble data into excel file 
	if(chartType==='bubblebar' || chartType==='bubblebarh')
	{
            var bd = jsdata.bubble_data;
            //fileContent.columns.push('Chg vs PY');
            var colarr=[];
            for(i=0;i<ci.length;i++)
            {
                colarr.push(ci[i]);
                colarr.push(ci[i]+'- Chg vs PY');			
            }
            ci=colarr;
            var valarr=[];
            var bdcnt=0;
            for(i=0;i<da.length;i++)
            {
                tmp=[];
                for(j=0;j<da[i].length;j++)
                {
                    tmp.push(da[i][j]);
                    tmp.push(parseFloat(bd[bdcnt]));
                    bdcnt++;
                }
                valarr.push(tmp);
            }
            da=valarr;
	}
	// End 
	for (var i = 0; i < da.length; i++) // Loop for no of rows 
	{	
            if(chartType === 'map'){
                output[''] = fi[i][0];
            }else if(chartType==='waterfall') /*added by nisha for waterfall excel */
            {
                output[''] = datavalue[i];
            }else if(chartType==='treemapgoogle') /*Added on 20-FEB-2020, Pratik.For Tree Map Excel */
            {
				output[''] = datavalue[i];
            }else if(chartType === 'table'){
                    output[''] = i+1;
            }else if(jsdata.xlabel.trim().toLowerCase() == "quarter"){ //added condition for python anamoly in HHP Process
                //if(fi[i] !== null && typeof fi[i] === 'object')
                output[''] = fi[i]['qyear']+ " " + monthQuarter[fi[i]['month']];
            }else{
                output[''] = fi[i]; // Code  for first column of the first rows should be blank (Index)	
            }		
            for (var j = 0; j < ci.length; j++)  // Loop for the no of columns (Columns)
            {
                var t;
                if(jsdata.xlabel.trim().toLowerCase() == "brand"){ //Added condition for python anamoly in HHP Process
                    t = jsdata.ylabel;
                }else{
                    t = ci[j];//Variable to store column name				
                }
                //var t= ci[j];
                output[t] = da[i][j]; //code to store data under the columns(Data)

                if(da[i][j] < min){
                    min = da[i][j];
                }else if(da[i][j] > max){
                    max = da[i][j];
                }
            }
            //output['bubble_data']=bd[i];
            var st = JSON.stringify(output);
            var stp = JSON.parse(st);
            results.push(stp);
	}

	var row = {};
	row[divName] = results;
	
	 if(jsdata.ylabel.toLowerCase().indexOf("percent") !== -1){
	  	if((1.2 * max) > 100){
	  		max = 82;
	  	}
	  	if((0.8 * min) < 0){
	  		min = 0;
	  	}
	 }else{
	 	max =  1.2 * max;
	 	min = 0.8 * min;
	 }
	
	//logDetails.forEach(function(key,value){ });
	for(var l=0;l<logDetails.length;l++){
		key = logDetails[l];
		if(key.divName === divName){
			key.kind = chartType;
			key.data = da;
			key.index = fi;
			key.columns = ci;
			key.xlabel = jsdata.xlabel;
			key.ylabel = jsdata.ylabel;
			key.title = jsdata.title;
			key.max = max;
			key.min = min;			
			if('process' in jsdata){				
				key.process = jsdata.process;
			}
			break;
		}		
	}	
	//console.log'row',row);
	SetSessionStorageExcelData(row);
};

	
function saveFile (datarr) {
	var data1 = datarr;
	var opts = [{sheetid:'Sheet1',header:true}];
	var res = alasql('SELECT * INTO XLSX("jiffyData.xlsx",?) FROM ?',[opts,[data1]]);
};

/*-------------Export to excel----------------------------*/


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
};


addToLogs = function(msg_text, msg_infer, divName, jCaption){
	var row={
		msg_text: msg_text,
		msg_time: (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' '),
		is_question: "true",
		response_time: 0,
		msg_inference: msg_infer,
		msg_caption: jCaption,		
		divName: divName,
		isLiked: 0,
		isDisliked: 0,
		processID: localStorage.getItem('selected_process_id')
	};
	logDetails.push(row);
	SetSessionStorageLogDetails(localStorage.getItem('selected_process_id'),row);
};

function InitSessionStorageLogDetails(id)
{
	sessionStorage.setItem("logDetails_"+id,"[]");
}
function GetSessionStorageLogDetails(id)
{
	var data=sessionStorage.getItem("logDetails_"+id);
	return JSON.parse(data);
}
function SetSessionStorageLogDetails(id,row)
{
	var data=GetSessionStorageLogDetails(id);
	data.push(row);
	var data=sessionStorage.setItem("logDetails_"+id,JSON.stringify(data));
}
/*------------PlotGraph----------------------------*/
/*-------------------------------------------------*/


/*------Function to evoke reading of text---------*/
getVoice = function (text) {
	////console.logtext);
		return VoiceRSS.speech({
		key: '8c7d12f9faee498494438c1200ba6930',
		src: text,
		hl: 'en-us',
		r: 0, 
		c: 'mp3',
		f: '44khz_16bit_stereo',
		ssml: false
		});
};	
/*------Function for handling messages that appear at the time of loading---------*/
function getLoadingMessage(){
	setTimeout(function(){
    	$('#loading_div').find("#text_place").html("This might take a few seconds.")
	}, 3000);
	
	if ($('#loading_div').length){
		setTimeout(function(){
	    	$('#loading_div').find("#text_place").html('<img src="tools/img/loading.gif">')
		}, 5000);
	}
	if ($('#loading_div').length){
		setTimeout(function(){
	    	$('#loading_div').find("#text_place").html("Thank you for your patience.")
		}, 5000);
	}
	if ($('#loading_div').length){
		setTimeout(function(){
	    	$('#loading_div').find("#text_place").html('<img src="tools/img/loading.gif">')
		}, 5000);
	}
	
}

/*------------function to keep track of idle time----------------------*/
function timerIncrement() {
		idleTime = idleTime + 1;			
		if (idleTime > 15) { // 20 minutes
			$('#signOut').click();
		}else if(idleTime === 10){
			//sendMessage('Knock, knock?','left');
			sendMessage('Hey '+ localStorage.getItem('first_name') +', are you there?','left','','');
		}	
}
/*------------function for pause----------------------*/
function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

//make idle timer Zero on mouse movement.
$(document).mousemove(function (e) {
    //alert("Inside mouse move");
    idleTime = 0;
});

$(document).keypress(function (e) {
    idleTime = 0;
});	

/*CODE OF AAKASH*/
$('#formupdateprofile').submit(function(event){ //Code to update profile
    ////console.log"Submit");
    event.preventDefault();
    /* admin_dashboard*/
    profileupdateCounter = profileupdateCounter + 1;
	
    var flag=false;
    var checkData = {};

    if($('#nickname').val().trim().length==0)
    {
        $('#nickname').parent().find("div.error").html($('#nickname').attr('error'));
        flag=true;
    }
    if($('#mobile').val().trim().length==0)
    {
        $('#mobile').parent().find("div.error").html($('#mobile').attr('error'));
        flag=true;
    }
    /*if($('#language').val().trim().length==0)
    {
        $('#language').parent().find("div.error").html($('#language').attr('error'));
        flag=true;
    }*/
    if($('#company').val().trim().length==0)
    {
        $('#company').parent().find("div.error").html($('#company').attr('error'));
        flag=true;
    }
    if(flag)
    {
        return false;
    }
    $("#loader").show();
    setTimeout(function() {
        checkData.email = localStorage.getItem('email');
        checkData.nickname = $('#nickname').val();
        checkData.mobile = $('#mobile').val();
        checkData.language = '';
        checkData.company = $('#company').val();
        checkData.action = 'updateProfile';
        var response = autoresponse('api.php', checkData);
        ////console.logresponse);
        $('#msg').html(response.error);
        $("#msg").show().delay(5000).fadeOut();
        $("#loader").hide();
    },100);
});
/*$('#updpanel').on("click",function(){
	
	var checkData = {};
	checkData.action = 'getProfile';
	if(!($('#nickname').val()))
	{
		var response = autoresponse('api.php', checkData);
		if(response.status == 200)
		{
			$('#nickname').val(response.nickname);
			$('#mobile').val(response.mobile);
			$('#language').val(response.lang);
			$('#company').val(response.company);
		}
		else
		{
			$('#msg').html(response.error);
		}
	}
	else
	{
		return false;
	}
	
});*/
$('#saveimg').on("click",function(){
	
	var checkData = {};
	var imgsrc = $('.result').attr('src');
	////console.log"the img src is "+imgsrc);
	checkData.pic = imgsrc;
	checkData.action = 'updateProfilePic';
	var response = autoresponse('api.php', checkData);
	$('#msgpic').html(response.error);
	$("#msgpic").show().delay(5000).fadeOut(); 
	$('#mpic').attr('src', imgsrc); //main profile pic
	$('#hpic').attr('src', imgsrc); //header pic
	$('.jiffy-iconsender-icon').attr('src', imgsrc);
});

function getProfiledetails()
{
	var checkData = {};
	checkData.action = 'getProfile';
	checkData.email = localStorage.getItem('email');
	var response = autoresponse('api.php', checkData);
	////console.logresponse);
	//alert("OK!");
	if(response.status == 200)
	{
        $('#nickname').val(response.nickname);
        $('#mobile').val(response.mobile);
        $('#language').val(response.lang);
        $('#company').val(response.company);
		$('#mpic').attr('src', response.pic); //main profile pic
		$('#hpic').attr('src', response.pic); //header pic
		$('.jiffy-iconsender-icon').attr('src', response.pic); //
		$('.profile-name').html(response.firstname);
		$('#cpemail').val(response.email);
		var lcss = localStorage.getItem("css");
		////console.loglcss);
		if(lcss == 'light')
		{
			$('link[href="tools/css/dark.css"]').attr('href','tools/css/light.css');
			localStorage.setItem("css", "light");
			$('input:radio[id=light]').prop('checked', true);
		}
		else if(lcss == 'dark')
		{
			$('link[href="tools/css/light.css"]').attr('href','tools/css/dark.css');
			localStorage.setItem("css", "dark");
			$('input:radio[id=dark]').prop('checked', true);
		}else{
			$('link[href="tools/css/dark.css"]').attr('href','tools/css/light.css');
			localStorage.setItem("css", "light");
			$('input:radio[id=light]').prop('checked', true);
		}
	}
	else
	{
		window.location = 'index.html';
	}
}
$("input[name='optradio']").change(function(){
    /*admin_dashboard*/
	themeupdateCounter = themeupdateCounter + 1;
    
    var rcss = $(this).val();
    ////console.logrcss);
    if(rcss == 'light')
    {
		$('link[href="tools/css/dark.css"]').attr('href','tools/css/light.css');
		localStorage.setItem("css", "light");
	}
	else
	{
		$('link[href="tools/css/light.css"]').attr('href','tools/css/dark.css');
		localStorage.setItem("css", "dark");
	}
});

$('#form-change-pass').submit(function(event){ //Code to update profile
               ////console.log"Submit");
                event.preventDefault();
                var flag=false;
				var checkData = {};
				if($('#npassword').val().trim().length==0)
				{
					$('#npassword').parent().find("div.error").html($('#npassword').attr('error'));
					flag=true;
				}else if($('#npassword').val().trim().length<6)
                {
                    $('#npassword').parent().find("div.error").html('Password length must be between 6-20 charters.');
                    flag=true;
                }

				if($('#cpassword').val().trim().length==0)
				{
					$('#cpassword').parent().find("div.error").html($('#cpassword').attr('error'));
					flag=true;
				}
				else if($('#npassword').val()!= $('#cpassword').val())
				{
                    $('#cpassword').parent().find("div.error").html("Passwords doesn't match");
                    flag=true;
				}
				if(flag) { return false; }
				$("#loader").show();
				setTimeout(function(){
                    checkData.email = localStorage.getItem('email');
                    checkData.npassword = $('#npassword').val();
                    checkData.cpassword = $('#cpassword').val();
                    checkData.action = 'changePassword';
                    var response = autoresponse('api.php', checkData);
                    $('#pmsg').html(response.error);
                    $("#pmsg").show().delay(5000).fadeOut();
                    $("#loader").hide();
				},100);

    			//

                
});


/*EOF CODE OF AAKASH*/


$(document).ready(function(e) {
    $("#loader").hide();
    $("#confirm-modal #btn-no").click(function(){  $("#confirm-modal").hide(); });
    $("#alert-modal #btn-ok").click(function(){  $("#alert-modal").hide(); });
    $("#dislike-modal #btn-cancel").click(function(){   $("#dislike-modal").hide(); });
    $("#dislike-modal #dislikeFB_modal-close").click(function(){   $("#dislike-modal").hide(); });
    $("#feedback-modal #feedback_modal-close").click(function(){ $("#feedback-modal").hide(); });
    $("#feedback-modal #btn-cancel").click(function(){ $("#feedback-modal").hide(); });
    $(".conversation").tooltip({ selector: '[data-toggle=tooltip]' });
    $('[data-toggle="tooltip"]').tooltip();
    $("#help-modal #btn-ok").click(function(){  $("#help-modal").hide(); });
	
    $("#mobile").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    var url;
    if(document.location.href == "" || document.location.href == "index.html?logout=true" ){
        url = "index.html";
    }else {
        try{
            url = document.location.href.match(/[^\/]+$/)[0];
        }catch(e){
            url = "index.html";
        }

    }
    if(url=='chat.html')
	{
        getProfiledetails();

	}
	
	$("#imagecrop-close").click(function(){ $("#imagecrop").hide(); $(".modal-backdrop").hide();  });
	//$("form.signin-form").validate();
});

var $star_rating = $('.star-rating .fa');

var SetRatingStar = function() {
  return $star_rating.each(function() {
    if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
      return $(this).removeClass('fa-star-o').addClass('fa-star');
    } else {
      return $(this).removeClass('fa-star').addClass('fa-star-o');
    }
  });
};

$star_rating.on('click', function() {
  $star_rating.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar();
});

function showFeedback(){ //$("#showFB").on('click',
	var date2 = new Date();	
	var fbData = {};
	fbData.emailID = localStorage.getItem('email');
	fbData.clientID = localStorage.getItem('client_id');
	fbData.action = 'feedbackDate';
	var fbResponse = autoresponse('api.php', fbData);
	//console.logfbResponse);
	var date1 = new Date(fbResponse);
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	//console.logdiffDays);	
	if(diffDays >= 30){
		//console.log"hello");
		$("#feedback-modal .modal-body").find("#noFeedbackTextAlert").hide();	
		SetRatingStar();
		$("#feedback-modal").show();
	}	
};




$("#feedback-modal #btn-confirm").on('click' , function(){ 
    if($('#ratingValue').val() != 0){
        var userRating = $("#ratingValue").val();
        var userFbText = $("#feedback-modal #userFeedbackText").val();		
        ////console.loguserRating +" : "+userFbText);
        var userFb = {};
            userFb.rating = userRating;
            userFb.comment = userFbText;
            userFb.userID = localStorage.getItem('email');
            userFb.createdon = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
            userFb.clientID = localStorage.getItem('client_id');
            userFb.action = 'userFeedback';
        var feedbackResp = autoresponse('api.php', userFb);
        if(feedbackResp.status == 500){
            //$("#feedback-modal").hide();
            $("#alert-modal .modal-body").html('Oops! Something went wrong. Please try again!');
            $("#alert-modal").show();   
        }else{	    
            $("#feedback-modal").hide();
            $("#alert-modal .modal-body").html('Thank you for your feedback, '+ localStorage.getItem('first_name') +'!');
            $("#alert-modal").show();
            /*logout();
            $("#confirm-modal").show();*/ 
        }
    }else{
        $("#feedback-modal .modal-body").find("#noFeedbackTextAlert").show();
  }
});


/*----------------Interactive Chart--------------------*/
/*-----------------------------------------------*/
function genPPT(response){
   console.log('respo1',response);
    var bsw_logo_path       = './tools/img/ppt_bsw_logo.png';
    //var bkgd_img_path     = './tools/img/ppt_bkgd_coke.jpg';
    var coke_bkgd_path      = './tools/img/ppt_bkgd_coke.jpg';
    var coke_sideimg_path   = './tools/img/ppt_sidebar_coke.png';
    var coke_logo_path      = './tools/img/ppt_corner_coke.png';

    //alert('Krishna Inside genPPT');	
    /*var pptColors =	[   '5cbae6','b6d957','fac364','8cd3ff','d998cb','f2d249','93b9c6',
                            'ccc5a8','52bacc','dbdb46','98aafb','005b96','4357a3','c3daf2',
                            '6497b1','03396c','011f4b','b3cde0','5a9bd2','495a80','ed9845',
                            '352440','7cb1c5','766e9a','99ccff','556677','223366','3366aa','d84951'];
    */
    /*var pptColors = ['#E51C2A','#F89F1E','#2D2E31','#31B828','#B22222','#B43757',
                    '#F37021','#6A997A','#28AC69', '#BA5F21','#6A997A', '#00000','#a06b6b','#ea7272'];*/
     /* Jiffy Coke Category codes, Old Color Schemes.
    var pptColors = ['e51C2a','f89f1e','2d2e31','31b828','b22222','b43757',
                    'f37021','6a997a','28aC69', 'ba5f21','6a997a', '00000','a06b6b','ea7272'];
    */
    /* Added on 01-OCT-2018, Pratik. Jiffy Coke Category codes, New Color Scheme. Starts Here. */
    /*var pptColors = ['FF0000','C0C0C0','FF6600','FF9900','F2F2F2','993300',
                    'FF6899','99CC00','0000FF', 'CCFFFF','70303C', '00FF00','FFFF99','FF99CC','FF9DA7'];//Category Code*/
    //var pptColors = ['c00000','004a97','5b8abd','737f85','d6dce5','ee3c47','c2002e','02b27C','595959'];//Manufacture Code
    //var pptColors = [INDUSTRY_COLOR,'004a97','7030a0','00b0f0','507c33','7f7f7f','ff7582','bf9000','595959'];//Added on 04-OCT-2018, Pratik. Manufacture Code
    pptColors=[];
    pptColors.push(INDUSTRY_COLOR);
    pptColors.push(TCCC_COLOR);
    pptColors.push(PEPSICO_COLOR);
    pptColors.push(DANONE_COLOR);
    pptColors.push(NESTLE_COLOR);
    pptColors.push(PVTLABEL_COLOR);
    pptColors.push(REDBULL_COLOR);
    pptColors.push(INDUSTRY_COLOR);
    pptColors.push(OTHERS_COLOR); 

    var newColor2 = [];
    /* Jiffy Coke Category codes, New Color Scheme. Ends Here. */
    
    var process_name=localStorage.getItem('process_name');
    var client_id=localStorage.getItem('client_id');
    var process_id=localStorage.getItem('selected_process_id');

    //var presentation_name = process_name.toUpperCase() +"_Analysis_"+client_id+"_"+process_id;//Commented on 17-OCT-2018, Pratik. As per Satish G. Change Request.
    var presentation_name = "Global Market Share Report";//Added on 17-OCT-2018, Pratik. As per Satish G. Change Request.
    ////console.logpresentation_name);
    var pptx = new PptxGenJS();

    pptx.setLayout('LAYOUT_WIDE');

    pptx.defineSlideMaster({
        title: 'OPENING_SLIDE',
        //bkgd:  'FFFFFF',
        bkgd:  {path: coke_bkgd_path},
        //bkgd:{path: bkgd_img_path},
        objects: [
            { 'image': { x:0.669291, y:6.968504, w:3.484252, h:0.2204724, path: bsw_logo_path }},
            { 'image': { x:0, y:0, w:0.16535433, h:7.5, path: coke_sideimg_path }},
            { 'image': { x:12.15748, y:6.4251969, w:1.177165, h:1.074803, path: coke_logo_path }}
        ]
    });

    pptx.defineSlideMaster({
        title: 'ENDING_SLIDE',
        //bkgd:  'FFFFFF',
        bkgd:  {path: coke_bkgd_path},
        objects: [
            { 'text':  
                {   text:'Thank you', 
                    options:{ 
                        x:3.10629921, 
                        y:2.35826772, 
                        w:'50%', 
                        h:'20%',
                        align:'center',
                        fontFace:'Lucida Handwriting',
                        fontSize:60,
                        color:'cfc22b',
                        valign:'top'
                    }
                }
            },
            { 'text':  
                {   text:'For more information,please contact-', 
                    options:{ 
                        x:3.10629921, 
                        y:4, 
                        w:'50%', 
                        h:'10%',
                        align:'center',
                        fontFace:'Calibri (Body)',
                        fontSize:22,
                        color:'cfc22b',
                        valign:'top'
                    }
                }
            },
            { 'text':  
                {   text:'jiffy@brand-scapes.com',
                    options:{
                        x:3.10629921, 
                        y:4.35826772, 
                        w:'50%', 
                        h:'10%',
                        align:'center',
                        fontFace:'Calibri (Body)',
                        fontSize:18,
                        color:'cfc22b',
                        valign:'top'
                    }
                }
            },  
            //{ 'image': { x:0.16929134, y:7.15354331, w:3.48818898, h:0.22047244, path: bsw_logo_path }},
            { 'image': { x:0.669291, y:6.968504, w:3.484252, h:0.2204724, path: bsw_logo_path }},
            { 'image': { x:0, y:0, w:0.16535433, h:7.5, path: coke_sideimg_path }},
            { 'image': { x:12.15748, y:6.4251969, w:1.177165, h:1.074803, path: coke_logo_path }}
        ]
    });

    pptx.defineSlideMaster({
        title: 'CONTENT_SLIDE',
        bkgd:  'FFFFFF',
        objects: [
            //{ 'image': { x:0.16929134, y:7.15354331, w:3.48818898, h:0.22047244, path: bsw_logo_path }},
            { 'image': { x:0.669291, y:6.968504, w:3.484252, h:0.2204724, path: bsw_logo_path }},
            { 'image': { x:0, y:0, w:0.16535433, h:7.5, path: coke_sideimg_path }},
            { 'image': { x:12.15748, y:6.4251969, w:1.177165, h:1.074803, path: coke_logo_path }}
        ]
    });

    pptx.defineSlideMaster({
        title: 'SUMMARY_SLIDE',
        bkgd:  'FFFFFF',
        objects:[
            //{ 'image': { x:0.16929134, y:7.15354331, w:3.48818898, h:0.22047244, path: bsw_logo_path }},
            { 'image': { x:0.669291, y:6.968504, w:3.484252, h:0.2204724, path: bsw_logo_path }},
            { 'image': { x:0, y:0, w:0.16535433, h:7.5, path: coke_sideimg_path }},
            { 'image': { x:12.15748, y:6.4251969, w:1.177165, h:1.074803, path: coke_logo_path }}
        ]
    });

    var slide = pptx.addNewSlide('OPENING_SLIDE');

    slide.addText(
        //process_name.toUpperCase()+' ANALYSIS',//Commented on 17-OCT-2018, Pratik. As per Satish G. Change Request.
        presentation_name,//Added on 17-OCT-2018, Pratik. Now Displaying from Above variable.
        { 
            x:1.46062992, 
            y:3.16929134, 
            w:'75%', 
            h:'10%',
            align:'center',
            fontFace:'Century Gothic',
            fontSize:44
        }
    );

    var i;
    var summary_slide =[];

    var monthQuarter = {
        3: "Q1",
        6: "Q2",
        9: "Q3",
        12: "Q4"
    };

    var running_process = localStorage.getItem('selected_process_id');

    for(i = 0; i < response.length; ++i)
	{
        /*-----Changes for HHP file data-----*/
        if( running_process == '2' || (running_process == '6' && response[i].process == 'jiffy_hhp')){
            ////console.logrunning_process);
            if(response[i].xlabel.trim().toLowerCase() == "quarter"){
                var monthYear = [];
                for(var k=0;k<response[i].index.length;k++){
                    monthYear[k] = response[i].index[k].qyear + " " + monthQuarter[response[i].index[k].month];
                }
                response[i].index = monthYear.slice();
            }else if(response[i].xlabel.trim().toLowerCase() == "brand"){
                response[i].columns = [response[i].title.substr(0,response[i].title.indexOf('('))];
            }
        }	
        /*---------------------------------*/

        if(response[i].xlabel == ""){
            response[i].xlabel = " ";
        }
        var content = pptx.addNewSlide('CONTENT_SLIDE');
        summary_slide.push({
            text:response[i].msg_inference + '\n', 
            options:{
                bullet:true, 
                color:'000000'
            }
        });
		//console.log('Response i : ',response[i]);
        //console.log('Kind : ',response[i].kind, typeof(response[i].kind));
		//console.log('Index : ',response[i].divName.indexOf("treemapgoogle"));

        if(response[i].kind == 'map'){
		//if(response[i].divName.indexOf("map") == -1){
			alert('map');
            //var content = pptx.addNewSlide('CONTENT_SLIDE');
            var imgurl= $('#'+response[i].divName).attr('src');
			////console.logimgurl.replace("data:", ""));
            content.addImage({
                data: imgurl,
				text: response[i].msg_text,
                x:1.62992126, 
                y:1.01574803, 
                w:10.4409449, 
                h:5.51574803
            });
		}else if(response[i].kind == 'waterfall'){
        //}else if(response[i].divName.indexOf("waterfall") != -1){
			 //alert('title :' + response[i].msg_caption);
			 // console.log('dnam1 :',document.getElementById(response[i].divName).getElementsByTagName('svg'));
			var dnam = document.getElementById(response[i].divName).getElementsByTagName('svg');
			var img = document.querySelector('img');
			var svg = document.querySelector("#"+response[i].divName+" svg");
			//console.log('svg :',svg);
			var xml = new XMLSerializer().serializeToString(svg);
			var svg64 = btoa(xml);
			var b64Start = 'data:image/svg+xml;base64,';
			var image64 = b64Start + svg64;
			img.src = image64;
						//console.log("the div name is "+response[i].divName);
						//var data = document.getElementById(response[i].divName).innerHTML;
					//	var img = new Image();
						//img.src = 'data:image/svg+xml;base64,' + btoa(data);
			//var img = '<img src="'+img.src+'">'; 
			var imgurl = img.src;
			var position2 = { x: 2.8, y: 1.4 };
			//var position3 = { x: 5.8, y: 2.4 };
			//var rows2 = [];
			//rows2.push(text: response[i].title);
			// console.log("the img url is :"+img)
			//var imgurl= $('#'+response[i].divName).attr('src');
			////console.logimgurl.replace("data:", ""));
			content.addImage({
				data: imgurl,				
				x:1.62992126, 
				y:1.01574803, 
				w:9.4409449, 
				h:4.51574803,
				sizing:{ type:'contain', w:9.4409449, h:4.51574803 }
			});
			content.addText(response[i].title,position2);
			//content.addText(response[i].msg_caption,position3);
		//}else if(response[i].divName.indexOf("treemapgoogle") == -1){
		}else if(response[i].kind == "treemapgoogle"){
			var dnam = document.getElementById(response[i].divName).getElementsByTagName('svg');
			var img = document.querySelector('img');
			var svg = document.querySelector("#"+response[i].divName+" svg");
			//console.log(svg);
			var xml = new XMLSerializer().serializeToString(svg);
			var svg64 = btoa(xml);
			var b64Start = 'data:image/svg+xml;base64,';
			var image64 = b64Start + svg64;
			img.src = image64;
			//console.log("the div name is "+response[i].divName);
			//var data = document.getElementById(response[i].divName).innerHTML;
			//	var img = new Image();
			//img.src = 'data:image/svg+xml;base64,' + btoa(data);
			//var img = '<img src="'+img.src+'">'; 
			var imgurl = img.src;
			var position2 = { x: 2.7, y: 1.1 };
			//console.log("the img url is :"+img)
			//var imgurl= $('#'+response[i].divName).attr('src');
			////console.logimgurl.replace("data:", ""));
			content.addImage({
				data: imgurl,
				x:1.62992126, 
				y:1.01574803, 
				w:9.4409449, 
				h:4.51574803,
				sizing:{ type:'contain', w:9.4409449, h:4.51574803 }
			});
			content.addText(response[i].title,position2);
		}else if(response[i].kind==="bubblebar"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');			
            var imgurl=$('#'+response[i].divName).get(0).toDataURL();
            ////console.logimgurl.replace("data:", ""));

            content.addImage({
                data: imgurl,
                x:1.62992126, 
                y:1.01574803, 
                w:10.4409449, 
                h:5.51574803
            });
        }else if(response[i].kind==="bubblebarh"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');			
            var imgurl=$('#'+response[i].divName).get(0).toDataURL();
            ////console.logimgurl.replace("data:", ""));

            content.addImage({
                data: imgurl,
                x:1.62992126, 
                y:1.01574803, 
                w:10.4409449, 
                h:5.51574803
            });
        }else if(response[i].kind==="pie"){
            //alert("Pie");
            //var content = pptx.addNewSlide('CONTENT_SLIDE');
            /*var newColors = [];
            if(fileContent.index.indexOf("Tccc") != -1 || fileContent.index.indexOf("Pepsico") != -1 ){
                for(var i=0;i<fileContent.index.length;i++){
                    if(fileContent.index[i] === 'Tccc'){
                        newColors[i] = '#E51C2A';
                    }else if(fileContent.index[i] === 'Pepsico'){
                        newColors[i] = '#0085ca';
                    }else{
                        newColors[i] = pptColors[i+1];
                    }
                }
            }else{
                newColors = pptColors.slice(0,fileContent.index.length);
            }*/
            //alert("Text : " + response[i].title);
            //alert("Index : " + response[i].index);
            //alert("Data : " + response[i].data);
            //Chart Type: PIE
            var dataChartPie = [{ 
                name:response[i].title,
                labels:response[i].index, 
                values:response[i].data 
            }];
            
            /* Added on 03-OCT-2018, Pratik. Coke Manufacture & Category Color Codes. Starts Here. */
            var newColor2 = [];
            for(var j=0;j<response[i].index.length;j++){
                //alert("Columns : " + response[i].columns);
                var manufacture_name = response[i].index[j].toLowerCase();
                //alert("Name : " + manufacture_name);
                
                switch (manufacture_name) { 
                    case 'tccc': 
                        newColor2[j] = TCCC_COLOR;
                        break;
                    case 'pepsico': 
                        newColor2[j] = PEPSICO_COLOR;
                        break;
                    case 'danone': 
                        newColor2[j] = DANONE_COLOR;
                        break;
                    case 'nestle': 
                        newColor2[j] = NESTLE_COLOR;
                        break;
                    case 'private label': 
                        newColor2[j] = PVTLABEL_COLOR;
                        break;
                    case 'red bull': 
                       newColor2[j] = REDBULL_COLOR;
                        break;
                    case 'dr. pepper': 
                        newColor2[j] = PEPPER_COLOR;
                        break;
                    case 'all others': 
                        newColor2[j] = OTHERS_COLOR;
                        break;
                    case 'industry': 
                        newColor2[j] = INDUSTRY_COLOR;
                        break;
                    default:
                        newColor2 = pptColors.slice(0,response[i].index.length);//'595959';//pptColors.slice(0,response[i].columns.length);
                }
            }
            /* Coke Manufacture & Category Color Codes. Ends Here. */
            
            content.addChart(
                pptx.charts.PIE,
                dataChartPie,
                {
                    x:1.62992126, 
                    y:1.01574803, 
                    w:10.4409449, 
                    h:5.51574803,
                    showLegend:true,
                    legendPos:'r',
                    showTitle:true,
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    shadow: 'none',
                    chartColors: pptColors,//Commented on 03-OCT-2018, Pratik.
                    chartColors:newColor2,//Added on 03-OCT-2018, Pratik.
                    dataLabelColor: 'ffffff',
                    dataLabelPosition: 'ctr'
                }
            );
        }else if(response[i].kind==="line"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');
            var dataChartLine =[];
            ////console.log'The value for columns is:' + response[i].columns);

            dataChartLine = getReqDataForBarChart(response[i].columns,response[i].index,response[i].data);
            ////console.logdataChartLine);
            
            /* Added on 03-OCT-2018, Pratik. Coke Manufacture & Category Color Codes. Starts Here. */
            var newColor2 = [];
            for(var j=0;j<response[i].columns.length;j++){
                //alert("Columns : " + response[i].columns);
                var manufacture_name = response[i].columns[j].toLowerCase();
                //alert("Name : " + manufacture_name);
                
                switch (manufacture_name) { 
                    case 'tccc': 
                        newColor2[j] = TCCC_COLOR;
                        break;
                    case 'pepsico': 
                        newColor2[j] = PEPSICO_COLOR;
                        break;
                    case 'danone': 
                        newColor2[j] = DANONE_COLOR;
                        break;
                    case 'nestle': 
                        newColor2[j] = NESTLE_COLOR;
                        break;
                    case 'private label': 
                        newColor2[j] = PVTLABEL_COLOR;
                        break;
                    case 'red bull': 
                       newColor2[j] = REDBULL_COLOR;
                        break;
                    case 'dr. pepper': 
                        newColor2[j] = PEPPER_COLOR;
                        break;
                    case 'all others': 
                        newColor2[j] = OTHERS_COLOR;
                        break;
                    case 'industry': 
                        newColor2[j] = INDUSTRY_COLOR;
                        break;
                    default:
                        newColor2 = pptColors.slice(0,response[i].columns.length);//'595959';//pptColors.slice(0,response[i].columns.length);
                }
            }
            /* Coke Manufacture & Category Color Codes. Ends Here. */
            
            content.addChart(
                pptx.charts.LINE, 
                dataChartLine,
                {
                    x:1.62992126, 
                    y:1.01574803, 
                    w:10.4409449, 
                    h:5.51574803, 
                    //chartColors: pptColors, //['5cbae6'], //Commented on 01-OCT-2018, Pratik.
                    chartColors:newColor2.slice(0,response[i].columns.length),//Added on 01-OCT-2018, Pratik.
                    valGridLine:'none', 
                    showLegend:true, 
                    legendPos:'t',
                    /*valAxisMinVal:Math.floor((response[i].min)/100)*100,
                    valAxisMaxVal:Math.round((response[i].max)/100)*100,*/
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    catAxisTitle:response[i].xlabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,
                    legendFontSize:14,
                    lineSmooth: true,
                    shadow: 'none'
                }
            );			
        }else if(response[i].kind==="table"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');

            var tbl_rows2=[];
            // Table

            //tbl_rows2.push(getReqData(response[i].index));
            var tbl_rows3=[];				
            tbl_rows3 = getReqData(response[i].columns);

            ////console.log'inside table code length is:' + Array.isArray(tbl_rows3));
            tbl_rows2.push(tbl_rows3);

            var j;
            for(j=0;j<response[i].data.length;j++){
                tbl_rows2.push(response[i].data[j]);
            }

            var tabOpts = { 
                x: 2.16535,
                y: 2.248031, 
                w:9.0, 
                fill:'F7F7F7', 
                fontFace:'Century Gothic',
                fontSize:16, 
                color:'363636',
                lineWeight:-0.2 
            };

            content.addTable( tbl_rows2, tabOpts );	

            //table 
            try{
                content.addText(
                    $('#'+ response[i].divName).prev().html().replace(/\r?\n|\r/g,' '), 
                    { 
                        x: 2.043307,
                        y: 1.41732,
                        h: 0.9094488,
                        w: 10.3385827,
                        fontFace:'Century Gothic',
                        fontSize:'20'
                    }
                ); 
            }catch(ex){
                ////console.log'Exception while adding title');
            }
        }else if(response[i].kind==="scatter"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');
            var data_output_arr =[];

            data_output_arr = getReqDataforScatterPlot(response[i].index,response[i].data);

            ////console.log'Inside scatter index is:' + response[i].index);
            ////console.log'Inside scatter data_output_arr is:' + data_output_arr);
            ////console.logdata_output_arr);
            
            content.addChart( 
                pptx.charts.SCATTER, 
                data_output_arr,
                {
                    x:1.62992126, 
                    y:1.01574803, 
                    w:10.4409449, 
                    h:5.51574803,
                    catAxisTitle:response[i].xlabel,
                    catAxisHidden:false,
                    catAxisLineShow:true,
                    catAxisMinVal:0,
                    catAxisMaxVal:800,
                    catAxisLabelPos:'none',
                    valAxisHidden:false,
                    catGridLine:'none',
                    valGridLine:'none',
                    showLegend:true,
                    legendPos:'r',
                    lineDataSymbolSize:12,
                    showTitle:true,
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,
                    legendFontSize:14,
                    chartColors:pptColors,
                    shadow: 'none'
                }
            ); 
        }else if(response[i].kind==="bar"){
            ////console.log'Krishna inside new chart Type');
            var bar_output_arr =[];
            ////console.log'The value for columns is:' + response[i].columns);

            bar_output_arr = getReqDataForBarChart(response[i].columns,response[i].index,response[i].data);
            
            ////console.logbar_output_arr);
            /*
            bar_output_arr.forEach(function(key,value){
                //console.logkey.name);
                //console.logkey.labels);
                //console.logkey.values);
            });
            */
            //var content = pptx.addNewSlide('CONTENT_SLIDE');
            
            /* Added on 01-OCT-2018, Pratik. Coke Manufacture & Category Color Codes. Starts Here. */
            //alert("Column Name : " + response[i].columns + "\n Column Length : " + response[i].columns.length);
            var newColor2 = [];
            var newColor3 = [];
            for(var j=0;j<response[i].columns.length;j++){
                //alert("Columns : " + response[i].columns);
                var manufacture_name = response[i].columns[j].toLowerCase();
                //alert("Name : " + manufacture_name);
                
                switch (manufacture_name) { 
                    case 'tccc': 
                        newColor2[j] = TCCC_COLOR;
                        newColor3[j] = TCCC_COLOR;
                        break;
                    case 'pepsico': 
                        newColor2[j] = PEPSICO_COLOR;
                        newColor3[j] = PEPSICO_COLOR;
                        break;
                    case 'danone': 
                        newColor2[j] = DANONE_COLOR;
                        newColor3[j] = DANONE_COLOR;
                        break;
                    case 'nestle': 
                        newColor2[j] = NESTLE_COLOR;
                        newColor3[j] = NESTLE_COLOR;
                        break;
                    case 'private label': 
                        newColor2[j] = PVTLABEL_COLOR;
                        newColor3[j] = PVTLABEL_COLOR;
                        break;
                    case 'red bull': 
                       newColor2[j] = REDBULL_COLOR;
                       newColor3[j] = REDBULL_COLOR;
                        break;
                    case 'dr. pepper': 
                        newColor2[j] = PEPPER_COLOR;
                        newColor3[j] = PEPPER_COLOR;
                        break;
                    case 'all others': 
                        newColor2[j] = OTHERS_COLOR;
                        newColor3[j] = OTHERS_COLOR;
                        break;
                    case 'industry': 
                        newColor2[j] = INDUSTRY_COLOR;
                        newColor3[j] = INDUSTRY_COLOR;
                        break;
                    default:
                        /* Added on 04-OCT-2018, Pratik. For Single Column Bar for negative values display Green Color and Red Color for positive Color. Starts Here. */
                        ////console.logresponse);
                        if(parseInt(response[i].columns.length) == parseInt(1)){
                            //alert("Data Length : " + response[i].data.length);
                            //alert("Data Length : " + response[i].data);
                            for(var ii=0;ii<response[i].data.length;ii++){
                                if(parseFloat(response[i].data[ii]) < parseInt(0)){
                                    //alert('Data : ' + response[i].data[ii]);
                                    newColor3[j] = RED_COLOR;//Coke Red
                                    //alert("New Color 1 : " + newColor3[j]);
                                }else{
                                    //alert('Data 2: ' + response[i].data[ii]);
                                    newColor2[j] = GREEN_COLOR;//All Others Green
                                    //alert("New Color 2 : " + newColor2[j]);
                                }
                            }
                            //alert("New Color Final : " + newColor2[j]);
                        }else{
                            //alert("Column Name : " + response[i].columns + "\n Column Length : " + response[i].columns.length);
                            /*alert("Data : " + response[i].data + "\n Data Length : " + response[i].data.length);
                            for(var ii=0;ii<response[i].data.length;ii++){
                                alert("Inner Data : " + response[i].data[ii] + "\n Inner Data Length : " + response[i].data[ii].length);
                                for(var iii=0;iii<response[i].data[ii].length;ii++){
                                    if(parseFloat(response[i].data[ii]) < parseInt(0)){
                                        alert('Data 3 : ' + response[i].data[iii]);
                                        newColor2 = pptColors.slice(0,response[i].columns.length);
                                        alert("New Color 3 : " + newColor3[j]);
                                    }else{
                                        alert('Data 4: ' + response[i].data[iii]);
                                        newColor3 = pptColors.slice(0,response[i].columns.length);
                                        alert("New Color 4 : " + newColor2[j]);
                                    }
                                }
                            }*/
                            //alert("New Color Final : " + newColor2[j]);
							//console.log('response[i]',response[i]);
							newColor2 = pptColors.slice(0,response[i].columns.length);
                            newColor3 = pptColors.slice(0,response[i].columns.length);
							//console.log('newColor2',newColor2);
							//newColor3=newColor2;
							//console.log('newColor3',newColor3);
							//newColor2=newColor2[j];
							//newColor3=newColor2[j];
                        }
                        /* For Single Column Bar for negative values display Green Color and Red Color for positive Color. Ends Here. */
                        //newColor2 = pptColors.slice(0,response[i].columns.length);//Comented on 04-OCT-2018, Pratik.//'595959';//pptColors.slice(0,response[i].columns.length);
                }
            }
            /* Coke Manufacture & Category Color Codes. Ends Here. */
            
            var showLegend = true;

            if(response[i].columns.length > 1){
                showLegend = true;
            }else{
                showLegend = false;
            }
			//newColor3=newColor2;
			
            content.addChart( 
                pptx.charts.BAR, 
                bar_output_arr,
                {
                    x:1.62992126, 
                    y:1.01574803,
                    w:10.4409449,
                    h:5.51574803,
                    catAxisTitle:response[i].xlabel,
                    catAxisHidden:false,
                    catAxisLineShow:true,
                    catAxisMinVal:0,
                    catAxisMaxVal:800,
                    catAxisLabelPos:'none',
                    valAxisHidden:false,
                    catGridLine:'none',
                    valGridLine:'none',
                    lineDataSymbolSize:12,
                    showTitle:true,
                    showLabel:true,//Added on 03-OCT-2018, Pratik. To Display Data Labels on Bar Chart
                    showValue:true,//Added on 03-OCT-2018, Pratik. To Display Data Labels Value on Bar Chart
                    dataLabelPosition:'outEnd',//Added on 03-OCT-2018, Pratik. To Display Data Labels Value on Bar Chart
		    dataLabelFormatCode:'0.0', //Added on 31-OCT-2018, Richa. To Display Decimal values as Data labels
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,					
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,					
                    //chartColors:pptColors.slice(0,response[i].columns.length),//Commented on 01-OCT-2018, Pratik.
                    chartColors:newColor2.slice(0,response[i].columns.length),//Added on 01-OCT-2018, Pratik.
                    invertedColors:newColor3.slice(0,response[i].columns.length), //newColor2.slice(0,response[i].columns.length),//For data colors for negative numbers
                    //fill: false,
                    //backgroundColor:pptColors.slice(0,response[i].columns.length),
                    shadow: 'none',
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    legendFontSize:14,
                    legendPos:'r',
                    showLegend: showLegend
                }
            );
        }else if(response[i].kind==="stackedBar"){
            ////console.log'Krishna inside new chart Type');
            var bar_output_arr =[];
            ////console.log'The value for columns is:' + response[i].columns);

            bar_output_arr = getReqDataForBarChart(response[i].columns,response[i].index,response[i].data);
            //console.logbar_output_arr);
            /*
            bar_output_arr.forEach(function(key,value){
                //console.logkey.name);
                //console.logkey.labels);
                //console.logkey.values);
            });
            */
            //var content = pptx.addNewSlide('CONTENT_SLIDE');	

            var showLegend = true;

            if(response[i].columns.length > 1){
                showLegend = true;
            }else{
                showLegend = false;
            }

            content.addChart( 
                pptx.charts.BAR, 
                bar_output_arr,
                {
                    x:1.62992126, 
                    y:1.01574803,
                    w:10.4409449,
                    h:5.51574803,
                    barGrouping: 'stacked',
                    catAxisTitle:response[i].xlabel,
                    catAxisHidden:false,
                    catAxisLineShow:true,
                    catAxisMinVal:0,
                    catAxisMaxVal:800,
                    catAxisLabelPos:'none',
                    valAxisHidden:false,
                    catGridLine:'none',
                    valGridLine:'none',
                    lineDataSymbolSize:12,
                    showTitle:true,
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,					
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,					
                    chartColors:pptColors.slice(0,response[i].columns.length),
                    shadow: 'none',
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    legendFontSize:14,
                    legendPos:'r',
                    showLegend: showLegend
                }
            );
        }else if(response[i].kind==="horizontalBar" || response[i].kind==="barh"){
            //alert("Kind : " + response[i].kind);
            ////console.log'Krishna inside new chart Type');
            var bar_output_arr =[];
            ////console.log'The value for columns is:' + response[i].columns);
            bar_output_arr = getReqDataForBarChart(response[i].columns,response[i].index,response[i].data);
            /*
            bar_output_arr.forEach(function(key,value){
                       //console.logkey.name);
                       //console.logkey.labels);
                       //console.logkey.values);
                    });
            */
            //var content = pptx.addNewSlide('CONTENT_SLIDE');	
			
			/* Added on 01-OCT-2018, Pratik. Coke Manufacture & Category Color Codes. Starts Here. */
            //alert("Column Name : " + response[i].columns + "\n Column Length : " + response[i].columns.length);
            var newColor2 = [];
            var newColor3 = [];
            for(var j=0;j<response[i].columns.length;j++){
                //alert("Columns : " + response[i].columns);
				console.log("Columns : " + response[i].columns);
                var manufacture_name = response[i].columns[j].toLowerCase();
                //alert("Name : " + manufacture_name);
                
                switch (manufacture_name) { 
                    case 'tccc': 
                        newColor2[j] = TCCC_COLOR;
                        newColor3[j] = TCCC_COLOR;
                        break;
                    case 'pepsico': 
                        newColor2[j] = PEPSICO_COLOR;
                        newColor3[j] = PEPSICO_COLOR;
                        break;
                    case 'danone': 
                        newColor2[j] = DANONE_COLOR;
                        newColor3[j] = DANONE_COLOR;
                        break;
                    case 'nestle': 
                        newColor2[j] = NESTLE_COLOR;
                        newColor3[j] = NESTLE_COLOR;
                        break;
                    case 'private label': 
                        newColor2[j] = PVTLABEL_COLOR;
                        newColor3[j] = PVTLABEL_COLOR;
                        break;
                    case 'red bull': 
                       newColor2[j] = REDBULL_COLOR;
                       newColor3[j] = REDBULL_COLOR;
                        break;
                    case 'dr. pepper': 
                        newColor2[j] = PEPPER_COLOR;
                        newColor3[j] = PEPPER_COLOR;
                        break;
                    case 'all others': 
                        newColor2[j] = OTHERS_COLOR;
                        newColor3[j] = OTHERS_COLOR;
                        break;
                    case 'industry': 
                        newColor2[j] = INDUSTRY_COLOR;
                        newColor3[j] = INDUSTRY_COLOR;
                        break;
                    default:
                        /* Added on 04-OCT-2018, Pratik. For Single Column Bar for negative values display Green Color and Red Color for positive Color. Starts Here. */
                        ////console.logresponse);
                        if(parseInt(response[i].columns.length) == parseInt(1)){
                            //alert("Data Length : " + response[i].data.length);
                            //alert("Data Length : " + response[i].data);
                            for(var ii=0;ii<response[i].data.length;ii++){
                                if(parseFloat(response[i].data[ii]) < parseInt(0)){
                                    //alert('Data : ' + response[i].data[ii]);
                                    newColor3[j] = RED_COLOR;//Coke Red
                                    //alert("New Color 1 : " + newColor3[j]);
                                }else{
                                    //alert('Data 2: ' + response[i].data[ii]);
                                    newColor2[j] = GREEN_COLOR;//All Others Green
                                    //alert("New Color 2 : " + newColor2[j]);
                                }
                            }
                            //alert("New Color Final : " + newColor2[j]);
                        }else{
                            //alert("Column Name : " + response[i].columns + "\n Column Length : " + response[i].columns.length);
                            /*alert("Data : " + response[i].data + "\n Data Length : " + response[i].data.length);
                            for(var ii=0;ii<response[i].data.length;ii++){
                                alert("Inner Data : " + response[i].data[ii] + "\n Inner Data Length : " + response[i].data[ii].length);
                                for(var iii=0;iii<response[i].data[ii].length;ii++){
                                    if(parseFloat(response[i].data[ii]) < parseInt(0)){
                                        alert('Data 3 : ' + response[i].data[iii]);
                                        newColor2 = pptColors.slice(0,response[i].columns.length);
                                        alert("New Color 3 : " + newColor3[j]);
                                    }else{
                                        alert('Data 4: ' + response[i].data[iii]);
                                        newColor3 = pptColors.slice(0,response[i].columns.length);
                                        alert("New Color 4 : " + newColor2[j]);
                                    }
                                }
                            }*/
                            //alert("New Color Final : " + newColor2[j]);
                            newColor2 = pptColors.slice(0,response[i].columns.length);
                            newColor3 = pptColors.slice(0,response[i].columns.length);
                        }
                        /* For Single Column Bar for negative values display Green Color and Red Color for positive Color. Ends Here. */
					}
				}	
            var showLegend = true;

            if(response[i].columns.length > 1){
                    showLegend = true;
            }else{
                    showLegend = false;
            }
            
            content.addChart( 
                pptx.charts.BAR, 
                bar_output_arr,
                {
                    x:1.62992126, 
                    y:1.01574803,
                    w:10.4409449,
                    h:5.51574803,
                    catAxisTitle:response[i].xlabel,
                    catAxisHidden:false,
                    catAxisLineShow:true,
                    catAxisMinVal:0,
                    catAxisMaxVal:800,
                    catAxisLabelPos:'none',
                    valAxisHidden:false,
                    catGridLine:'none',
                    valGridLine:'none',
                    lineDataSymbolSize:12,
                    showTitle:true,
                    showLabel:true,//Added on 03-OCT-2018, Pratik. To Display Data Labels on Bar Chart
                    showValue:true,//Added on 03-OCT-2018, Pratik. To Display Data Labels Value on Bar Chart
                    dataLabelPosition:'outEnd',//Added on 03-OCT-2018, Pratik. To Display Data Labels Value on Bar Chart
		    dataLabelFormatCode:'0.0', //Added on 31-OCT-2018, Richa. To Display Decimal values as Data labels
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,					
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,					
                    //chartColors:pptColors.slice(0,response[i].columns.length),//Commented on 01-OCT-2018, Pratik.
                    chartColors:newColor2.slice(0,response[i].columns.length),//Added on 01-OCT-2018, Pratik.
                    invertedColors: newColor3.slice(0,response[i].columns.length), //newColor2.slice(0,response[i].columns.length),//For data colors for negative numbers
                    barDir: 'bar',
                    //catAxisOrientation: 'maxMin',
                    shadow: 'none',	
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:20,				
                    legendFontSize:14,
                    legendPos:'r',
                    showLegend:showLegend
                }
            );
    }else if(response[i].kind==="doughnut"){
            //var content = pptx.addNewSlide('CONTENT_SLIDE');

            //Chart Type: DOUGHNUT
            var dataChartDoughnut = [{ 
                name:response[i].title, //response[i].msg_text,
                labels:response[i].index, 
                values:response[i].data 
            }];
            
            /* Added on 03-OCT-2018, Pratik. Coke Manufacture & Category Color Codes. Starts Here. */
            var newColor2 = [];
            for(var j=0;j<response[i].index.length;j++){
                //alert("Columns : " + response[i].columns);
                var manufacture_name = response[i].index[j].toLowerCase();
                //alert("Name : " + manufacture_name);
                
                switch (manufacture_name) { 
                    case 'tccc': 
                        newColor2[j] = TCCC_COLOR;
                        break;
                    case 'pepsico': 
                        newColor2[j] = PEPSICO_COLOR;
                        break;
                    case 'danone': 
                        newColor2[j] = DANONE_COLOR;
                        break;
                    case 'nestle': 
                        newColor2[j] = NESTLE_COLOR;
                        break;
                    case 'private label': 
                        newColor2[j] = PVTLABEL_COLOR;
                        break;
                    case 'red bull': 
                       newColor2[j] = REDBULL_COLOR;
                        break;
                    case 'dr. pepper': 
                        newColor2[j] = PEPPER_COLOR;
                        break;
                    case 'all others': 
                        newColor2[j] = OTHERS_COLOR;
                        break;
                    case 'industry': 
                        newColor2[j] = INDUSTRY_COLOR;
                        break;
                    default:
                        newColor2 = pptColors.slice(0,response[i].index.length);//'595959';//pptColors.slice(0,response[i].columns.length);
                }
            }
            /* Coke Manufacture & Category Color Codes. Ends Here. */
            
            content.addChart(
                pptx.charts.DOUGHNUT, 
                dataChartDoughnut,
                {
                    x:1.62992126, 
                    y:1.01574803, 
                    w:10.4409449, 
                    h:5.51574803,
                    showLegend:true,
                    legendPos:'r',
                    showTitle:true,
                    title: response[i].title, //response[i].msg_text,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    shadow: 'none',
                    //chartColors: pptColors,//Commented on 03-OCT-2018, Pratik.
                    chartColors:newColor2,//Added on 03-OCT-2018, Pratik.
                    dataLabelColor: 'ffffff',
                    dataLabelPosition: 'ctr'
                }
            );
        }else if(response[i].kind==="bubble"){
            var data_output_arr =[];

            data_output_arr = getDataforBubbleChart(response[i].index,response[i].data);

            // Chart Type: BUBBLE			
            content.addChart( 
                pptx.charts.BUBBLE, 
                data_output_arr,
                {
                    x:1.62992126, 
                    y:1.01574803, 
                    w:10.4409449, 
                    h:5.51574803,
                    catAxisTitle:response[i].xlabel,
                    catAxisHidden:false,
                    catAxisLineShow:true,
                    catAxisLabelPos:'none',
                    valAxisHidden:false,
                    catGridLine:'none',
                    valGridLine:'none',
                    showLegend:true,
                    legendPos:'r',
                    lineDataSymbolSize:12,
                    showTitle:true,
                    title:response[i].title,
                    titleAlign:'center',
                    titleFontFace:'Century Gothic',
                    titleFontSize:20,
                    legendFontFace:'Helvetica Neue',
                    legendFontSize:14, //Modified on 01-OCT-2018, Pratik. Modified Legend Font Size from "20" to "14"
                    catAxisLabelPos:'nextTo',
                    valAxisTitle:response[i].ylabel,
                    showCatAxisTitle:true,
                    showValAxisTitle:true,
                    catAxisTitleFontSize:14,
                    valAxisTitleFontSize:14,
                    legendFontSize:14,
                    chartColors:pptColors,
                    shadow: 'none'
                }
            );
        }

        content.addText(
            response[i].msg_inference,
            { 
                x:0.14566929,
                y:0.14566929,
                w:12.9212598,
                h:0.87007874, 
                fontFace:'Century Gothic',
                fontSize:'20'
            }
        ); 
	
	response[i].msg_caption = response[i].msg_caption.replace("<br>","\n");
        var pipeIndex = response[i].msg_caption.indexOf("||");	
        if(pipeIndex === -1){
            pipeIndex = response[i].msg_caption.length;
        }
        content.addText(
            //response[i].msg_caption,
            [
                {
                    text: response[i].msg_caption.substr(0,pipeIndex),
                    options: {
                        color: '0000FF'
                    }
                },
                {
                    text: response[i].msg_caption.substr(pipeIndex+2, response[i].msg_caption.length),
                    options: {
                        color: 'FF0000'
                    }
                }
            ],
            { 
                x:4.38582677,
                y:6.9015748,
                w:8.45275591,
                h:0.33858268, 
                fontFace:'Century Gothic',
                fontSize:'10'
            }
        );
    }//closing -  for loop	

    for(var i=0;i<summary_slide.length;i=i+8){
        var summary = pptx.addNewSlide('SUMMARY_SLIDE');
        summary.addText(
            'Summary', 
            {
                x:0.14566929,
                y:0.14566929, 
                w:'75%',
                h:'10%',
                align:'left',
                fontFace:'Century Gothic',
                fontSize:24
            }
        );
        summary.addText(
            summary_slide.slice(i,i+8),
            {
                x: 0.3228, 
		y:1, 
		w:'90%', 
		h:'80%',
                fontFace:'Century Gothic',
                fontSize:'14',
                valign: 'top'
            }
        );
    }

    pptx.addNewSlide('ENDING_SLIDE');

        $("#loader").hide();
        $("#alert-modal .modal-body").html('PPT Generated Successfully');
        $("#alert-modal").show();
        $("#alert-modal #btn-ok").off('click');
        $("#alert-modal #btn-ok").on('click',function(){        	
        $("#alert-modal").hide();
    });      
    pptx.save(presentation_name);
}

function prepHeader(input){
	////console.log"Hello Lord Krishna!!!");
	var tbl_rows1;
	tbl_rows1 = getReqData(input + '');

	////console.log"The length of array is:" + tbl_rows1.length);
	return tbl_rows1;
}

function getReqData(data){
	//var arr1=data.slice(data.indexOf('[')+1,data.indexOf(']')).split(",");
	var arr1=data.toString().split(",");

	var header_rows=[];
	var i;
	for(i=0;i<arr1.length;i++){
		////console.log"{text:'" + arr1[i] + "',options:{fill:'3069ab',color:'ffffff'}}");
		//header_rows.push("{text:'" + arr1[i] +"',options:{fill:'3069ab',color:'ffffff'}}");
		var str="";
		//header_rows.push(str.concat('{text:\'',arr1[i],'\'}'));
		header_rows.push({text:arr1[i],options:{fill:'3069ab',color:'ffffff'}});
	}
	return  header_rows;
}

//Data Prep for Bubble Chart
function getDataforBubbleChart(index,data){
	var chartDataBubble = []; 
	var maxDataPt = data[0][2];
	var dataLength = data.length;
	
	chartDataBubble.push({
		name : "X-Axis",
		values : getXAxisArray(data)
	});
	
  	for(var i=0;i<dataLength;i++){
		var dataSize = Math.round((data[i][2]*30)/maxDataPt); 		
		chartDataBubble.push({
				name: index[i],
				values : getCategoryArray(data[i][1],i,dataLength),
  				sizes : getCategoryArray(dataSize,i,dataLength)
		});
  	}
  	
  	return chartDataBubble;
}
		

//For Scatter Plot	
function getReqDataforScatterPlot(index,data){
	
	var index_arr = index.toString().split(",");
	var data_arr  = data;
	var scatter_data_arr=[];

	//here we pepare values for X-axis
	scatter_data_arr.push({name:"X-Axis",values:getXAxisArray(data_arr)});
			
	//here we prepare category-wise data
	for(var i=0;i<index_arr.length;i++){			
		var val_arr = [];
		val_arr = getCategoryArray(data_arr[i][1],i,index_arr.length);		
		scatter_data_arr.push({name:index_arr[i].replace(/&/g,'n'),values:val_arr});
	}	
	return scatter_data_arr;
}	

//For Scatter Plot & Bubble Chart
function getCategoryArray(val,pos,size){
	var arr=[];
	for(var k=0; k<size; k++){
		if(k === pos){
			arr.push(val);
		}else{
			arr.push(0);
		}
	}	
	return arr;
}

//For Scatter Plot & Bubble Chart
function getXAxisArray(data){
	var arr=[];
	for(var k=0; k<data.length; k++){
		////console.log'Krishna inside getXAxisArray1:' + data[k][0]);
		arr.push(data[k][0]);
	}
	//console.logarr);
	return arr;
}

//for bar chart
function getReqDataForBarChart(columns,index,data){
    var barChartArr=[];	
    for(var j=0;j<columns.length;j++){
        //alert("Columns : " + columns);
        /*   
        alert("Columns : " + response[i].columns);
        var manufacture_name = response[i].columns[k].toLowerCase();
        alert("Name : " + manufacture_name);
        //manufacture_name = response[i].columns[k].toLowerCase();

        switch (manufacture_name) { 
            case 'tccc': 
                newColor2[j] = 'c00000';
                break;
            case 'pepsico': 
                newColor2[j] = '004a97';
                break;
            case 'danone': 
                newColor2[j] = '7030a0';
                break;
            case 'nestle': 
                newColor2[j] = '00b0f0';
                break;
            case 'private label': 
                newColor2[j] = '507c33';
                break;
            case 'red bull': 
               newColor2[j] = '7f7f7f';
                break;
            case 'pepper': 
                newColor2[j] = 'ff7582';
                break;
            case 'all others': 
                newColor2[j] = 'bf9000';
                break;
            case 'industry': 
                newColor2[j] = '595959';
                break;
            default:
                newColor2[j] = pptColors.slice(0,response[i].columns.length);
        }*/
            
        
        var row = {
            name : columns[j].replace(/&/g,'n'),
            labels : index,
            values : getChartDataValArray(data,j)
        };
        barChartArr.push(row);
    }
    return barChartArr;
}

//for bar chart
function getChartDataValArray(data,position){
    var dataArr=[];

    for(var j=0;j<data.length;j++){
        dataArr.push(data[j][position]);
    }
    return dataArr;
}	
