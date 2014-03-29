<?php

require_once("config.inc");

// Define global constant
define('DB_USERNAME', $db_user); //database username
define('DB_PASSWORD', $db_password); //database user password
define('DB_HOST', 'localhost'); //database address
define('DB_PORT', '5432');
define('DB_NAME', $db_name); //database name
define('SESSION_SAVED', 'sessions'); //database name


function db_connect() {
	$dbconn = pg_connect("host=".DB_HOST." port=".DB_PORT." dbname=".DB_NAME." user=".DB_USERNAME." password=".DB_PASSWORD);
	if(!$dbconn){
		echo("Can't connect to the database");	
		exit;
	}
	return $dbconn;
}


















?>