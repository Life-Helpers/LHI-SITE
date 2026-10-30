#!/bin/sh
# Container start: copy data from Neon on the first run (if asked), then start the website.
set -e
node scripts/migrate-from-neon.mjs
exec node server.js
