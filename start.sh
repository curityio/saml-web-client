#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

#
# Create a high entropy secret with which express-session signs cookies
#
export COOKIE_SECRET=$(openssl rand 32 | xxd -p -c 64)

#
# Run the app and import other environment variables
#
node --env-file=.env --import=tsx --watch src/app.ts
