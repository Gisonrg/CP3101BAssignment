-- SCHEMA --

-- Dropping and creating a table for users(note PRIMARY KEY)
DROP TABLE users;
CREATE TABLE users (
	id serial PRIMARY KEY NOT NULL,
	name VARCHAR(20),
	password VARCHAR(40),
	level integer,
	exp integer,
	email VARCHAR(30)
);

-- Dropping and creating a table for task
DROP TABLE tasks;
CREATE TABLE tasks (
	id serial PRIMARY KEY NOT NULL,
	userid integer,
	title text,
	description text,
	totalslot integer,
	remainingslot integer
);

-- Dropping and creating a table for event archives
DROP TABLE events;
CREATE TABLE events (
	id serial PRIMARY KEY NOT NULL,
	time text,
	content text,
	type text
);