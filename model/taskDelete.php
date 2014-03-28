<?php
	require_once("db.php");
	require_once("../config/config.inc");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    $reply['receive'] = false;
    if (isset($_REQUEST['delete_task'])) {
        $reply['receive'] = true;

		$data = json_decode($_REQUEST['delete_task'], true);
		// get the task info
		$userid = $_SESSION['valid_id'];

		// connect and query the database
		$dbconn = db_connect();		

		// delte task here!

		if ($result) {
			$reply['status'] = "Success";
		} else {
			$reply['status'] = "Error";
		}
	}

	echo json_encode($reply);
?>