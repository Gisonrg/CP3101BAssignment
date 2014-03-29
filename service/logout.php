<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
	if (isset($_REQUEST['logout'])) {
		//destroy session, log out
		unset($_SESSION['valid_user']);
		unset($_SESSION['valid_id']);
		unset($_SESSION['valid_level']);
		unset($_SESSION['valid_exp']);
		$reply['status'] = 'Success';
	} else {
		$reply['status'] = 'Error';
		$reply['message'] = 'Wrong log out request';
	}
	print json_encode($reply);

?>