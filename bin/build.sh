#!/bin/sh
set -x
set -e
export NODE_ENV=dev
npm install --only=dev
$(npm bin)/webpack --config=webpack.config.js -p
npm prune --production

