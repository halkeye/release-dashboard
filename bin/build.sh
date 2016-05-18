#!/bin/sh
export NODE_ENV=dev
npm install
$(npm bin)/webpack --config=webpack/webpack.config.js -p
npm prune --production

