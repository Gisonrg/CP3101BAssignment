<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();

	if (isset($_REQUEST['login'])) {
		$reply['message'] ='';
		$data = json_decode($_REQUEST['login'], true);
		// get the login data
		$name = $data['name'];
		$pwd = $data['password'];
		//connect and query the database
		$dbconn = db_connect();
		$result = pg_prepare($dbconn, "", 'SELECT * FROM users WHERE name = $1');
		$result = pg_execute($dbconn, "", array("$name"));

		// HASH FUNCTION USED: sha1()
		// SALT USED: 'DoItNow'
		$pwd = sha1($pwd.'DoItNow');
		
		//check the database's return result
		while ($row = pg_fetch_array($result)) {
			if ($row['password'] == $pwd) {

				//store user state in the session
				$_SESSION['valid_user'] = $name;
				$_SESSION['valid_id'] = $row['id'];
				$_SESSION['valid_level'] = $row['level'];
				$_SESSION['valid_exp'] = $row['exp'];
				
				$reply['status'] = "Success"; //success
			} else {
				$reply['status'] = 'Error';
				$reply['message'] = 'Invalid password';
			}
		}

		if (!isset($_SESSION['valid_user']) && !isset($reply['status'])) {
			$reply['status'] = 'Error';
			$reply['message'] = 'User does not exist';
		}
	} 
	
	echo json_encode($reply);

?>