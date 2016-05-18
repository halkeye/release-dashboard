#!/bin/sh
NODE_ENV=dev npm install
webpack --config=webpack/webpack.config.js -p
npm prune --production"

