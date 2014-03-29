<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    $reply['receive'] = false;
    if (isset($_REQUEST['task'])) {
    	$reply['status'] = 'Success';
        $reply['receive'] = true;
		$data = json_decode($_REQUEST['task'], true);
		// get the task info
		$userid = $_SESSION['valid_id'];
		$taskid = $data['task_id'];
		// connect and query the database to retrieve info for user and task
		$dbconn = db_connect();
		$result1 = pg_prepare($dbconn, "user", 'SELECT * FROM users WHERE id=$1');
		$result1 = pg_execute($dbconn, "user", array($userid));
		if (!$result1) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Retrieving user info failed';
		}

		$result2 = pg_prepare($dbconn, "task", 'SELECT * FROM tasks WHERE id=$1');
		$result2 = pg_execute($dbconn, "task", array($taskid));
		if (!$result2) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Retrieving task info failed';
		}

		$task = pg_fetch_array($result2);
		$user = pg_fetch_array($result1);

		// updating remainingslot
		$remainingslot = $task['remainingslot'] - 1;
		$result3 = pg_prepare($dbconn, "do", 'UPDATE tasks SET remainingslot=$2 WHERE id=$1');
		$result3 = pg_execute($dbconn, "do", array($taskid, $remainingslot));
		if (!$result3) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Doing task failed';
		}

		// adding exp
		$total = $task['totalslot'];
		$new_exp = $user['exp'] + 25 / $total;
		$new_level = ceil($new_exp / 20);
		$flag = 0;
		if ($new_level > $user['level']) {
			$flag = 1;
		}

		$result4 = pg_prepare($dbconn, "add_exp", 'UPDATE users SET exp=$2, level=$3 WHERE id=$1');
		$result4 = pg_execute($dbconn, "add_exp", array($userid, round($new_exp), $new_level));
	 
	 	if (!$result4) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Adding exp failed';
		}

		// if ($flag == 1) {
		// 	if ((event_level_up($userid)) && ($result)) {
		// 		return true;
		// 	} else {
		// 		return false;
		// 	}
		// } else if ($result) {
		// 	return true;
		// } else {
		// 	return false;
		// }

		
		// if (($row['remainingslot'] == 0) && (event_task_completed($id))) {
		// 	return true;
		// } else {
		// 	return false;
		// }
	}

	echo json_encode($reply);
?>