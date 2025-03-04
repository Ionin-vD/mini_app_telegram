#!/bin/bash

cp /app

while true; do
    git pull origin main
    pkill -f index_https_manag.js
    node index_https_manag.js
    sleep 10
done