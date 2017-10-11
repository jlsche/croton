# Docker images:
	1. python3: frolvlad/alpine-python3
	2. mysql: mysql/mysql-server
	3. rsyslog: voxxit/rsyslog
	4. mongo: mongo
	5. redis:
	5. node:


# Setup:
	1. move your 'django' project to 'webiste/volume/' directory and named it django,
	make sure you have deleted the __pycache__ directory in your django project

	1. #### move your 'log server' project to 'frontend' directory and named it logServer,
	make sure you have deleted the __pycache__ directory in your log server project

	2. dump your sql data to 'mysql' directory.

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
	### logging related

	### data related
	- get file				: GET	- ip:8000/static/data/{taskid}/{filename}

	### clustering related
	- logging to MongoDB	: POST	- ip:3000/log
	- get tasks				: GET	- ip:8011/tasks (job not yet start clustering)
	- get job detail		: GET	- ip:8011/jobs



# To-Do:
	## Redis:
		1. Need to save instance id and job id

	## Django:
		1. Previous rawdata might need to copy to /django/static/data/

	## MySQL:
		1. To record the status of clustering process, need to add status column to CrotonTemplate table in MySQL.

	2. Node read contianer sql db.

# Port:
	- 8000: web
	- 8011: watcher
	- 3000: log server (receive logging for clustering)
	- 3333: backend 
	- 3306: mysql
	- 27017: mongo
	- 5514: logging (for web)
	- 3006: Claude's clustering api
