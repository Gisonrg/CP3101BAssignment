<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    $reply['receive'] = false;


	//-------------------------------------------------------------------------  
	// Update ==> Do a task
	//-------------------------------------------------------------------------
    if (isset($_REQUEST['dotask'])) {
    	$reply['status'] = 'Success';
        $reply['receive'] = true;

        // get the task info
		$taskid = json_decode($_REQUEST['dotask'], true);

		// get the user state
		$user_name = $_SESSION['valid_user'];
		$user_id = $_SESSION['valid_id'];
		$user_level = $_SESSION['valid_level'];
		$user_exp = $_SESSION['valid_exp'];


		// connect and query the database to retrieve info for user and task
		$dbconn = db_connect();

		$result2 = pg_prepare($dbconn, "task", 'SELECT * FROM tasks WHERE id=$1');
		$result2 = pg_execute($dbconn, "task", array($taskid));
		if (!$result2) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Retrieving task info failed';
			goto end;
		}

		$task = pg_fetch_array($result2);

		// updating remainingslot
		$result3 = pg_prepare($dbconn, "do", 'UPDATE tasks SET remainingslot=remainingslot-1 WHERE id=$1');
		$result3 = pg_execute($dbconn, "do", array($taskid));
		if (!$result3) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Doing task failed';
			goto end;
		}

		// adding exp
		$total = $task['totalslot'];
		$remainingslot = $task['remainingslot'] - 1;
		$new_exp = round($user_exp + 25 / $total);
		$new_level = ceil($new_exp / 20);

		// store changed data
		$_SESSION['valid_level'] = $new_level;
		$_SESSION['valid_exp'] = $new_exp;

		// wrap and send back user information
		$user = array();
		$user['level'] = $new_level;
		$user['exp'] = $new_exp;
		$reply['user'] = $user;

		// wrap and send back user information
		$task = array();
		$task['totalslot'] = (int)$total;
		$task['remainingslot'] = $remainingslot;
		$task['id']  = $taskid;
		$reply['task'] = $task;

		$result4 = pg_prepare($dbconn, "add_exp", 'update users set exp=$1 ,level=$2 WHERE id=$3');
		$result4 = pg_execute($dbconn, "add_exp", array($new_exp, $new_level, $user_id));
	 
	 	if (!$result4) {
			$reply['status'] = 'Error';
			$reply['message'] = 'Adding exp failed';
			goto end;
		}
	}
	//-------------------------------------------------------------------------  
	// Update ==> Edit a task
	//-------------------------------------------------------------------------
    if (isset($_REQUEST['edit_task'])) {
    	$reply['status'] = 'Success';
        $reply['receive'] = true;

        // get the task info
		$task = json_decode($_REQUEST['edit_task'], true);
		$taskid = $task['id'];

		// Prevent XSS attack
		// encode all html special chars
		$title = htmlspecialchars($task['title'], ENT_COMPAT,'ISO-8859-1', true);
		$description = htmlspecialchars($task['description'], ENT_COMPAT,'ISO-8859-1', true);

		// get the user state
		$userid = $_SESSION['valid_id'];
		
		// connect and query the database to retrieve info for user and task
		$dbconn = db_connect();

		$result = pg_prepare($dbconn, "update", 'UPDATE tasks SET title=$1, description=$2 WHERE id=$3 and userid = $4');
		$result = pg_execute($dbconn, "update", array($title, $description, $taskid, $userid));
		
		if (!$result) {
			$reply['status'] = 'Error';
			goto end;
		}	
	}

	end:
	echo json_encode($reply);
?>