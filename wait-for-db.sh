#!/bin/bash

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Ожидание доступности $host:$port..."
until nc -z "$host" "$port"; do
  echo "База данных недоступна, жду..."
  sleep 2
done

echo "База данных доступна, запускаем команду..."
exec $cmd
