#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# A basic way to wait for the database server to come online
#
sleep 30

#
# Create base resources
#
/opt/mssql-tools18/bin/sqlcmd -U sa -P $MSSQL_SA_PASSWORD -d master -C -i /tmp/initscripts/create-database-and-user.sql
if [ $? -ne 0 ]; then
  echo 'Problem encountered creating database and logins'
  exit 1
fi

#
# Create the schema with the -I option to prevent quoted identifier errors
#
/opt/mssql-tools18/bin/sqlcmd -U sa -P $MSSQL_SA_PASSWORD -d idsvr -C -I -i /tmp/initscripts/mssql-create_database.sql
if [ $? -ne 0 ]; then
  echo 'Problem encountered creating the database schema'
  exit 1
fi


#
# Create the schema with the -I option to prevent quoted identifier errors
#
/opt/mssql-tools18/bin/sqlcmd -U idsvruser -P 'Password1' -d idsvr -C -I -i /tmp/initscripts/insert-test-user.sql
if [ $? -ne 0 ]; then
  echo 'Problem encountered creating the database schema'
  exit 1
fi
