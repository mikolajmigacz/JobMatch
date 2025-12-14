#!/bin/sh
set -e

# Wait for LocalStack to be ready
DYNAMODB_ENDPOINT="${DYNAMODB_ENDPOINT:-http://localstack:4566}"
echo "Waiting for DynamoDB at $DYNAMODB_ENDPOINT..."

max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if curl -s "$DYNAMODB_ENDPOINT" > /dev/null 2>&1; then
    echo "✅ DynamoDB is ready"
    break
  fi
  attempt=$((attempt + 1))
  echo "Attempt $attempt/$max_attempts: Waiting for DynamoDB..."
  sleep 1
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ DynamoDB failed to start after $max_attempts attempts"
  exit 1
fi

# Start the application
exec "$@"
