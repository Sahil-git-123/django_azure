<?php
//header("HTTP/1.0 400 Timeout");
header('Access-Control-Allow-Origin: *');
include '../classes/dbclass.php';
include '../classes/pcache.php';
/*=================Code By Chetan=================*/
date_default_timezone_set('Asia/Kolkata'); 
define('DEBUG', false); 
error_reporting(E_ALL); 
//ini_set('max_execution_time', 2);
if (DEBUG)
{
    ini_set('display_errors', 'On');        
}
else
{
    ini_set('display_errors', 'Off');
}
//print_r($_POST);
if(isset($_POST['action']) && $_POST['action']!='signIn' && $_POST['action']!='forgotPwd' && $_POST['action']!='addLog')
{
    $deleted=$vc->checkUserDeleted($_POST['user_id']);
    if($deleted==='true')
    { 
        echo json_encode($responseValue = array(
            "status" => 401,
            "error"=>"User does not exists!"
        ));
        die;
    }   
}
/*=================End=================*/
if($_POST['action'] === 'feedbackDate'){
    $respFBdate=$vc->getFeedbackDate($_POST['emailID'],$_POST['clientID']);
    echo json_encode($respFBdate);

}else if($_POST['action'] === 'userFeedback'){
    $respUserFB=$vc->logUserFb($_POST);
    echo json_encode($respUserFB);
}else if($_POST['action'] === 'addLog')
{ 
    //print_r ($_POST);
    if(isset($_SESSION['first_name']) && $_SESSION['first_name']!='')
    {
      $_POST['userID'] = $_SESSION['first_name'];
    }
   		
    if(isset($_POST['pyResponse']))
    {
        $logdetails=json_decode($_POST['pyResponse']);
        $cnt=0;
        if(empty($logdetails)!==true)
        {

            foreach($logdetails as $ld)
            {
                $log_detail =  (array) $ld;
                $responseFromDetails = $vc->addToLogDetails($log_detail,$_POST['recordDate'],$_POST['sessionID'],$_POST['logged_user_id']);
                $cnt++;
            }

        }
        $responseFromMaster = $vc->addToLogMaster($_POST);
        echo json_encode($responseFromMaster);
    }
    else{
        $responseFromMaster = $vc->addToLogMaster($_POST);
        echo json_encode($responseFromMaster);
    }
    }
    else if($_POST['action'] === 'signIn'){
	   	$responseFromSignIn = $vc->checkUser($_POST);
	    if(isset($responseFromSignIn['error'])){
	    	$_SESSION['error'] = "Incorrect login credentials.";
	    }else{
	    	$_SESSION['email']=$responseFromSignIn["email"]; 
			$_SESSION['first_name']=$responseFromSignIn["first_name"];
		//$_SESSION['fb_date']=$responseFromSignIn["fb_date"];
            /*===============Added By Chetan=================*/
            $_SESSION['process_ids']=$responseFromSignIn["process_ids"];
            $_SESSION['client_id']=$responseFromSignIn["client_id"];
            $_POST['ipaddress']=getRealIpAddr();
            $_POST['geolocation']=file_get_contents("http://ipinfo.io/".$_POST['ipaddress']."/json");
            $affRows=$vc->addHistory($_POST);
            /*=================   End   =================*/

        }
		echo json_encode($responseFromSignIn);
   }
/*------Added by Richa - for inference suggestion on dislike-----------*/
   else if($_POST['action'] === 'inferSuggest'){
   	   $responseFromInferSuggestion = $vc->inferSuggestion($_POST);
	    echo json_encode($responseFromInferSuggestion);	    
        }	
/*-------------------------------------------------------------------*/
   /*===============Added By Chetan=================*/
   else if($_POST['action'] === 'getProcessList'){ 
        $response = $vc->getProcessList($_POST);
        echo json_encode($response);
    }
    else if($_POST['action'] === 'getQuestionTipsList'){
        $response = $vc->getQuestionTipsList($_POST);
        echo json_encode($response);
    }
   /*=================   End   =================*/
   else if($_POST['action'] === 'callPython'){
	   print_r($_POST['action'] === 'callPython');
	   die;
	 //echo("python ". $_POST['python_ver'] ." ../py/".$_POST["pythonFile"]  ." \"".$_POST['question']."\"  \"".$_POST['userID']."\"");
	 
        /*=========================Code By Chetan============================*/
        if (strpos($_POST["pythonFile"], '_6.py') !== false) 
        {	
            if(isset($_POST['python_ver'])){
            // echo 'hii';
            // die;
                exec("python". $_POST['python_ver'] ." ../py/".$_POST["pythonFile"]  ." \"".$_POST['question']."\"  \"".$_POST['userID']."\"", $responseFromPython);
            }else{
                exec("python ../py/".$_POST["pythonFile"]  ." \"".$_POST['question']."\"  \"".$_POST['userID']."\"", $responseFromPython);
            }
            // print_r($responseFromPython.'\n');
            $arrLength = count($responseFromPython);
            $stringOutput = "";

            for($i=0;$i<$arrLength;$i++){
                $stringOutput=$stringOutput.$responseFromPython[$i];
            }
            $sendOutput= json_decode($stringOutput);
            $sendOutput= json_encode($sendOutput);
        }
        /*elseif(strpos($_POST["pythonFile"], '_8.py') !== false) //Nielsen Process [Only Uncomment for Local Server]
        {
            if(isset($_POST['python_ver'])){
                $post = [
                    'question' => $_POST["question"],
                    'userID' => $_POST["userID"]
                ];
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "http://192.168.0.64/coke/pyapi.php");
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
                $responseFromPython = curl_exec($ch);
                curl_close($ch);                
            }else{
                $post = [
                    'question' => $_POST["question"],
                    'userID' => $_POST["userID"]
                ];
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "http://192.168.0.64/coke/pyapi.php");
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
                $responseFromPython = curl_exec($ch);
                curl_close($ch);
            } 
            //$arrLength = count($responseFromPython);
            //$stringOutput = "";
            //echo "Arr Length : " . $arrLength . "\n\n";
            //for($i=0;$i<$arrLength;$i++){
                //$stringOutput=$stringOutput.$responseFromPython[$i];
            //}
            //$sendOutput= json_decode($stringOutput);
            $sendOutput= json_decode($responseFromPython);
            $sendOutput= json_encode($sendOutput);
        }*/
        else
        {
		 // $arrdata = "{kind: 'treemap',title: 'Estimation Amount across month in year 2018',caption: '',ques: 'What is aggregated estimation cost of internet ad given across month in the year 2018 ',xlabel: 'Estimation Month',file: '{'text':['Switchable key and groups'],'index':['All Others','TCCC','Private Label','PepsiCo','Nestle','Danone','Dr. Pepper','Red Bull'],'data':[[40.8],[25],[14.3],[10.7],[4.4],[2.5],[2],[0.3]]}',ylabel: 'Estimation Amount (millions rupees)',infer: 'Mar-2018 has witnessed maximum estimation amount of Rs.1,251.14 millions for internet'
		// }";
		// $arrdata = [
			// kind=> "barh",
			// Est_nos=> [48, 44, 34, 21, 13, 22, 37, 21, 24, 38],
			// title=> "Top 10 estimates in January-2018",
			// caption=> "",
			// ques=> "What is top 10 estimated cost of ad given in Jan 2018",
			// xlabel=> "Estimation Amount (millions rupees)",
			// file=> "{'columns':['ESTIMATE_AMT'],'index':['2018-01-22','2018-01-23','2018-01-17','2018-01-19','2018-01-11','2018-01-30','2018-01-18','2018-01-15','2018-01-04','2018-01-31'],'data':[[135.27],[79.19],[69.18],[66.45],[57.57],[52.07],[46.05],[39.35],[35.57],[35.04]]}",
			// ylabel=> "Estimation Date",
			// infer=> "Top 10 estimates in January-2018(Bar represents Estimation Cost whereas Rectangles represents Estimation Numbers in chart)"
		// ];
		
                ### Added on 20-FEB-2020, Nisha. Waterfall Charts Array. Starts Here. ###
		$arrdata = [
			kind=> 'waterfall',
			title=>'Estimation Amount across month in year 2018',
			caption=>'waterfall',
			ques=>'what is ytd volume share for all manufacturers',
			prompt_ques=>'<b>Would you also like to ask</b> : What is the YTD Value Share for All Manufacturers within SSD for World(Top 32) in Jun-19?',
			xlabel=>'Estimation Month',
			file=>"{'columns':['Switchable key and groups'],'index':['June-18','Core Sparkling','Water','RTD Tea','Sports Drinks Bull'],'datavalue':[174568,174568,179568,179568,234],'data':[['June-18', 174568,174568,179568,179568],['Core Sparkling', 179568,179568,183000,183000],['Water', 183000,183000,190000,190000],['RTD Tea', 190000,190000,180000,180000],['Sports Drinks', 180000,180000,165000,165000]]}",
			ylabel=>'Estimation Amount (millions rupees)',
			infer=>'Mar-2018 has witnessed maximum estimation amount of Rs.1,251.14 millions for internet',
			staticques=> "what is ytd volume share for all manufacturers"
		];
                
                ### Waterfall Charts Array. Ends Here. ###
                
                ### Added on 20-FEB-2020, Pratik. Google Charts Tree Map Array. Starts Here. ###
                /*$arrdata = [
				kind=> 'treemapgoogle',
				title=>'Estimation Amount across month in year 2018',
				caption=>'treemapgoogle',
				ques=>'what is ytd volume share for all manufacturers',
				prompt_ques=>'what is ytd volume share for all manufacturers',
				xlabel=>'Estimation Month',
				//file=>"{'columns':['Switchable key and groups'],'index':['All Others','TCCC','Private Label','PepsiCo','Nestle','Danone','Dr. Pepper','Red Bull'],'data':[[40.8],[25],[14.3],[10.7],[4.4],[2.5],[2],[0.3]]}",
							//file=>"{'columns':['Switchable key and groups'],'index':['June-18','Core Sparkling','Water','RTD Tea','Sports Drinks Bull'],'datavalue':[174568,174568,179568,179568,234],'data':[['June-18', 174568,174568,179568,179568],['Core Sparkling', 179568,179568,183000,183000],['Water', 183000,183000,190000,190000],['RTD Tea', 190000,190000,180000,180000],['Sports Drinks', 180000,180000,165000,165000]]}",
							file=>"{'columns':['Switchable key and groups'],'index':['All Others','TCCC','Private Label','PepsiCo','Nestle','Danone','Dr. Pepper','Red Bull'],'datavalue':[174568,174568,179568,179568,234],'data':[['Global','',0,0],['America','Global',0,0],['Europe','Global',0,0],['USA','America',52,31],['France','Europe',42,-11]]}",
				ylabel=>'Estimation Amount (millions rupees)',
				infer=>'Mar-2018 has witnessed maximum estimation amount of Rs.1,251.14 millions for internet'
			];*/
                ### Google Charts Tree Map Array. Ends Here. ###
			
				/*if(isset($_POST['python_ver'])){
                    exec("python". $_POST['python_ver'] ." ../py/".$_POST["pythonFile"]  ." \"".$_POST['question']."\"  \"".$_POST['userID']."\"", $responseFromPython);
                }else{
                    exec("python ../py/".$_POST["pythonFile"]  ." \"".$_POST['question']."\"  \"".$_POST['userID']."\"", $responseFromPython);
                }            
                // print_r($responseFromPython.'\n');
                $arrLength = count($responseFromPython);
                $stringOutput = "";

                for($i=0;$i<$arrLength;$i++){
                    $stringOutput=$stringOutput.$responseFromPython[$i];
                }
                //$sendOutput= json_decode($stringOutput);//Commented on 18-SEP-2018, Pratik. 
                ### Added on 18-SEP-2018, Pratik. To Fix Python Response as per Question. Now "staticques" Array Key will maintain Question Post to Ptyhon and will be checked against the same in response. Starts Here ###
                $PythonOutput= json_decode($stringOutput,true);//Added on 18-SEP-2018, Pratik. To convert json string to PHP Array variable.
                $StaticQuesArr = array('staticques'=>$_POST['question']);//Added on 18-SEP-2018, Pratik. To Append Static Question to Python response array, it will be used for comparing the question.
                if($arrLength >= 1){
                    $sendOutput = array();
                    $sendOutput = array_merge($PythonOutput,$StaticQuesArr);
                }else{
                    $sendOutput= json_decode($stringOutput);
                }*/
                ### To Fix Python Response as per Question. Now "staticques" Array Key will maintain Question Post to Ptyhon and will be checked against the same in response. Ends Here ###
				
                $sendOutput= json_encode($arrdata);
                //$cache_obj->put($key,$stringOutput);//Commented on 18-SEP-2018, Pratik.
                /*
                $cache_obj->put($key,$sendOutput);//Added on 18-SEP-2018, Pratik. Now Adding "staticques" Array to cache
			$sendOutput= json_encode($arrdata);
		  // $sendOutput= json_encode($arrdata);
		  // var_dump(json_decode($sendOutput));
		  // die;
		  //print_r($sendOutput);die;
		  
        }
        /*=========================End============================*/
		}
        echo $sendOutput;
   }
   else if($_POST['action'] === 'forgotPwd'){
        $responseFromForgotPwd = $vc->forgotPwd($_POST);
        echo json_encode($responseFromForgotPwd);
   }
   else if($_POST['action'] === 'sendEmail'){
        //exec("python ../py/send_email.py 'helpdesk@brand-scapes.com' 'gsbsw432!!' '" .$POST['emailID'] ."'", $output,$i);
        exec("python ../py/send_email.py \"helpdesk@brand-scapes.com\" \"gsbsw432!!\" \"".$_POST['emailID']."\"", $output,$i);
        $arrLength = count($output);
        $stringOutput = "";
		
        for($i=0;$i<$arrLength;$i++){
          $stringOutput=$stringOutput.$output[$i];
        }
        echo json_encode(array("status" => 200));	    
   }
   else if($_POST['action'] === 'destroySession'){
        if(session_destroy ()){
            $vc->end_connection();
            $resp = array(
                "status" => 200
            );
        }
        else{
            $resp = array(
                "status" => 500
            );
        }
        echo json_encode($resp);
    }
   	/*CODE OF AAKASH*/
    else if($_POST['action'] === 'updateProfile'){
        $responseUpdateProfile = $vc->updateProfile($_POST);
        echo json_encode($responseUpdateProfile);
    }
    else if($_POST['action'] === 'getProfile'){
        $responseGetProfile = $vc->getProfile($_POST['user_id']);
        echo json_encode($responseGetProfile);
    }
    else if($_POST['action'] === 'updateProfilePic'){
        $responseupdateprofilepic = $vc->updateProfilePic($_POST);
        echo json_encode($responseupdateprofilepic);
    }
    else if($_POST['action'] === 'changePassword'){
		// print_r($_POST);
		// print_r($_POST['email']);
		// die;
        $responsechangePassword = $vc->changePassword($_POST,$_POST['email']);
        echo json_encode($responsechangePassword);
    }
    /*EOF CODE OF AAKASH*/
    //start code added by srini on 06-APR-2018
    else if($_POST['action'] === 'emptyFolder'){
        $image = $vc->delete_files($_POST['folder_name']);   		
    }  
    else if($_POST['action'] === 'convert_base_64_string_to_img'){
        $image = $vc->base64_to_jpeg($_POST['img_base_64_value'],$_POST['img_name']);   		
    }   
    else if($_POST['action'] === 'generatePPT')
    {
        $email=$_POST['email'];
        $dir_path="../uploads/$email";
        if(!file_exists($dir_path))
        {
            mkdir($dir_path, 0777, true);
        }
        $dir_name=date('Ymdhis');
        $dir_path="../uploads/$email/$dir_name";
        if(!file_exists($dir_path))
        {
            mkdir($dir_path, 0777, true);
        }
        $inputString="";
        $index=0;
        foreach($_POST['img_base_64_value'] as $img)
        {
            $name=md5(microtime().uniqid()).".jpg";
            $file_path=$dir_path."/".$name;
            $file = fopen( $file_path, "wb" );
            fwrite( $file, base64_decode( $img) );
            fclose( $file );
            $inputString.="../uploads/$email/$dir_name/$name";
            $inputString.="^".$_POST['title'][$index];
            $inputString.="^".$_POST['caption'][$index];
	    $inputString.="^".$_POST['source'][$index];
            $inputString.="*";
            $index++;
        }

	foreach($_POST['tblString'] as $tblStr){
            $inputString.=$tblStr;				
	}

        //echo $inputString;
        $pptName = $vc->generatePPT($_POST['presentation_name'],$inputString,$_POST['sample_name'],$_POST['device']);
        echo json_encode($pptName);
    }
    //end code added by srini on 06-APR-2018
    /*=================Code By Chetan=================*/
    else 
    {
        header("HTTP/1.0 400 Bad Request");
    }
    /*=================End=================*/
    
   /*=================Code By Chetan=================*/
    function getRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
            $ip=$_SERVER['HTTP_CLIENT_IP'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
            $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
            $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
   /*=================End=================*/
?>