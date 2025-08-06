#/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Get the SAML verification key from the Curity Identity Server
#
if [ ! -f default-signing-key.pem ]; then
  echo 'Please copy an default-signing-key.pem file into the root folder before running the application'
  exit 1
fi
export ASSERTION_VERIFICATION_CERTIFICATE=$(cat default-signing-key.pem)

#
# Create a cookie encryption key for the web application
#
export COOKIE_ENCRYPTION_KEY=$(openssl rand 32 | xxd -p -c 64)

#
# Run the app and import environment variables
#
node --env-file=.env --import=tsx --watch src/app.ts
