#!/bin/sh
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
cd /Users/pt/FeedMeI
exec node /Users/pt/FeedMeI/node_modules/.bin/expo start --web --port 8082
