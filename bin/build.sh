#!/bin/sh
set -x
set -e
npm install --only=dev
NODE_ENV=production $(npm bin)/webpack --config=webpack.config.js -p --env production
npm prune --production

