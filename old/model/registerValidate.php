<?php
	header('Content-Type: application/json');

    $reply = array();
    $reply['receive'] = false;

    if (isset($_REQUEST['register'])) {
        $reply['receive'] = true;
    	$data = json_decode($_REQUEST['register'], true);
    	// get the register data
    	// only check the email and pwd here
    	$email = $data['email'];
    	$pwd1 = $data['password'];
    	$pwd2 = $data['password_retype'];

    	// check the email address first

    	if (strstr($email, '@') && strstr($email, '.')){
            $reg = '/[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*$/';
            if(!preg_match($reg, $email)){
            	$reply['status'] = "Error";
            	$reply['message'] = "Invalid email address";
            }
        } else {
            $reply['status'] = "Error";
            $reply['message'] = "Invalid email address";
        }

        // check whether the password match
        if ($pwd1 != $pwd2) {
        	$reply['status'] = "Error";
        	if (isset($reply['message'])) {
            	$reply['message'] = $reply['message']." and passwords do not match";
            } else {
    			$reply['message'] = "Passwords do not match";
            }
        }

        if (!isset($reply['status'])) {
    		$reply['status'] = "Success";
        }
    }
	
	echo json_encode($reply);

?>