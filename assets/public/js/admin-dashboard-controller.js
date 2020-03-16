$(document).ready(function() {
    
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
   var start = moment().subtract(29, 'days');
   var end = moment();

   function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		doAjax(start, end);
        //console.log(start.format('DD-MM-YYYY') + ' ' + end.format('DD-MM-YYYY'));
   }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);
	doAjax(start, end);
	
		/*$('#reportrange').on('click', function() {
			alert("Inside click");
		doAjax(start, end);
		});*/
		
/*admin_dashboard*/
$('#signOut').on("click",function(event){
	event.preventDefault();
	var exit = confirm("Are you sure you want to end the session?");
	if(exit==true){
		window.location = './index.html?logout=true';				
	}
});		


      
});



doAjax = function (start, end) {
	$("#loader").show();
//	event.preventDefault();
	setTimeout(function(){ var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'uniqueUsers';
	
	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}
	else{
		$('#unique_users').html(response.unique_users + " / "+response.total_users);
		$('#total_clients').html(response.total_clients);
		$('#total_processes').html(response.total_processes);
		$('#total_questions').html(response.total_questions);
		//localStorage.setItem('unique_users',response.unique_users);
	}
	
	//start chart
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'getTop5Login';

	var response = autoresponse('api.php', checkData);
	if(response.status == 500){
		//swal("TOP 5 LOGINS : Error occured while loading chart");
		$("#rpt-top-5-login-panel").html('');
	}
	else
	{
		renderBarChart('rpt-top-5-login',response.user_id,response.user_id_count);
	}
	//end chart 1
	
	//start faq section
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'faq';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{				
			var html='';
			$.each(response.msg_text,function(k,question)
			{
				html+="<tr><td>"+ question + "</td><td>" + response.qcount[k]+ "</td></tr>";
			});
			$('#freqQuesTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
			$('#freqQuesTable').append(html);		
	}
	//end faq section

//start chart 3 - Average Duration 
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'avgDuration';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else
	{					
		renderBarChart('rpt-average-duration',response.user_id,response.session_time);
	}
//end 	chart 3 - Average Duration
/*=============Code By Chetan================*/
//start chart 4 - Mic Usage 
	/*var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'micUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{					
		renderBarChart('rpt-mic-usage',response.user_id,response.usage_count);
		
	}*/
//end 	chart 4 - Mic Usage 

//start chart 4 - Failed Requests
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'failedRequests';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{					
		renderBarChart('rpt-failed-requests',response.user_id,response.usage_count);
		
	}
//end 	chart 4 - Failed Requests
/*=============End================*/

//start chart 5 - Help Usage 
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'helpUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{					
		renderBarChart('rpt-help-asked',response.user_id,response.usage_count);
	}
//end chart 5 - Help Usage 

//----------------------start chart 6 export to ppt chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'exportPPTCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{		
		renderBarChart('rpt-export-to-ppt',response.user_id,response.usage_count);
	}

//----------------------end chart 6 export to ppt chart-------------------------------	

//----------------------start chart 7 profile update usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'updprofileUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{		
		renderBarChart('rpt-update-profile',response.user_id,response.usage_count);
		
	}

//----------------------end chart 7 profile update usage chart-------------------------------	
//----------------------start chart 8 theme update usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'updthemeUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{		
		renderBarChart('rpt-update-theme',response.user_id,response.usage_count);
	}

//----------------------end chart 8 theme update usage chart-------------------------------
//----------------------start chart 9 quick access usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'quickaccessUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{
		renderBarChart('rpt-quick-access',response.user_id,response.usage_count);
	}

//----------------------end chart 9 quick access usage chart-------------------------------
//----------------------start chart 10 like usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'likeUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{
		renderBarChart('rpt-like-usage',response.user_id,response.usage_count);
	}

//----------------------end chart 10 like usage chart-------------------------------
//----------------------start chart 11 dislike usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'dislikeUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{
		renderBarChart('rpt-dislike-usage',response.user_id,response.usage_count);
	}

//----------------------end chart 11 dislike usage chart-------------------------------
//----------------------start chart 12 busiest day usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'busiestdayUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{
		renderBarChart('rpt-busiest-day-usage',response.user_id,response.usage_count);		
	}

//----------------------end chart 12  busiest day usage chart-------------------------------
//----------------------start chart 13 busiest hour usage chart-----------------------------
	var checkData = {};
	
	checkData.start_date = start.format('YYYY-MM-DD 00:00:00');
	checkData.end_date = end.format('YYYY-MM-DD 23:59:00');
	checkData.action = 'busiesthourUsageCount';

	var response = autoresponse('api.php', checkData);
	//console.log(response);
	if(response.status == 500){
		//alert("Incorrect Response. Please try again.");
	}else{
		renderBarChart('rpt-busiest-hour-usage',response.user_id,response.usage_count);	
	} 
//----------------------end chart 13 busiest hour usage chart-------------------------------
$("#loader").hide();
},500);
};


function renderBarChart(id,labels,dataPack)
{
	Chart.defaults.global.elements.rectangle.backgroundColor = '#FF0000';
    $("#" + id + "-panel").html('<canvas id="' + id + '"></canvas>');
	
	var data=[];
	var max_value=parseFloat(dataPack[0]);
	$.each(dataPack,function(k,v){ 
		if(v > max_value)
		{
			max_value=v;
			
		}
		data.push(parseFloat(v));
	});
	if(max_value<=10)
	{
		max_value+=5;
	}
	else if(max_value<=100)
	{
		max_value+=30;
	}
	else if(max_value<=1000)
	{
		max_value+=50;
	}
	else if(max_value<=10000)
	{
		max_value+=200;
	}
	//console.log('id=',id,"dataPack=",data,'labels=',labels);
	//console.log('max_value=',max_value);
    var ctx = document.getElementById(id);
    var bar_ctx = document.getElementById(id);
	var data = {
    labels: labels,
    datasets: [
        {
            label: "",
            backgroundColor: "rgba(0,189,255,0.7)",
            borderColor: "rgba(0,189,255,0.8)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(0,189,255,0.7)",
            hoverBorderColor: "rgba(0,189,255,0.9)",
            data: dataPack,
			datalabels: {
                    color: 'black',
                    align: 'top',
                    anchor: 'left'
                }
        }
    ]
};
var option = {
	legend :{display:false},
	animation: {
                duration: 10,
            },
            tooltips: {
                mode: 'label',
                callbacks: {
                    label: function(tooltipItem, data) {
                        return ' ' + numberWithCommas(tooltipItem.yLabel);
                    }
                }
            },
	scales: {
  	xAxes: [{
                    stacked: false,
                    gridLines: {
                        display: false
                    },
                    ticks: {
						beginAtZero: true,
						fontSize: 11,
						fontStyle :600,
                    }
                }],
                yAxes: [{
                    stacked: false,
                    ticks: {
                        beginAtZero: true,
                        display: false,
                        drawBorder: false,
                        min: 0,
                        max: max_value ,
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                }],
	
  }
};

var myBarChart = Chart.Bar(bar_ctx,{
   data:data,
   options:option,
   plugins: {
            datalabels: {
                color: 'white',
                display: true,
                formatter: function(value) {
                    return this.formatValue(value);
                }.bind(this)
            }
        }
});
    
}