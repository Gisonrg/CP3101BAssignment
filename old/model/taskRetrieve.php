<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();

    $reply['receive'] = true;

	if (isset($_SESSION['valid_user'])) {
		$tasks = array();
		$reply['status'] = "Success";
		$user_id = $_SESSION['valid_id'];

		//connect and query the database
		$dbconn = db_connect();
		$result = pg_prepare($dbconn, "", 'SELECT * FROM tasks WHERE userid = $1 ORDER BY id DESC');
		$result = pg_execute($dbconn, "", array($user_id));

		
		if (!$result) {
			$reply['status'] = "Error";
			goto end;
		}

		//check the database's return result
		while ($row = pg_fetch_array($result)) {
			$tasks[] = $row;
		}

		$reply['tasks'] = $tasks;
		
		
	} else {
		$reply['status'] = "Error";
	}		
		
	
	end:
	echo json_encode($reply);
?>