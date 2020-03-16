/**
 * @author Richa
 */
 
/*-------------Function to plot grpah based on python response-------------------*/
// alert(jsonData);
plotGraph = function(jsonData,store){ 
    //console.log('data : '+jsonData);
    if('prompt_ques' in jsonData){
        promptQuestion = jsonData.prompt_ques;
    }else{
        promptQuestion = "";
    }
    /*var colors = ['#5cbae6','#b6d957','#fac364','#8cd3ff','#d998cb','#f2d249','#93b9c6','#ccc5a8','#52bacc',
                   '#dbdb46','#98aafb','#005b96','#4357a3','#c3daf2','#6497b1','#03396c','#011f4b','#b3cde0',
                   '#5a9bd2','#495a80','#ed9845','#352440','#7cb1c5','#766e9a','#99ccff','#556677','#223366',
                   '#3366aa','#d84951'];
    */
    /* Jiffy Coke Category codes, Old Color Schemes.
    var colors = ['#E51C2A','#F89F1E','#2D2E31','#31B828','#B22222','#B43757',
                    '#F37021','#6A997A','#28AC69', '#BA5F21','#6A997A', '#00000','#a06b6b','#ea7272']; 
    */
   
    /* Added on 01-OCT-2018, Pratik. Jiffy Coke Category codes, New Color Scheme. Starts Here. */
    /*var colors = ['#FF0000','#C0C0C0','#FF6600','#FF9900','#F2F2F2','#993300',
                    '#FF6899','#99CC00','#0000FF', '#CCFFFF','#70303C', '#00FF00','#FFFF99','#FF99CC','#FF9DA7'];//Category Code*/
    //var colors = ['#C00000','#004A97','#5B8ABD','#737F85','#D6DCE5','#EE3C47','#C2002E','#02B27C','#595959'];//Manufacture Code
    //var colors = ['#c00000','#004a97','#7030a0','#00b0f0','#507c33','#7f7f7f','#ff7582','#bf9000','#595959'];//Added on 04-OCT-2018, Pratik. Manufacture Code
    
	var colors=[];
   colors.push(HASH + INDUSTRY_COLOR);
	colors.push(HASH + TCCC_COLOR);
	 colors.push(HASH + PEPSICO_COLOR);
	  colors.push(HASH + DANONE_COLOR);
	   colors.push(HASH + NESTLE_COLOR);
		colors.push(HASH + PVTLABEL_COLOR);
		 colors.push(HASH + REDBULL_COLOR);
		  colors.push(HASH + INDUSTRY_COLOR);
		  colors.push(HASH + OTHERS_COLOR);
	/* Jiffy Coke Category codes, New Color Scheme. Ends Here. */
    
    var legendBoolean= true;//Added on 05-OCT-2018, Pratik. To Show / Hide Legend Color Box
    
    var random = (+new Date).toString(36).slice(-5) ; //create unique divname
    var divName = "graph_" + random;
    var fileContent = JSON.parse(jsonData.file.replace(/'/g,'"'));	 
	 
    /*-------------for ordering of messages-------------------------------------*/
    var parentDiv ="";
    // console.log('quesTag :',quesTag);
    $.each(quesTag, function(key,value){
		
        //alert("Div Id : " + value.divID +" \n Question : "+ value.ques +" \n Json Static Question : "+ jsonData.staticques +" \n Json Question : "+ jsonData.ques +" \n Json Question : "+ jsonData.ques.toLowerCase());
        console.log("Question : " + value.ques +" : "+ jsonData.ques);
        if(value.ques === jsonData.ques){ //Commented on 18-SEP-2018, Pratik.
		//if(value.ques === jsonData.staticques){ //Added on 18-SEP-2018, Pratik. Since python response has Proper Case words and condition getting failed.
            parentDiv = value.divID;
            value.infer = jsonData.infer;
        }/*else{
            alert("Question Not matched.");
        }*/
    });
    /*--------------------------------------------------*/
    //alert(store);
    //alert("Kind : " + jsonData.kind);
    if(jsonData.kind === 'map'){
        //alert("Kind 1 : " + jsonData.kind);
        sendMessage(jsonData.infer,"left","graph",divName,'map');
        //if(store)
        {
            addToLogs(jsonData.ques, jsonData.infer, "map_"+divName, jsonData.caption); //for retrieval by other functions and end log
            formatjson(divName,jsonData);
        }
        var chartDataMap =[['Country', ''+fileContent.columns[0]]];
        for(var i=0;i<fileContent.index.length;i++){
            chartDataMap.push([fileContent.index[i][0],fileContent.data[i][0]]);
        }
      	generateMap(divName, chartDataMap, jsonData.title, jsonData.xlabel,promptQuestion,parentDiv);
    }else if(jsonData.kind === 'table'){
        //alert("Kind 2 : " + jsonData.kind);
        divName = "table_" + divName;
	 		
        sendMessage(jsonData.infer,"left","graph",divName,jsonData.caption);
        // if(store)
        {
            addToLogs(jsonData.ques, jsonData.infer, divName, jsonData.caption);
            formatjson(divName,jsonData);
        }
        $( '<div style="font-size:16px; font-weight:bold; text-align: center; color: #6F6F6F;">'+jsonData.title+'</div>' ).insertBefore( "#"+divName );
        //console.log($("#"+divName).length);
        if($("#"+divName).length != 0){
            //console.log("yes");
            $('#'+divName).append('<table class="table table-bordered"  id="'+ divName +'_table"><thead><tr></tr></thead><tbody></tbody></table>');
            for(var i=0;i<fileContent.columns.length;i++){
                $('#'+divName+'_table thead tr').append('<th data-field="id">'+ fileContent.columns[i] +'</th>');
            }

            for(var i=0;i<fileContent.data.length;i++){
                var tableString ='<tr>';
                for(var j=0;j<fileContent.columns.length;j++){
                    tableString =  tableString + ('<td>'+ fileContent.data[i][j] +'</td>');
                }  	
                tableString = tableString + '</tr>';
                $('#'+divName+'_table tbody').append(tableString);		 	
            }
        }
        if($('#'+divName+'_table').length != 0){
            if(promptQuestion != ''){
                sendMessage(promptQuestion,'left','text',parentDiv,'');
            }
        }
    }else if(jsonData.kind === 'waterfall'){  /* added by nisha on 20-02-2020 to generate waterfall chart  */
        console.log("Inside waterfall"+divName)		
        divName = "waterfall_"+divName;
        sendMessage(jsonData.infer,"left","graph",divName,'waterfall');
        {
            //addToLogs(jsonData.ques, jsonData.infer, "waterfall_"+divName, ''); //for retrieval by other functions and end log
			addToLogs(jsonData.ques, jsonData.infer,divName, jsonData.caption); //for retrieval by other functions and end log
            formatjson(divName,jsonData);
        }
        var charttreeData = [], columnData = [], min = 0, max = 0; 	
  	
        for(var i=0; i < fileContent.data.length;i++){
              columnData.push(fileContent.data[i]);
        }
        console.log('nisha',columnData);
        console.log('parentDiv1 :'+divName);
        console.log('parentDiv2 :'+columnData);
        console.log('parentDiv3 :'+colors);
        console.log('parentDiv4 :'+fileContent.columns);
        console.log('parentDiv5 :'+jsonData.title);
        console.log('parentDiv6 :'+promptQuestion);
        console.log('parentDiv7 :'+parentDiv);

        generatewaterfall(divName,columnData, colors, fileContent.columns, jsonData.title, promptQuestion,parentDiv);	
    }else if(jsonData.kind === 'treemapgoogle'){
        // alert('hi');
        // console.log('Column Data : ' + jsonData);
        // console.log(jsonData.ques);
        //console.log(parentDiv);
        //var charttreeData = [], columnData = [], min = 0, max = 0; 	
        divName='treemap_'+divName;
		//alert(divName);
        sendMessage(jsonData.infer,"left","graph",divName,'treemap');
        
        //if(store)
        {
            addToLogs(jsonData.ques, jsonData.infer, divName, jsonData.caption); //for retrieval by other functions and end log
            formatjson(divName,jsonData);
        }
        /*var chartDataMap =[['Country', ''+fileContent.columns[0]]];
        for(var i=0;i<fileContent.index.length;i++){
            chartDataMap.push([fileContent.index[i][0],fileContent.data[i][0]]);
        }*/
        //alert('Prompt Question : ' + promptQuestion);
        
        console.log('file Content : ')
        console.log(fileContent);
       
        
        console.log('file Get Contents : ')
        console.log(fileContent.data.length);        
        
        var chartDataMap = [];
        for(var i=0;i<fileContent.data.length;i++)
        {
            //['Global',    null,                 0,                               0],
            //console.log('Name : '+ fileContent.data[i][0] + ' Value 1 : ' + fileContent.data[i][1] + ' Value 2 : ' + fileContent.data[i][2]  + ' Value 3 : ' + fileContent.data[i][3] );
            chartDataMap.push(fileContent.data[i]);
        }
        //console.log('Chartdata Map : ');
        console.log(chartDataMap);
        
      	generateGoogleTreeMap(divName, chartDataMap, jsonData.title, jsonData.xlabel,promptQuestion,parentDiv);        
            
    }
    /*else if(jsonData.kind === 'treemap'){
            // alert('hi');
            console.log('Column Data : ' + jsonData);
            console.log(jsonData.ques);
            console.log(colors);
            console.log(fileContent.columns);
            console.log(fileContent.data);
            console.log(jsonData.title);
            //console.log(parentDiv);
            var charttreeData = [], columnData = [], min = 0, max = 0; 	
  		
            var columnData = [
            {
                category: 'All Others',
                amt: 40.8
            },
            {
                category: 'TCCC',
                amt: 25
            },
            {
                category: 'Private Label',
                amt: 14.3
            },
            {
                category: 'PepsiCo',
                amt: 10.7
            },
            {
                category: 'Nestle',
                amt: 4.4
            },
            {
                category: 'Danone',
                amt: 2.5
            },
            {
                category: 'Dr. Pepper',
                amt: 2
            },
            {
                category: 'Red Bull',
                amt: 0.3
            }
        ];
                
            /*min = fileContent.data[0][0];
            for(var i=0; i < fileContent.columns.length;i++){
                columnData[i] = [];
                for(var j=0; j < fileContent.data.length; j++){
                    if(fileContent.data[j][i] > max){
                        max = fileContent.data[j][i];
                    }
                    if(fileContent.data[j][i] < min){
                        min = fileContent.data[j][i];
                    }
                    columnData[i].push(fileContent.data[j][i]);
                }
            }*/
            // alert(columnData[0]);
            /*console.log('Column Data : ' + columnData);
            alert('parentDiv :'+parentDiv);
            alert('Div Name :  ' + divName);
            generateTreeMap(divName,columnData, colors, fileContent.columns, jsonData.title, jsonData.prompt_ques,parentDiv);
	}*/
	else{
            // alert("Kind 3 : " + jsonData.kind);
            sendMessage(jsonData.infer,"left","graph",divName,jsonData.caption);
            //if(store)
            {
                addToLogs(jsonData.ques, jsonData.infer, divName, jsonData.caption); //for retrieval by other functions and end log
                formatjson(divName,jsonData);
            }
            if(jsonData.kind === 'scatter'){
                //alert("Kind 4 : " + jsonData.kind);
                var chartDataScatter = [];
                var newColors = [];
                //alert("Index Of : " + fileContent.index.indexOf);
                //if(fileContent.index.indexOf("Tccc") != -1 || fileContent.index.indexOf("Pepsico") != -1 ){ //Commented on 01-OCT-2018, Pratik.
                if(fileContent.index.indexOf("Tccc") != -1 || fileContent.index.indexOf("Pepsico") != -1 || fileContent.index.indexOf("Danone") != -1 ||fileContent.index.indexOf("Nestle") != -1  || fileContent.index.indexOf("Private Label") != -1 || fileContent.index.indexOf("Red Bull") != -1 || fileContent.index.indexOf("Pepper") != -1 || fileContent.index.indexOf("All Others") != -1 || fileContent.index.indexOf("Industry") != -1  ){ //Added on 01-OCT-2018, Pratik.
                    for(var i=0;i<fileContent.index.length;i++){
                        //alert("Index : " + fileContent.index[i]);
                        if(fileContent.index[i].toLowerCase() === 'tccc'){
                            newColors[i] = HASH + TCCC_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'pepsico'){
                            newColors[i] = HASH + PEPSICO_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'danone'){
                            newColors[i] = HASH + DANONE_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'nestle'){
                            newColors[i] = HASH + NESTLE_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'private label'){
                            newColors[i] = HASH + PVTLABEL_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'red bull'){
                            newColors[i] = HASH + REDBULL_COLOR;
                        }else if(fileContent.index[i].toLowerCase() ===  'dr. pepper'){
                            newColors[i] = HASH + PEPPER_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'all others'){
                            newColors[i] = HASH + OTHERS_COLOR;
                        }else if(fileContent.index[i].toLowerCase() === 'industry'){
                            newColors[i] = HASH + INDUSTRY_COLOR;
                        }else{
                            //newColors[i] = colors[i+1];//Commented on 01-OCT-2018, Pratik.
                            newColors[i] = colors[i+1];//Added on 01-OCT-2018, Pratik. Industry Color Code
                        }
                    }
                }else{
                newColors = colors.slice(0,fileContent.index.length);//Commented on 01-OCT-2018, Pratik.
                //newColors = '#bf9000';//Added on 01-OCT-2018, Pratik. Industry Color Code                
            }
            for(var i=0;i<fileContent.data.length;i++){	  		
                chartDataScatter.push({
                    data: [{
                        x : fileContent.data[i][0],
                        y : fileContent.data[i][1]
                    }],
                    label : fileContent.index[i],
                    backgroundColor: newColors[i],//colors[i],
                    pointRadius: 5
                });
            }
            generateScatter(divName, chartDataScatter, jsonData,promptQuestion,parentDiv);	
        }else if(jsonData.kind === 'bubble'){
            //alert("Kind 5 : " + jsonData.kind);
            var chartDataBubble = []; 
            var maxDataPt = fileContent.data[0][2];
            //alert("Index Of 2 : " + fileContent.index.indexOf);
            //if(fileContent.index.indexOf("Tccc") != -1 || fileContent.index.indexOf("Pepsico") != -1 ){ //Commented on 01-OCT-2018, Pratik.
            if(fileContent.index.indexOf("Tccc") != -1 || fileContent.index.indexOf("Pepsico") != -1 || fileContent.index.indexOf("Danone") != -1 ||fileContent.index.indexOf("Nestle") != -1  || fileContent.index.indexOf("Private Label") != -1 || fileContent.index.indexOf("Red Bull") != -1 || fileContent.index.indexOf("Pepper") != -1 || fileContent.index.indexOf("All Others") != -1 || fileContent.index.indexOf("Industry") != -1  ){ //Added on 01-OCT-2018, Pratik.
                for(var i=0;i<fileContent.index.length;i++){
                    //alert("Index 2 : " + fileContent.index[i]);
                    if(fileContent.index[i].toLowerCase() === 'tccc'){
                        newColors[i] = HASH + TCCC_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'pepsico'){
                        newColors[i] = HASH + PEPSICO_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'danone'){
                        newColors[i] = HASH + DANONE_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'nestle'){
                        newColors[i] = HASH + NESTLE_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'private label'){
                        newColors[i] = HASH +  PVTLABEL_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'red bull'){
                        newColors[i] = HASH + REDBULL_COLOR;
                    }else if(fileContent.index[i].toLowerCase() ===  'dr. pepper'){
                        newColors[i] = HASH + PEPPER_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'all others'){
                        newColors[i] = HASH + OTHERS_COLOR;
                    }else if(fileContent.index[i].toLowerCase() === 'industry'){
                        newColors[i] = HASH + INDUSTRY_COLOR;
                    }else{
                        //newColors[i] = colors[i+1];//Commented on 01-OCT-2018, Pratik.
                        newColors[i] = colors[i+1];//Added on 01-OCT-2018, Pratik. Industry Color Code
                    }
                }
            }else{
                newColors = colors.slice(0,fileContent.index.length);//Commented on 01-OCT-2018, Pratik.
                //newColors = '#bf9000';//Added on 01-OCT-2018, Pratik. Industry Color Code
            }
            for(var i=0;i<fileContent.data.length;i++){	  		
                chartDataBubble.push({
                    data: [{
                        x : fileContent.data[i][0],
                        y : fileContent.data[i][1],
                        r : Math.round((fileContent.data[i][2]*30)/maxDataPt)
                    }],
                    label : fileContent.index[i],
                    backgroundColor: newColors[i] //colors[i]
                });
            }
            generateBubble(divName, chartDataBubble, jsonData,promptQuestion,parentDiv);	  		
        }
		
			else{
            //alert("Kind 6 : " + jsonData.kind);
            var chartData = [], columnData = [], min = 0, max = 0; 	
  		
            min = fileContent.data[0][0];
            for(var i=0; i < fileContent.columns.length;i++){
                columnData[i] = [];
                for(var j=0; j < fileContent.data.length; j++){
                    if(fileContent.data[j][i] > max){
                        max = fileContent.data[j][i];
                    }
                    if(fileContent.data[j][i] < min){
                        min = fileContent.data[j][i];
                    }
                    columnData[i].push(fileContent.data[j][i]);
                }
            }
			//console.log('columnData : '+columnData);
            if(jsonData.kind === 'pie'){
                //alert("Kind 7 : " + jsonData.kind);
                generatePie(divName,columnData[0], colors, fileContent.index, jsonData.title, promptQuestion,parentDiv);
            }else if(jsonData.kind === 'doughnut'){
                //alert("Kind 8 : " + jsonData.kind);
                generateDoughnut(divName,columnData[0], colors, fileContent.index, jsonData.title, promptQuestion,parentDiv);
            }
			else{
				//alert(jsonData.kind);
                //alert("Kind 9 : " + jsonData.kind);
                //alert("Columns : " + fileContent.columns.length);
                for(var k=0;k<fileContent.columns.length;k++){
                    /* Added on 01-OCT-2018, Pratik. For Displaying Manufacture Specific Color Code. Starts Here. */
                    //var newColor2 = '';
                    var newColor2 = [];
                    var manufacture_name = fileContent.columns[k].toLowerCase();
                    //alert("Name : " + manufacture_name);
                    
                    //manufacture_name = fileContent.columns[k].toLowerCase();
                    
                    switch (manufacture_name) { 
                        case 'tccc': 
                            newColor2 = HASH + TCCC_COLOR;
                            break;
                        case 'pepsico': 
                            newColor2 = HASH + PEPSICO_COLOR;
                            break;
                        case 'danone': 
                            newColor2 = HASH + DANONE_COLOR;
                            break;
                        case 'nestle': 
                            newColor2 = HASH + NESTLE_COLOR;
                            break;
                        case 'private label': 
                            newColor2 = HASH +  PVTLABEL_COLOR;
                            break;
                        case 'red bull': 
                           newColor2 = HASH + REDBULL_COLOR;
                            break;
                        case 'dr. pepper': 
                            newColor2 = HASH + PEPPER_COLOR;
                            break;
                        case 'all others': 
                            newColor2 = HASH + OTHERS_COLOR;
                            break;
                        case 'industry': 
                            newColor2 = HASH + INDUSTRY_COLOR;
                            break;
                        default:
                            //alert("Length : " + columnData[k].length);
							//console.log("Length : " + columnData[k].length,fileContent);
                            /* Added on 04-OCT-2018, Pratik. For Single Column Bar for negative values display Green Color and Red Color for positive Color. Starts Here. */
                            if(parseInt(fileContent.columns.length) == parseInt(1)){
                                for(var kk=0;kk<columnData[k].length;kk++){
                                    if(parseFloat(columnData[k][kk]) < parseInt(0)){
                                        newColor2[kk] = HASH + RED_COLOR;//Coke Red
                                    }else{
                                        newColor2[kk] = HASH + GREEN_COLOR;//All Others Green
                                    }
                                }
                            }else{
								//console.log(HASH + DARK_GREEN_COLOR);
                                //newColor2 = colors[k];
								newColor2 = colors[k];
                            }
                            /* For Single Column Bar for negative values display Green Color and Red Color for positive Color. Ends Here. */
                            //newColor2 = colors[k];//Comented on 04-OCT-2018, Pratik.
                    }
                    //alert("New Colors : " + newColor2[k] + "Data : " + columnData[k]);
                    /* For Displaying Manufacture Specific Color Code. Ends Here. */
                    
                    if(jsonData.kind === 'line'){
                        // alert("Kind 10 : " + jsonData.kind);
						// alert(promptQuestion);
                        chartData.push({
                            label: fileContent.columns[k],
                            data: columnData[k],
                            //borderColor: colors[k],//Commented on 03-OCT-2018, Pratik.
                            borderColor: newColor2, //Added on 03-OCT-2018, Pratik.
                            backgroundColor: 'transparent',
                            //pointBorderColor: colors[k],//Commented on 01-OCT-2018, Pratik.
                            pointBorderColor: newColor2, //Added on 01-OCT-2018, Pratik.
                            pointBackgroundColor: '#fff',
                            pointRadius: 5,
                            fill: false
                        });
                    }
                    else{
                        /* Added on 05-OCT-2018, Pratik. To Hide Label i.e. Legend if Column Count is One. Starts Here. */
                        var colLabel    = fileContent.columns[k];
                        if(parseInt(fileContent.columns.length) == parseInt(1) && (jsonData.kind === 'bar' || jsonData.kind === 'barh')){
                            colLabel    = '';
                            legendBoolean= false;
                        }
                        /* To Hide Label i.e. Legend if Column Count is One. Ends Here. */
                        
                        chartData.push({
                            label: colLabel,//Modified on 05-OCT-2018, Pratik. Replaced "fileContent.columns[k]," with "colLabel,"
                            data: columnData[k],
                            //backgroundColor: colors[k] //Commented on 01-OCT-2018, Pratik.
                            backgroundColor: newColor2 //Added on 01-OCT-2018, Pratik.
                        });
                    }
                }
                // console.log(chartData);
                if(jsonData.ylabel.toLowerCase().indexOf("percent") !== -1){
                    if((1.2 * max) > 100){
                        max = 82;
                    }
                    if((0.8 * max) < 0){
                        min = 0;
                    }
                }
                //Changes By Chetan//
                if(jsonData.kind === 'bubblebarh'){ 
                    //alert("Kind 12 : " + jsonData.kind);
                    generateBarBubbleHorizontal(divName,chartData, jsonData, min , max, promptQuestion,parentDiv, fileContent.index);
                }
                if(jsonData.kind === 'bubblebar'){ //BarBubble Chart Drawing Starts Here//
                    //alert("Kind 12 : " + jsonData.kind);
                    generateBarBubble(divName,chartData, jsonData, min , max, promptQuestion,parentDiv, fileContent.index);                    
                }
				//End of code//
                else if(jsonData.kind === 'stackedBar'){//stackedBar Chart Drawing Starts Here//
                    //alert("Kind 13 : " + jsonData.kind);
                    generateStackedBar(divName,chartData, jsonData, min , max, promptQuestion,parentDiv, fileContent.index);
                }
                else{
                    //alert("Kind 14 : " + jsonData.kind);
                    //stackedBar Chart Drawing Ends Here//
                    //alert("Legend Boolean : " + legendBoolean);
                    var chartOptions = {
                        title: {
                            display: true,
                            text: jsonData.title,
                            fontSize: 16            
                        },
                        legend: { //Added on 05-OCT-2018, Pratik. To Show / Hide Legend Color Box
                            display: legendBoolean
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: jsonData.xlabel
                                },
                                gridLines: {
                                    display:false
                                },
                                ticks: {
                                    suggestedMin: 0.8*min, //min - 0.2*min,
                                    suggestedMax: 1.2*max ,// max + 0.2*max ,
                                    autoSkip: false
                                }  
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: jsonData.ylabel
                                },
                                gridLines: {
                                    display:false				                    
                                },
                                ticks: {
                                    suggestedMin: 0.8*min, //min - 0.2*min,
                                    suggestedMax: 1.2*max //max + 0.2*max	           					
                                }   
                            }]
                        }
                    };
                    if(jsonData.kind === 'barh'){
                        //alert("Kind 15 : " + jsonData.kind);
                        jsonData.kind = "horizontalBar";
						var tmp=chartOptions.scales.xAxes[0].scaleLabel.labelString;
						chartOptions.scales.xAxes[0].scaleLabel.labelString=chartOptions.scales.yAxes[0].scaleLabel.labelString;
						chartOptions.scales.yAxes[0].scaleLabel.labelString=tmp;
                    }
                    //alert("Kind 16 : " + jsonData.kind);
                    //Create chart
                    //console.log(divName);
                    //console.log($('#'+divName));
					
					
                    var respChart = new Chart($('#'+divName), {
                        type: jsonData.kind,
                        data: {
                            labels: fileContent.index,
                            datasets: chartData
                        },
                        options: chartOptions		  
                    });
                    // console.log(respChart);
                    if(respChart){
                        if(promptQuestion != ''){
                            sendMessage(promptQuestion,'left','text',parentDiv,'');
                        }
                    }
                }
            }
        }	  	
    }	  
};

generateTreeMap = function(divName,columnData, colors, fileContent, jsonData, promptQuestion,parentDiv){
	//alert('divname :' + divName);
	alert('promptQuestion :' +promptQuestion);
	// var ctx = document.getElementById("chart-area3").getContext("2d");
	// var tm = window.chart3 = new Chart(ctx, {
	var tm  = new Chart($('#'+divName), {
        //var tm  = new Chart($('.plotSpacetree'), {
            
	  type: "treemap",
	  data: {
		datasets: [
		  {
                    tree: columnData,
                    key: "amt",
                    groups: ['category'],
                    spacing: -0.5,
                    borderWidth: 0.5,
                    fontColor: "black",
                    borderColor: "rgba(200,200,200,1)",
                    hoverBackgroundColor: "rgb(128,0,128)"
		  }
		]
	  },
	  options: {
		maintainAspectRatio: false,
		title: {
		  display: true,
		  text: fileContent // call with column in array
		},
		legend: {
		  display: false
		},
		tooltips: {
		  callbacks: {
			title: function(item, data) {
			  var item = item[0];
                          //alert('Data : ' + data.datasets[item.datasetIndex].data[item.index].g);
			  return data.datasets[item.datasetIndex].data[item.index].g;
			},
			label: function(item, data) {
			  var dataset = data.datasets[item.datasetIndex];
			  var dataItem = dataset.data[item.index];
			  var obj = dataItem._data;
                          //alert('Label : ' + dataset.key + ": " + dataItem.v);
			  return dataset.key + ": " + dataItem.v;
			}
		  }
		}
	  }
	});
        alert('Tm : ' + tm);
        console.log('Tm : ' + tm);
	if(tm){
            alert('Pravin is it ok ');
            alert('Prompt Question 2 :  ' + promptQuestion);
            if(promptQuestion != ''){
                alert('Final Send Message');
                alert('Div Name :  ' + divName + ' Parent Div : ' + parentDiv);
                sendMessage(promptQuestion,'left','graph',parentDiv,'');
                //sendMessage(promptQuestion,'left','text',divName,'');
            }
        }else{
            alert('No Charts Found');
        }
};


/*------Function to create pie charts------------*/
generatePie = function (divName,dataValue, chartColors, labels, title, promptQuestion,parentDiv){
    Chart.defaults.pieLabels = Chart.helpers.clone(Chart.defaults.pie);
	
    var helpers = Chart.helpers;
    var defaults = Chart.defaults;
	
    Chart.controllers.pieLabels = Chart.controllers.pie.extend({
        updateElement: function(arc, index, reset) {
	    var _this = this;
	    var chart = _this.chart,
	        chartArea = chart.chartArea,
	        opts = chart.options,
	        animationOpts = opts.animation,
	        arcOpts = opts.elements.arc,
	        centerX = (chartArea.left + chartArea.right) / 2,
	        centerY = (chartArea.top + chartArea.bottom) / 2,
	        startAngle = opts.rotation, // non reset case handled later
	        endAngle = opts.rotation, // non reset case handled later
	        dataset = _this.getDataset(),
	        circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
	        innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
	        outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,
	        custom = arc.custom || {},
	        valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
	
            helpers.extend(arc, {
                // Utility
                _datasetIndex: _this.index,
                _index: index,

                // Desired view properties
                _model: {
                    x: centerX + chart.offsetX,
                    y: centerY + chart.offsetY,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    circumference: circumference,
                    outerRadius: outerRadius,
                    innerRadius: innerRadius,
                    label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
                },	
                draw: function () {
                    var ctx = this._chart.ctx,
                        vm = this._view,
                        sA = vm.startAngle,
                        eA = vm.endAngle,
                        opts = this._chart.config.options;

                    var labelPos = this.tooltipPosition();
                    var segmentLabel = vm.circumference / opts.circumference * 100;

                    ctx.beginPath();

                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

                    ctx.closePath();
                    ctx.strokeStyle = vm.borderColor;
                    ctx.lineWidth = vm.borderWidth;

                    ctx.fillStyle = vm.backgroundColor;

                    ctx.fill();
                    ctx.lineJoin = 'bevel';

                    if (vm.borderWidth) {
                        ctx.stroke();
                    }						
                    if (vm.circumference > 0.15) { // Trying to hide label when it doesn't fit in segment
                        ctx.beginPath();
                        ctx.font = helpers.fontString(10, 'bold', opts.defaultFontFamily);
                        ctx.fillStyle = "#fff";
                        ctx.textBaseline = "top";
                        ctx.textAlign = "center";

                        // Round percentage in a way that it always adds up to 100%
                        ctx.fillText(segmentLabel.toFixed(0) + "%", labelPos.x, labelPos.y);
                    }
                }
            });
	
            var model = arc._model;
            model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
            model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
            model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
            model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

            // Set correct angles if not resetting
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
                }
                model.endAngle = model.startAngle + model.circumference;
            }
            arc.pivot();
        }
    });
    var newColors = [];
    //alert("Labels Of : " + labels);
    //if(labels.indexOf("Tccc") != -1 || labels.indexOf("Pepsico") != -1 ){ //Commented on 01-OCT-2018, Pratik.
    if(labels.indexOf("TCCC") != -1 || labels.indexOf("Pepsico") != -1 || labels.indexOf("Danone") != -1 || labels.indexOf("Nestle") != -1  || labels.indexOf("Private Label") != -1 || labels.indexOf("Red Bull") != -1 || labels.indexOf("Pepper") != -1 || labels.indexOf("All Others") != -1 || labels.indexOf("Industry") != -1 ){ //Added on 01-OCT-2018, Pratik.
        for(var i=0;i<labels.length;i++){
            if(labels[i].toLowerCase() === 'tccc'){
                newColors[i] = HASH + TCCC_COLOR;
                //alert("Labels : " + labels[i]);
            }else if(labels[i].toLowerCase() === 'pepsico'){
                newColors[i] = HASH + PEPSICO_COLOR;
            }else if(labels[i].toLowerCase() === 'danone'){
                newColors[i] = HASH + DANONE_COLOR;
            }else if(labels[i].toLowerCase() === 'nestle'){
                newColors[i] = HASH + NESTLE_COLOR;
            }else if(labels[i].toLowerCase() === 'private label'){
                newColors[i] = HASH +  PVTLABEL_COLOR;
            }else if(labels[i].toLowerCase() === 'red bull'){
                newColors[i] = HASH + REDBULL_COLOR;
            }else if(labels[i].toLowerCase() ===  'dr. pepper'){
                newColors[i] = HASH + PEPPER_COLOR;
            }else if(labels[i].toLowerCase() === 'all others'){
                newColors[i] = HASH + OTHERS_COLOR;
            }else if(labels[i].toLowerCase() === 'industry'){
                newColors[i] = HASH + INDUSTRY_COLOR;
            }else{
                //newColors[i] = chartColors[i+1];//Commented on 01-OCT-2018, Pratik.
                newColors[i] = colors[i+1];//Added on 01-OCT-2018, Pratik. Industry Color Code
            }
        }
    }else{
        newColors = chartColors.slice(0,dataValue.length);//Commented on 01-OCT-2018, Pratik.
        //newColors = '#bf9000';//Added on 01-OCT-2018, Pratik. Industry Color Code
    }
    var config = {
        type: 'pieLabels',
        data: {
            labels: labels,
            datasets: [{
                data: dataValue,
                backgroundColor: newColors //chartColors.slice(0,dataValue.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: title,
                fontSize: 16
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
    var ctx = $('#'+divName);
    var pieChart = new Chart(ctx, config);
		
    if(pieChart){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*-----------------------------------------------*/
/*------Function to create pie charts------------*/
generateDoughnut = function (divName,dataValue, chartColors, labels, title, promptQuestion,parentDiv){
    Chart.defaults.doughnutLabels = Chart.helpers.clone(Chart.defaults.doughnut);

    var helpers = Chart.helpers;
    var defaults = Chart.defaults;

    Chart.controllers.doughnutLabels = Chart.controllers.doughnut.extend({
        updateElement: function(arc, index, reset) {
            var _this = this;
            var chart = _this.chart,
                chartArea = chart.chartArea,
                opts = chart.options,
                animationOpts = opts.animation,
                arcOpts = opts.elements.arc,
                centerX = (chartArea.left + chartArea.right) / 2,
                centerY = (chartArea.top + chartArea.bottom) / 2,
                startAngle = opts.rotation, // non reset case handled later
                endAngle = opts.rotation, // non reset case handled later
                dataset = _this.getDataset(),
                circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI)),
                innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius,
                outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius,
                custom = arc.custom || {},
                valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

            helpers.extend(arc, {
            // Utility
            _datasetIndex: _this.index,
            _index: index,

            // Desired view properties
            _model: {
                x: centerX + chart.offsetX,
                y: centerY + chart.offsetY,
                startAngle: startAngle,
                endAngle: endAngle,
                circumference: circumference,
                outerRadius: outerRadius,
                innerRadius: innerRadius,
                label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
            },
            draw: function () {
                var ctx = this._chart.ctx,
                    vm = this._view,
                    sA = vm.startAngle,
                    eA = vm.endAngle,
                    opts = this._chart.config.options;
				
                    var labelPos = this.tooltipPosition();
                    var segmentLabel = vm.circumference / opts.circumference * 100;

                    ctx.beginPath();

                    ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
                    ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);

                    ctx.closePath();
                    ctx.strokeStyle = vm.borderColor;
                    ctx.lineWidth = vm.borderWidth;

                    ctx.fillStyle = vm.backgroundColor;

                    ctx.fill();
                    ctx.lineJoin = 'bevel';

                    if (vm.borderWidth) {
                        ctx.stroke();
                    }			
                    if (vm.circumference > 0.15) { // Trying to hide label when it doesn't fit in segment
                        ctx.beginPath();
                        ctx.font = helpers.fontString(opts.defaultFontSize, opts.defaultFontStyle, opts.defaultFontFamily);
                        ctx.fillStyle = "#fff";
                        ctx.textBaseline = "top";
                        ctx.textAlign = "center";
                        // Round percentage in a way that it always adds up to 100%
                        ctx.fillText(segmentLabel.toFixed(0) + "%", labelPos.x, labelPos.y);
                    }
                }
            });

            var model = arc._model;
            model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor);
            model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor);
            model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth);
            model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor);

            // Set correct angles if not resetting
            if (!reset || !animationOpts.animateRotate) {
                if (index === 0) {
                    model.startAngle = opts.rotation;
                } else {
                    model.startAngle = _this.getMeta().data[index - 1]._model.endAngle;
                }
                model.endAngle = model.startAngle + model.circumference;
            }
            arc.pivot();
  	}
    });
    var newColors = [];
    //alert("Labels Of 2 : " + labels);
    //if(labels.indexOf("Tccc") != -1 || labels.indexOf("Pepsico") != -1 ){ //Commented on 01-OCT-2018, Pratik.
    if(labels.indexOf("Tccc") != -1 || labels.indexOf("Pepsico") != -1 || labels.indexOf("Danone") != -1 || labels.indexOf("Nestle") != -1  || labels.indexOf("Private Label") != -1 || labels.indexOf("Red Bull") != -1 || labels.indexOf("Pepper") != -1 || labels.indexOf("All Others") != -1 || labels.indexOf("Industry") != -1 ){ //Added on 01-OCT-2018, Pratik.
        for(var i=0;i<labels.length;i++){
            if(labels[i].toLowerCase() === 'tccc'){
                newColors[i] = HASH + TCCC_COLOR;
                //alert("Labels 2: " + labels[i]);
            }else if(labels[i].toLowerCase() === 'pepsico'){
                newColors[i] = HASH + PEPSICO_COLOR;
            }else if(labels[i].toLowerCase() === 'danone'){
                newColors[i] = HASH + DANONE_COLOR;
            }else if(labels[i].toLowerCase() === 'nestle'){
                newColors[i] = HASH + NESTLE_COLOR;
            }else if(labels[i].toLowerCase() === 'private label'){
                newColors[i] = HASH +  PVTLABEL_COLOR;
            }else if(labels[i].toLowerCase() === 'red bull'){
                newColors[i] = HASH + REDBULL_COLOR;
            }else if(labels[i].toLowerCase() ===  'dr. pepper'){
                newColors[i] = HASH + PEPPER_COLOR;
            }else if(labels[i].toLowerCase() === 'all others'){
                newColors[i] = HASH + OTHERS_COLOR;
            }else if(labels[i].toLowerCase() === 'industry'){
                newColors[i] = HASH + INDUSTRY_COLOR;
            }else{
                //newColors[i] = chartColors[i+1];//Commented on 01-OCT-2018, Pratik.
                newColors[i] = colors[i+1];//Added on 01-OCT-2018, Pratik. Industry Color Code
            }
        }
    }else{
        newColors = chartColors.slice(0,dataValue.length);//Commented on 01-OCT-2018, Pratik.
        //newColors = '#bf9000';//Added on 01-OCT-2018, Pratik. Industry Color Code
    }
    var config = {
        type: 'doughnutLabels',
        data: {
            labels: labels,
            datasets: [{
                data: dataValue,
                backgroundColor: newColors //chartColors.slice(0,dataValue.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: title,
                fontSize: 16
            }	  	
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
    };
    var ctx = $('#'+divName);
    var pieChart = new Chart(ctx, config);

    if(pieChart){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*-----------------------------------------------*/
/*------Function to create scatter plots------------*/
generateScatter = function(divName, chartDataScatter, jsonData,promptQuestion,parentDiv){	
   var scatterChart = new Chart($('#'+divName), {
        type: 'scatter',
        data:  {
            datasets : chartDataScatter
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: jsonData.title,
                fontSize: 16
            },
            scales: {
                    xAxes: [{
                             scaleLabel: {
                                    display: true,
                                    labelString: jsonData.xlabel
                                 },
                                 gridLines: {
                                display:false				                    
                            }
                                }],
               yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: jsonData.ylabel
                    },
                    gridLines: {
                        display:false				                    
                    }
               }]
            }
        }
    });
    if(scatterChart){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*-----------------------------------------------*/
/*------Function to create Bubble plots------------*/
generateBubble = function(divName, chartDataBubble, jsonData, promptQuestion,parentDiv){
    var bubbleChart = new Chart($('#'+divName), {
        type: 'bubble',
        data:  {
            datasets : chartDataBubble
        },
        options: {
            tooltips : {
                enabled: false
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: jsonData.title,
                fontSize: 16
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: jsonData.xlabel
                    },
                    gridLines: {
                        display:false				                    
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: jsonData.ylabel
                    },
                    gridLines: {
                        display:false				                    
                    }
               }]
            }
        }
    });
    if(bubbleChart){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*-----------------------------------------------*/
/*------Function to create map charts------------*/
generateMap = function(divName, chartDataMap, title, colorOrder, promptQuestion,parentDiv){
    $( '<div style="font-size:16px; font-weight:bold; text-align: center; color: #6F6F6F;">'+title+'</div>' ).insertBefore( "#"+divName );
    google.charts.load('current', {
        'packages':['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    var mapColor;
    if(colorOrder === 'reverse'){
        mapColor = ['#00853f','#e0e002','#e31b23']
    }else{
        mapColor = ['#e31b23','#e0e002','#00853f'];
    }
    
    function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(chartDataMap);

        var options = {
            region: '142', //Asia
            colorAxis: {colors: mapColor}, //'black'
            backgroundColor: '#c9ecfc',
            datalessRegionColor: '#f2f2f2',
            defaultColor: '#f5f5f5',
            useCORS:true,
            allowTaint:false
        };

        var chart = new google.visualization.GeoChart(document.getElementById(divName));
        google.visualization.events.addListener(chart, 'ready', function () {
            $('#mapCharts').append('<img id="map_'+ divName +'" src="' + chart.getImageURI() + '">');
            if(promptQuestion != ''){
                sendMessage(promptQuestion,'left','text',parentDiv,'');
            }
        });
        chart.draw(data, options);
    };
};
/*-----------------------------------------------*/

/* added by nisha on 20-02-2020 to generate waterfall chart,starts here  */
generatewaterfall = function(divName,columnData, colors, fileContent, jsonData, promptQuestion,parentDiv){
	 
    //$( '<div style="font-size:16px; font-weight:bold; text-align: center; color: #6F6F6F;">kkk</div>' ).insertBefore( "#"+divName );
    console.log(columnData);    
    var chart = ""
	google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(
               columnData , true
            );  

            var options = {
              legend: 'none',
              bar: { groupWidth: '100%' }, // Remove space between bars.
              candlestick: {
                fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
                risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
              }
            };

            chart = new google.visualization.CandlestickChart(document.getElementById(divName));
            chart.draw(data, options);
        }
	if(chart){
        if(promptQuestion != ''){
            //console.log("The prompt question is ".promptQuestion)
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/* added by nisha on 20-02-2020 to generate waterfall chart,ends here  */

/*------ Added on 20-FEB-2020, Pratik. Function to create Google Tree Map Charts Starts Here ------------*/
generateGoogleTreeMap = function(divName, chartDataMap, title, colorOrder, promptQuestion,parentDiv){
    console.log('divName '+divName);
    console.log('chartDataMap '+chartDataMap);
    console.log('title '+title);
    console.log('colorOrder '+colorOrder);
    console.log('promptQuestion '+promptQuestion);
    console.log('parentDiv '+parentDiv);
    
    $( '<div style="font-size:16px; font-weight:bold; text-align: center; color: #6F6F6F;">'+title+'</div>' ).insertBefore( "#"+divName );
    console.log("the console log"+divName)
    google.charts.load('current', {'packages':['treemap']});
    google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable(chartDataMap,true);
        tree = new google.visualization.TreeMap(document.getElementById(divName));
        tree.draw(data, {
            minColor: '#f00',
            midColor: '#ddd',
            maxColor: '#0d0',
            headerHeight: 15,
            fontColor: 'black',
            showScale: true
        });
    }
    
};
/*------Function to create Google Tree Map Charts Ends Here ------------*/

/*------Function to create Stacked Bar Starts------------*/
generateStackedBar = function(divName, chartDataStackedBar, jsonData, min , max, promptQuestion,parentDiv, labels){
    var stackedBar = new Chart($('#'+divName), {
        type: 'bar',
        data:  {
            datasets : chartDataStackedBar,
            labels: labels
        },
        options: {
            title: {
                display: true,
                text: jsonData.title,
                fontSize: 16            
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: jsonData.xlabel
                    },
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        suggestedMin: 0.8*min, //min - 0.2*min,
                        suggestedMax: 1.2*max ,// max + 0.2*max ,
                        autoSkip: false
                    }  
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: jsonData.ylabel
                    },
                    gridLines: {
                        display:false				                    
                    },
                    ticks: {
                        suggestedMin: 0.8*min, //min - 0.2*min,
                        suggestedMax: 1.2*max //max + 0.2*max	           					
                    }   
                }]
            }
        }
    });
    //alert("Stacked Bar : " + stackedBar);
    if(stackedBar){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*------Function to create Stacked Bar Ends------------*/

/*------Function to create Bar Bubble Starts------------*/
generateBarBubble = function(divName, barChartData, jsonData, min , max, promptQuestion,parentDiv, labels){
    var bar_len = barChartData.length;
    var k = 0;
	var rating_edit = [];
    for(var i=0;i<bar_len;i++){
    	for(var j=i;j<jsonData.bubble_data.length;j=j+bar_len){
            rating_edit[k++]=jsonData.bubble_data[j];
        }
    } 
    var chartOptions = {
        title: {
            display: true,
            text: jsonData.title,
            fontSize: 16            
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: jsonData.xlabel
                },
                gridLines: {
                    display:false
                },
                ticks: {
                    suggestedMin: 0.8*min, //min - 0.2*min,
                    suggestedMax: 1.2*max ,// max + 0.2*max ,
                    autoSkip: false
                }  
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: jsonData.ylabel
                },
                gridLines: {
                    display:false				                    
                },
                ticks: {
                    suggestedMin: 0.8*min, //min - 0.2*min,
                    suggestedMax: 1.5*max //max + 0.2*max	           					
                }   
            }]
        },
	animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart,
                ctx11 = chartInstance.ctx;
				
                ctx11.font = Chart.helpers.fontString(10, Chart.defaults.global.defaultFontStyle, 'FontAwesome');
                ctx11.textAlign = 'center';
                ctx11.textBaseline = 'top';

                var ratings = rating_edit;//jsonData.bubble_data;
                var r_index = 0;
                //console.log(this.data.datasets[0]._meta[2]);
                this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        /*Code by chetan*/
                        var currentLengend=dataset.label;
                        var hiddenLegends=[];
                        meta.controller.chart.legend.legendItems.forEach(function(v){
                            if(v.hidden==true)
                            {
                                hiddenLegends.push(v.text);
                            }
                        });
                        /*End of code*/
                        meta.data.forEach(function (bar, index) {
                        var data = ratings[r_index++];
                        if($.inArray(currentLengend,hiddenLegends)===-1)//Code by chetan
						{//Code by chetan
							
                        // dataset.data[index];
                        var textClr = '#fff';//Added on 04-OCT-2018, Pratik. Bubble Bar Default Text Color White.
                        
                        var rectX = bar._model.x-25;
                        var rectY = bar._model.y-30;
                        var rectWidth = 50;
                        var rectHeight = 14;
                        var cornerRadius = 15;

                        var rating_x, rating_y;

                        if(data > 0){
                            ctx11.beginPath();
                            ctx11.fillStyle = "#006400";
                            ctx11.strokeStyle="#006400";
                            ctx11.fillBackgroundColor='#006400';

                            ctx11.moveTo(rectX+(cornerRadius/2),rectY+(cornerRadius/2));
                            ctx11.lineTo(rectX+(cornerRadius/2)+40,rectY+(cornerRadius/2));
                            ctx11.lineTo(rectX+(cornerRadius/2)+20,rectY+(cornerRadius/2)-30);
                            ctx11.fill();
                            rating_x = -2;
                            rating_y = 22;
                        }else if(data == 0){
                            ctx11.beginPath();
                            ctx11.fillStyle = '#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]
                            ctx11.strokeStyle='#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]
                            ctx11.fillBackgroundColor='#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]
                            ctx11.lineJoin = "round";
                            ctx11.lineWidth = cornerRadius;
                            textClr = '#000';//Added on 04-OCT-2018, Pratik. Bubble Bar Default Text Color Black since White Color not visible in Yellow background..

                            ctx11.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2)-5, rectWidth-cornerRadius, rectHeight-cornerRadius);
                            ctx11.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2)-5, rectWidth-cornerRadius, rectHeight-cornerRadius);
                            rating_x = 1;
                            rating_y = 22;
                        }else{
                            ctx11.beginPath();
                            ctx11.fillStyle = "#de2e2a";
                            ctx11.strokeStyle="#de2e2a";
                            ctx11.fillBackgroundColor='#de2e2a';

                            ctx11.moveTo(rectX+(cornerRadius/2)+40,rectY+(cornerRadius/2)-20);
                            ctx11.lineTo(rectX+(cornerRadius/2),rectY+(cornerRadius/2)-20);
                            ctx11.lineTo(rectX+(cornerRadius/2)+20,rectY+(cornerRadius/2)+10);
                            ctx11.fill();
                            rating_x = -2;
                            rating_y = 28;
                        }
                        ctx11.font = '8pt Calibri';
                        ctx11.textAlign = 'center';
                        ctx11.textBaseline = 'bottom';
                        ctx11.fillStyle = textClr;//Modified on 04-OCT-2018, Pratik. Replaced '#fff' with 'textClr'
                        ctx11.fillText(data ,bar._model.x-rating_x, bar._model.y-rating_y);
						}//Code by chetan
                        //console.log(data);
                    });
                });
            }
	}
    };
    //var ctx11 = document.getElementById(divName);
    var ctx11 = $('#'+divName);
    console.log("ctx11 : " + ctx11);
    //var barBubble = new Chart(ctx11, {
    var barBubble = new Chart(ctx11, { 
        type: 'bar',
        data: {
            labels: labels,
            datasets: barChartData
        },
        options: chartOptions
    });
    if(barBubble){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*------Function to create Bar Bubble Ends------------*/

/*------Code By Chetan------------*/
generateBarBubbleHorizontal = function(divName, barChartData, jsonData, min , max, promptQuestion,parentDiv, labels){
	$('#'+divName).closest('.wrapper_div').css('height','70vh');
    var bar_len = barChartData.length;
    var k = 0;
    var rating_edit = [];
    for(var i=0;i<bar_len;i++){
    	for(var j=i;j<jsonData.bubble_data.length;j=j+bar_len){
            rating_edit[k++]=jsonData.bubble_data[j];
        }
    } 
    var chartOptions = {
		legend: { position : 'top' },		
        title: {
            display: true,
            text: jsonData.title,
            fontSize: 16            
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [  { position:'top',barPercentage: 2,
					categoryPercentage: 2,
                scaleLabel: {
                    display: true,
					
                    labelString: jsonData.ylabel
                },
                gridLines: {
                    display:false
                },
                ticks: {
                    suggestedMin: 0.8*min, //min - 0.2*min,
                    suggestedMax: 1.2*max ,// max + 0.2*max ,
                    autoSkip: false,
					
                }  
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: jsonData.xlabel
                },
                gridLines: {
                    display:false				                    
                },
                ticks: {
                    suggestedMin: 0.8*min, //min - 0.2*min,
                    suggestedMax: 1.2*max //max + 0.2*max	           					
                }   
            }]
        },
	animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart,
                ctx11 = chartInstance.ctx;
                ctx11.font = Chart.helpers.fontString(5, Chart.defaults.global.defaultFontStyle, 'FontAwesome');
                ctx11.textAlign = 'center';
                ctx11.textBaseline = 'center';

                var ratings = rating_edit;//jsonData.bubble_data;
                var r_index = 0;
                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
					/*Code by chetan*/
					var currentLengend=dataset.label;
					var hiddenLegends=[];
					meta.controller.chart.legend.legendItems.forEach(function(v){
						if(v.hidden==true)
						{
							hiddenLegends.push(v.text);
						}
					});
					/*End of code*/
                    meta.data.forEach(function (bar, index) {
                        
                        var data = ratings[r_index++];// dataset.data[index];
						if($.inArray(currentLengend,hiddenLegends)===-1) //Code by chetan
						{ //Code by chetan
                        var rectX = bar._model.x;
                        var rectY = bar._model.y;
                        var rectWidth = 50;
                        var rectHeight = 14;
                        var cornerRadius = 15;

                        var rating_x, rating_y;
                        var textClr = '#fff';//Added on 04-OCT-2018, Pratik. Bubble Bar Default Text Color White.
                        
                        if(data > 0){
                            rectY+=7;
                            ctx11.beginPath();
                            ctx11.fillStyle = "#006400";
                            ctx11.strokeStyle="#006400";
                            ctx11.fillBackgroundColor='#006400';
							
                            ctx11.moveTo(rectX+(cornerRadius/2),rectY+(cornerRadius/2));
                            ctx11.lineTo(rectX+(cornerRadius/2)+40,rectY+(cornerRadius/2));
                            ctx11.lineTo(rectX+(cornerRadius/2)+20,rectY+(cornerRadius/2)-30);
                            ctx11.fill();
                            rating_x = 26;
                            rating_y = 14;
                        }else if(data == 0){
                            ctx11.beginPath();
                            ctx11.fillStyle = '#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]
                            ctx11.strokeStyle='#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]
                            ctx11.fillBackgroundColor='#FFFF00';//Modified on 04-OCT-2018, Pratik. Updated Color Code from '#ADD8E6'[Sky Blue] to '#FFFF00'[Yellow]ctx11.lineJoin = "round";
                            ctx11.lineWidth = cornerRadius;
                            textClr = '#000';//Added on 04-OCT-2018, Pratik. Bubble Bar Default Text Color Black since White Color not visible in Yellow background..
                            rectX+=5;
                            ctx11.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2)-5, rectWidth-cornerRadius, rectHeight-cornerRadius);
                            ctx11.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2)-5, rectWidth-cornerRadius, rectHeight-cornerRadius);
                            rating_x = 30;
                            rating_y = 8;
							
                        }else{
                            ctx11.beginPath();
                            ctx11.fillStyle = "#de2e2a";
                            ctx11.strokeStyle="#de2e2a";
                            ctx11.fillBackgroundColor='#de2e2a';

                            ctx11.moveTo(rectX+(cornerRadius/2)+40,rectY+(cornerRadius/2)-20);
                            ctx11.lineTo(rectX+(cornerRadius/2),rectY+(cornerRadius/2)-20);
                            ctx11.lineTo(rectX+(cornerRadius/2)+20,rectY+(cornerRadius/2)+10);
                            ctx11.fill();
                            rating_x = 25;
                            rating_y = 2;
                        }
                        ctx11.font = '8pt Calibri';
                        ctx11.textAlign = 'center';
                        ctx11.textBaseline = 'bottom';
                        ctx11.fillStyle = textClr;//Modified on 04-OCT-2018, Pratik. Replaced '#fff' with 'textClr'
                        ctx11.fillText(data ,bar._model.x+rating_x, bar._model.y + rating_y);
                        //console.log(data);
						} //Code by chetan
                    });
                });
            }
	}
    };
    //var ctx11 = document.getElementById(divName);
    var ctx11 = $('#'+divName);
    console.log("ctx11 : " + ctx11);
    //var barBubble = new Chart(ctx11, {
    var barBubble = new Chart(ctx11, { 
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: barChartData
        },
        options: chartOptions
    });
    if(barBubble){
        if(promptQuestion != ''){
            sendMessage(promptQuestion,'left','text',parentDiv,'');
        }
    }
};
/*------End of code------------*/

