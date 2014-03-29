<?php
	require_once("db.php");
	session_save_path(SESSION_SAVED);
	session_start();
	header('Content-Type: application/json');

	$reply = array();
    $reply['receive'] = false;


    function update_user($name, $email, $id, $password=false) {
		$dbconn = db_connect();
		if (!$password) {
			$result = pg_prepare($dbconn, "", 'update users set email=$1 where name=$2 and id=$3');
			$result = pg_execute($dbconn, "", array($email, $name, $id));
		} else {
			$result = pg_prepare($dbconn, "", 'update users set email=$1, password=$2 where name=$3 and id=$4');
			$result = pg_execute($dbconn, "", array($email,  $password, $name, $id));
		}
		if($result){
			return true;
		} else {
			return false;
		}
	}

    if (isset($_REQUEST['update'])) {
        $reply['receive'] = true;
		$data = json_decode($_REQUEST['update'], true);
		// get the user info
		$name = $data['name'];
		$email = $data['email'];


		// if the user want to change his password
		if ($data['oldpassword']!='' && $data['newpassword']!='') {
			// HASH FUNCTION USED: sha1()
			// SALT USED: 'DOITNOW'
			$old_pwd = sha1($data['oldpassword'].'DoItNow');
			$new_pwd = sha1($data['newpassword'].'DoItNow');

			//connect and query the database
			$dbconn = db_connect();		
			$result = pg_prepare($dbconn, "", 'select count(*) from users where name=$1 and password=$2');
			$result = pg_execute($dbconn, "", array($name, $old_pwd));

			if ($result) {
				if (pg_fetch_array($result)[0] >0) {
					$reply['status'] = "Success";
					// the old password is correct
					update_user($name, $email, $_SESSION['valid_id'], $new_pwd);
					goto end;
				} else {
					$reply['status'] = "Error";
					$reply['message'] = "Please verify your old password.";
					goto end;
				}
				
			} else {
				$reply['status'] = "Error";
				goto end;
			}
		} else {
			$reply['status'] = "Success";
			update_user($name, $email, $_SESSION['valid_id'], false);
		}
	}

	end:
	echo json_encode($reply);
?>