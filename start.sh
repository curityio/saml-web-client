#/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Load the SAML verification key for the Curity Identity Server
#
if [ ! -f default-signing-key.pem ]; then
  echo 'Please copy a default-signing-key.pem file into the root folder before running the application'
  exit 1
fi
export ASSERTION_VERIFICATION_CERTIFICATE=$(cat default-signing-key.pem)

#
# Create a high entropy secret with which express-session signs cookies
#
export COOKIE_SECRET=$(openssl rand 32 | xxd -p -c 64)

#
# Run the app and import other environment variables
#
node --env-file=.env --import=tsx --watch src/app.ts
