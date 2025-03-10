#!/bin/bash

cd /app

echo "Ожидание базы данных..."
wait-for-it db 5432 -- echo "База данных готова!"

while true; do
    echo "Обновление кода из Git..."
    git pull origin main

    echo "Перезапуск сервера..."
    pkill -f index_https_manag_docker.js
    node index_https_manag_docker.js &

    sleep 60
done
