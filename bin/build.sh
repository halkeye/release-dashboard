#!/bin/sh
set -x
set -e
npm install --only=dev
npm run build:prod
npm prune --production

