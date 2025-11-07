#!/bin/bash

# Start LocalStack in background
/usr/local/bin/docker-entrypoint.sh &
LOCALSTACK_PID=$!

# Wait for LocalStack to be ready
for i in {1..60}; do
  if curl -s http://localhost:4566/_localstack/health 2>/dev/null | grep -q "\"services\""; then
    break
  fi
  sleep 1
done

# Verify LocalStack is ready
for i in {1..30}; do
  if awslocal dynamodb list-tables >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

sleep 2

# Create DynamoDB Tables
awslocal dynamodb create-table \
  --table-name Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  || true

awslocal dynamodb create-table \
  --table-name Jobs \
  --attribute-definitions \
    AttributeName=jobId,AttributeType=S \
    AttributeName=employerId,AttributeType=S \
    AttributeName=status,AttributeType=S \
  --key-schema \
    AttributeName=jobId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "IndexName=employerId-index,KeySchema=[{AttributeName=employerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=status-index,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  || true

awslocal dynamodb create-table \
  --table-name Applications \
  --attribute-definitions \
    AttributeName=applicationId,AttributeType=S \
    AttributeName=jobId,AttributeType=S \
    AttributeName=jobSeekerId,AttributeType=S \
  --key-schema \
    AttributeName=applicationId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "IndexName=jobId-index,KeySchema=[{AttributeName=jobId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=jobSeekerId-index,KeySchema=[{AttributeName=jobSeekerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  || true

awslocal dynamodb create-table \
  --table-name CVAnalysis \
  --attribute-definitions \
    AttributeName=analysisId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=analysisId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  || true

awslocal dynamodb create-table \
  --table-name EmailLogs \
  --attribute-definitions \
    AttributeName=emailId,AttributeType=S \
    AttributeName=recipientEmail,AttributeType=S \
    AttributeName=recipientUserId,AttributeType=S \
  --key-schema \
    AttributeName=emailId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "IndexName=recipientEmail-index,KeySchema=[{AttributeName=recipientEmail,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    "IndexName=recipientUserId-index,KeySchema=[{AttributeName=recipientUserId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
  || true

# Create SQS Queues
awslocal sqs create-queue \
  --queue-name email-queue-dlq \
  --attributes MessageRetentionPeriod=1209600 \
  || true

DLQ_URL=$(awslocal sqs get-queue-url --queue-name email-queue-dlq --query 'QueueUrl' --output text 2>/dev/null)
DLQ_ARN=$(awslocal sqs get-queue-attributes --queue-url "$DLQ_URL" --attribute-names QueueArn --query 'Attributes.QueueArn' --output text 2>/dev/null)

awslocal sqs create-queue \
  --queue-name email-queue \
  || true

# Set SQS attributes using JSON file to properly handle RedrivePolicy
QUEUE_URL=$(awslocal sqs get-queue-url --queue-name email-queue --query 'QueueUrl' --output text 2>/dev/null)

cat > /tmp/queue_attrs.json << EOF
{
  "VisibilityTimeout": "300",
  "MessageRetentionPeriod": "1209600",
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"$DLQ_ARN\",\"maxReceiveCount\":\"3\"}"
}
EOF

awslocal sqs set-queue-attributes \
  --queue-url "$QUEUE_URL" \
  --attributes file:///tmp/queue_attrs.json \
  || true

# Create S3 Bucket
awslocal s3 mb s3://jobmatch-bucket || true

# Configure CORS for S3
CORS_CONFIG='{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["http://localhost:4000", "http://localhost:4001", "http://localhost:4002", "http://localhost:3000"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

awslocal s3api put-bucket-cors \
  --bucket jobmatch-bucket \
  --cors-configuration "$CORS_CONFIG" || true

# Configure bucket policy
BUCKET_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::jobmatch-bucket/*"
    },
    {
      "Sid": "AllowPublicList",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::jobmatch-bucket"
    }
  ]
}'

awslocal s3api put-bucket-policy \
  --bucket jobmatch-bucket \
  --policy "$BUCKET_POLICY" || true

# Keep LocalStack running
wait $LOCALSTACK_PID
