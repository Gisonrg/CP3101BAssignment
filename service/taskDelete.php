<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    if (isset($_REQUEST['delete_task'])) {
		$taskid = json_decode($_REQUEST['delete_task'], true);
		// get the task info
		$userid = $_SESSION['valid_id'];

		// connect and query the database
		$dbconn = db_connect();	
		$result = pg_prepare($dbconn, "", 'delete from tasks where id=$1 and userid = $2');
		$result = pg_execute($dbconn, "", array($taskid, $userid));	

		// delte task here!

		if ($result) {
			$reply['status'] = "Success";
		} else {
			$reply['status'] = "Error";
		}
	}

	echo json_encode($reply);
?>