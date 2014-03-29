<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();

    $reply['receive'] = false;

	if (isset($_REQUEST['task'])) {
		$reply = true;
		$task = array();
		$reply['status'] = "Success";
		$data = json_decode($_REQUEST['task'], true);

		//connect and query the database
		$dbconn = db_connect();
		$result = pg_prepare($dbconn, "", 'SELECT * FROM tasks WHERE id = $1');
		$result = pg_execute($dbconn, "", array($data['task_id']));

		
		if (!$result) {
			$reply['status'] = "Error";
			goto end;
		}

		//check the database's return result
		$row = pg_fetch_array($result);
		$reply['task'] = $row;
		
		
	} else {
		$reply['status'] = "Error";
	}		
		
	
	end:
	echo json_encode($reply);
?>