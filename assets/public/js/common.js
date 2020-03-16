var url;
var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

try
{
    url = document.location.href.match(/[^\/]+$/)[0];
    if(url=='index' || url=='')
    {
        url = "index";
    }
    else
    {
		$(".profile-pic").attr('src',sessionStorage.getItem('picture'));
        url='other';
    }

}catch(e){
    url = "index";
}


switch(url)
{
    case 'index' :
        //alert(localStorage.getItem('selected_process_id'));
        if(sessionStorage.getItem('id')!=null && sessionStorage.getItem('id')!="")
        {
            window.location='dashboard';

        }
        break;
    case 'other' : 
        if(sessionStorage.getItem('id')=="" || sessionStorage.getItem('id')==null )
        {
            window.location='index';

        }
        break;

}
function autoresponse(zurl, data) {
//alert('inside autoresponse');
    var resultobj;
    var result;
    var zapiurl = 'apis/' + zurl;
	//var zapiurl = 'http://localhost/jiffymssql/jiffycoke/admin/apis/' + zurl;
    var formData = data;
    $.ajax({
        type: "POST",
        url: zapiurl,
        data: formData,
        dataType: 'json',
        async: !1,
        success: function(data) {
			//alert('inside success ajax!!!');
            result = JSON.stringify(data);            
            resultobj = $.parseJSON(result);
        },
		error: function(xhr){
        alert('Ajax Error Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
        }
    });
	//alert('The value is:' + resultobj);
    return resultobj
}

/*--------This function is only for Chat-------*/
function chatresponse(zurl, data) {   
alert('commmon.js'); 
    var resultobj;
    var result;
    var zapiurl = '../apis/' + zurl;
    var formData = data;
    $.ajax({
        type: "POST",
        url: zapiurl,
        data: formData,
        dataType: 'json',
        async: 1,
        success: function(data) {
             createResponse(data);
        }
    });

}
/*--------This function is only for Chat-------*/
function set_cookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + btoa(cvalue) + ";" + expires + ";path=/";
}

function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function get_cookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return atob(c.substring(name.length, c.length));
        }
    }
    return "";
}
$(document).ready(function() {
    /*=====================Code By Chetan==================*/
    var logo=sessionStorage.getItem("client_logo");
    var client_id=sessionStorage.getItem("user_client_id");
    if(client_id!=0)
    {
        $(".dark-logo").attr('src',logo);
    }
   /*$(".sidebartoggler i.ti-menu").click(function(event){
		$(".dark-logo").toggleClass('adjust')
        /*if($(".dark-logo").hasClass('adjust'))
        {
            $(".dark-logo").removeClass('adjust');
        }
        else
        {
            $(".dark-logo").addClass('adjust');
        }
      
    });*/
	$(".btn-secondary").click(function(){ $(this).closest('form').find('label.error').hide(); });
    $(".dropdown-user .fa-power-off").parent().click(function(){
        sessionStorage.clear();
        window.location='';
    });
    $(".card-clickable").click(function(){
        window.location=$(this).attr('type');
    });
    /*=====================End==================*/
});

function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true) {
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : '';
}