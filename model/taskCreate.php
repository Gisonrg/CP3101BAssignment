<?php
	require_once("db.php");
	require_once("../config/config.inc");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    $reply['receive'] = false;
    if (isset($_REQUEST['create_task'])) {
        $reply['receive'] = true;
		$data = json_decode($_REQUEST['create_task'], true);
		// get the task info
		$userid = $_SESSION['valid_id'];
		$title = $data['title'];
		$description = $data['description'];
		$duration = $data['duration'];
		// //connect and query the database
		$dbconn = db_connect();		

		$result = pg_prepare($dbconn, "", 'insert into tasks values(nextval(\'tasks_id_seq\'), $1 , $2 , $3, $4, $5);');
		$result = pg_execute($dbconn, "", array($userid, $title, $description, $duration, $duration));

		if ($result) {
			$reply['status'] = "Success";
		} else {
			$reply['status'] = "Error";
		}
	}

	echo json_encode($reply);
?>