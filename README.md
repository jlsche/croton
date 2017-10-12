# Docker images:
	1. python3: frolvlad/alpine-python3
	2. mysql: mysql/mysql-server
	3. rsyslog: voxxit/rsyslog
	4. mongo: mongo
	5. redis: redis
	5. node: node


# Setup:
	1. move your 'django' project to 'webiste/volume/' directory and name it 'django',
	make sure you have deleted the __pycache__ directory in your django project.

	2. dump your sql data to 'mysql' directory and name it croton.sql.
	(make sure you have add the 'status' column to CrotonTemplate table.)

	4. start: docker-compose up
	
	5. shutdown: docker-compose down


# Note:
	-- MySQL backup --
		1. backup mysql directory (might be useful when backup directory)
		docker run --rm --volume web_mysql_data:/var/lib/mysql --volume $(pwd):/data ubuntu:latest tar cvf /data/backup.tar /var/lib/mysql

		2. or simply backup the database (get .sql file)
		mysqldump -P 3306 -h 192.168.10.16 -u lingtelli -p croton > croton2.sql
	
	-- mongo backup --


# API:
	### data related
	- get user uploaded file		: GET	- ip:8000/static/data/{taskid}/{filename}

	### clustering related
	- logging to MongoDB			: POST	- ip:3000/log
	- get task list					: GET	- ip:8011/tasks (job not yet start clustering)
	- get job list					: GET	- ip:8011/jobs
	- get job detail				: GET	- ip:8011/jobs/{taskid}



# To-Do:


# Port:
	- 3000  : log server (receive logging for clustering)
	- 3006	: Claude's clustering api
	- 3306	: mysql
	- 3333	: backend 
	- 5514	: logging (for web)
	- 8000	: web
	- 8011	: watcher
	- 27017	: mongo
