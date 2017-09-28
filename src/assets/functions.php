<?php

 function call_api($url, $data_json)
{
		$ch = curl_init();
	        curl_setopt($ch, CURLOPT_URL, $url);
	        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_json)));
	        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
	        curl_setopt($ch, CURLOPT_POSTFIELDS,$data_json);
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	        $response  = curl_exec($ch);
	        //print_r($response);
	        $rezultat = json_decode($response,true);
	        curl_close($ch);
		return $rezultat;
 
}

function timex($time)
{
	$za = explode("-",$time);
	$tm = $za[2]."/".$za[1]."/".$za[0];
	return $tm;
}


?>
