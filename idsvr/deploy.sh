#/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Manage license details
#
if [ "$LICENSE_KEY" == '' ]; then

  if [ "$LICENSE_FILE_PATH" == '' ]; then
    echo 'Please provide a LICENSE_FILE_PATH environment variable'
    exit 1
  fi

  export LICENSE_KEY=$(cat $LICENSE_FILE_PATH | jq -r .License)
  if [ "$LICENSE_KEY" == '' ]; then
    echo 'An invalid license file was provided for the Curity Identity Server'
    exit 1
  fi
fi

#
# Force recreation of the configuration database
#
rm -rf cdb && mkdir cdb

#
# Force recreation of database data
#
rm -rf data && mkdir data

#
# Then run the deployment
#
docker compose up
