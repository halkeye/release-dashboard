#!/bin/sh
set -x
export NODE_ENV=dev
npm install --only=dev
$(npm bin)/webpack --config=webpack/webpack.config.js -p
npm prune --production

