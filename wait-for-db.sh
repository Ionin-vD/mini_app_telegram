#!/bin/bash

# Ожидание готовности PostgreSQL
until pg_isready -h db -p 5432 -U postgres; do
  echo "Ожидание PostgreSQL..."
  sleep 2
done

echo "PostgreSQL готов!"