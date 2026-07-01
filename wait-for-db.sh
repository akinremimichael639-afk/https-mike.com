#!/bin/bash

# Wait for database to be available before starting
echo "Waiting for database to be available..."

max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
    echo "✅ Database is available"
    exit 0
  fi
  echo "Attempt $attempt/$max_attempts - Database not ready, waiting..."
  sleep 2
  attempt=$((attempt + 1))
done

echo "❌ Database did not become available in time"
exit 1
