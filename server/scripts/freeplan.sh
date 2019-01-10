#!/usr/bin/bash
#Script to run automated sql queries
#Declaring mysql DB connection 

MASTER_DB_USER='testdbauser'
MASTER_DB_PASSWD='db@u$er2o16'
MASTER_DB_PORT='3160'
MASTER_DB_HOST='test-db.celtixdshllg.us-east-1.rds.amazonaws.com'
MASTER_DB_NAME='kommunicate_test'

env="$1"

if [ "$env" == "prod" ]; then
	echo "PROD: Restricitng features in free plan"
        MASTER_DB_USER='dbauser'
        MASTER_DB_PASSWD='db@pr0ddb'
	MASTER_DB_HOST='applozicdbserver.celtixdshllg.us-east-1.rds.amazonaws.com'
	MASTER_DB_NAME='kommunicate'
else
	echo "Restricitng features in free plan"
fi


#Prepare sql query
SQL_QUERY_BOT_STATUS="update users set bot_availability_status = 0 where type = 2 and bot_availability_status = 1 and application_id in (select a.application_id  from customers c join applications a on c.id = a.customer_id where c.subscription = 'startup' and c.created_at < (now() - interval 31 day));"
SQL_QUERY_ROUTING="update app_settings  settings join applications app on settings.application_id=app.application_id   join customers  c on app.customer_id  = c.id   set settings.agent_routing = 0, settings.bot_routing = 0 where (settings.agent_routing = 1 or settings.bot_routing = 1) and c.subscription = 'startup' and c.created_at < (now() - interval 31 day);"
SQL_QUERY_COLLECT_EMAIL="update app_settings set collect_email = 0 where collect_email = 1 and application_id in (select a.application_id  from customers c join applications a on c.id = a.customer_id where c.subscription = 'startup' and c.created_at < (now() - interval 31 day));"
#mysql command to connect to database

mysql -u$MASTER_DB_USER -p$MASTER_DB_PASSWD -h$MASTER_DB_HOST  -D$MASTER_DB_NAME <<EOF  
$SQL_QUERY_BOT_STATUS
$SQL_QUERY_ROUTING
$SQL_QUERY_COLLECT_EMAIL
CALL expire_agent_in_free_plan('$MASTER_DB_NAME');
EOF
echo "End of script"