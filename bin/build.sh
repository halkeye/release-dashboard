#!/bin/sh
set -x
set -e
npm install --only=dev
$(npm bin)/webpack --config=webpack.config.js -p
npm prune --production

