#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# LocalStack init hook + schema migration runner
#
# Mounted at: /etc/localstack/init/ready.d/init-resources.sh
# Executed:   automatically by LocalStack after it becomes ready
#
# How it works
#   1. Ensures the internal _SchemaVersions table exists.
#   2. Reads the latest applied migration number from that table.
#   3. Runs every migration whose number is higher than the stored version.
#   4. Writes the new version back to _SchemaVersions.
#
# Adding a schema change
#   • Write a function: migration_NNN_descriptive_name()
#   • Register it in MIGRATIONS array at the bottom of this file.
#   • Each migration must be idempotent (|| true on already-existing resources).
#
# Table names / prefixes can be overridden via environment variables that
# docker-compose reads from the .env file.  Secrets (AWS keys, etc.) are
# already injected by docker-compose; this script uses awslocal which picks
# them up automatically.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configurable table names (override in .env / docker-compose env) ────────
TABLE_USERS="${DYNAMODB_TABLE_USERS:-Users}"
TABLE_JOBS="${DYNAMODB_TABLE_JOBS:-Jobs}"
TABLE_APPLICATIONS="${DYNAMODB_TABLE_APPLICATIONS:-Applications}"
TABLE_CV_ANALYSIS="${DYNAMODB_TABLE_CV_ANALYSIS:-CVAnalysis}"
TABLE_EMAILS="${DYNAMODB_TABLE_EMAILS:-EmailLogs}"
SQS_EMAIL_DLQ="${SQS_EMAIL_DLQ_NAME:-email-queue-dlq}"
SQS_EMAIL_QUEUE="${SQS_EMAIL_QUEUE_NAME:-email-queue}"
S3_BUCKET="${S3_BUCKET:-jobmatch-bucket}"
AWS_REGION="${AWS_DEFAULT_REGION:-us-east-1}"

VERSION_TABLE="_SchemaVersions"
VERSION_KEY="schema"

# ─── Helpers ─────────────────────────────────────────────────────────────────

table_exists() {
  awslocal dynamodb describe-table --table-name "$1" >/dev/null 2>&1
}

gsi_exists() {
  local table="$1" gsi="$2"
  awslocal dynamodb describe-table --table-name "$table" \
    --query "Table.GlobalSecondaryIndexes[?IndexName=='$gsi'].IndexName" \
    --output text 2>/dev/null | grep -q "$gsi"
}

get_schema_version() {
  awslocal dynamodb get-item \
    --table-name "$VERSION_TABLE" \
    --key "{\"id\":{\"S\":\"$VERSION_KEY\"}}" \
    --query 'Item.version.N' \
    --output text 2>/dev/null || echo "0"
}

set_schema_version() {
  awslocal dynamodb put-item \
    --table-name "$VERSION_TABLE" \
    --item "{\"id\":{\"S\":\"$VERSION_KEY\"},\"version\":{\"N\":\"$1\"},\"appliedAt\":{\"S\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}}" \
    >/dev/null
}

ensure_version_table() {
  if ! table_exists "$VERSION_TABLE"; then
    echo "  Creating version tracking table..."
    awslocal dynamodb create-table \
      --table-name "$VERSION_TABLE" \
      --attribute-definitions AttributeName=id,AttributeType=S \
      --key-schema AttributeName=id,KeyType=HASH \
      --billing-mode PAY_PER_REQUEST \
      >/dev/null
    # Wait for table to be active
    awslocal dynamodb wait table-exists --table-name "$VERSION_TABLE" 2>/dev/null || sleep 2
  fi
}

echo "🔧 Creating DynamoDB tables..."

awslocal dynamodb create-table \
# ─────────────────────────────────────────────────────────────────────────────
# MIGRATION 001: Initial schema
#   Creates all core tables, SQS queues, and S3 bucket.
#   Table names are read from env vars set in docker-compose / .env.
# ─────────────────────────────────────────────────────────────────────────────
migration_001_initial_schema() {
  echo "  [001] Creating DynamoDB tables..."

  table_exists "$TABLE_USERS" || awslocal dynamodb create-table \
    --table-name "$TABLE_USERS" \
    --attribute-definitions \
      AttributeName=userId,AttributeType=S \
      AttributeName=email,AttributeType=S \
    --key-schema \
      AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
      "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    >/dev/null

  table_exists "$TABLE_JOBS" || awslocal dynamodb create-table \
    --table-name "$TABLE_JOBS" \
    --attribute-definitions \
      AttributeName=jobId,AttributeType=S \
      AttributeName=employerId,AttributeType=S \
      AttributeName=status,AttributeType=S \
    --key-schema \
      AttributeName=jobId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
      "IndexName=employerId-index,KeySchema=[{AttributeName=employerId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
      "IndexName=status-index,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    >/dev/null

  table_exists "$TABLE_APPLICATIONS" || awslocal dynamodb create-table \
    --table-name "$TABLE_APPLICATIONS" \
    --attribute-definitions \
      AttributeName=applicationId,AttributeType=S \
      AttributeName=jobId,AttributeType=S \
      AttributeName=jobSeekerId,AttributeType=S \
    --key-schema \
      AttributeName=applicationId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
      "IndexName=jobId-index,KeySchema=[{AttributeName=jobId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
      "IndexName=jobSeekerId-index,KeySchema=[{AttributeName=jobSeekerId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    >/dev/null

  table_exists "$TABLE_CV_ANALYSIS" || awslocal dynamodb create-table \
    --table-name "$TABLE_CV_ANALYSIS" \
    --attribute-definitions \
      AttributeName=analysisId,AttributeType=S \
      AttributeName=userId,AttributeType=S \
    --key-schema \
      AttributeName=analysisId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
      "IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    >/dev/null

  table_exists "$TABLE_EMAILS" || awslocal dynamodb create-table \
    --table-name "$TABLE_EMAILS" \
    --attribute-definitions \
      AttributeName=emailId,AttributeType=S \
      AttributeName=recipientEmail,AttributeType=S \
      AttributeName=recipientUserId,AttributeType=S \
    --key-schema \
      AttributeName=emailId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
      "IndexName=recipientEmail-index,KeySchema=[{AttributeName=recipientEmail,KeyType=HASH}],Projection={ProjectionType=ALL}" \
      "IndexName=recipientUserId-index,KeySchema=[{AttributeName=recipientUserId,KeyType=HASH}],Projection={ProjectionType=ALL}" \
    >/dev/null

  echo "  [001] Creating SQS queues..."

  awslocal sqs create-queue \
    --queue-name "$SQS_EMAIL_DLQ" \
    --attributes MessageRetentionPeriod=1209600 \
    >/dev/null 2>&1 || true

  local dlq_url
  dlq_url=$(awslocal sqs get-queue-url --queue-name "$SQS_EMAIL_DLQ" --query 'QueueUrl' --output text)
  local dlq_arn
  dlq_arn=$(awslocal sqs get-queue-attributes \
    --queue-url "$dlq_url" --attribute-names QueueArn \
    --query 'Attributes.QueueArn' --output text)

  awslocal sqs create-queue \
    --queue-name "$SQS_EMAIL_QUEUE" \
    >/dev/null 2>&1 || true

  local queue_url
  queue_url=$(awslocal sqs get-queue-url --queue-name "$SQS_EMAIL_QUEUE" --query 'QueueUrl' --output text)

  cat > /tmp/queue_attrs.json << QEOF
{
  "VisibilityTimeout": "300",
  "MessageRetentionPeriod": "1209600",
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"$dlq_arn\",\"maxReceiveCount\":\"3\"}"
}
QEOF
  awslocal sqs set-queue-attributes \
    --queue-url "$queue_url" \
    --attributes file:///tmp/queue_attrs.json \
    >/dev/null 2>&1 || true

  echo "  [001] Creating S3 bucket..."

  awslocal s3 mb "s3://$S3_BUCKET" >/dev/null 2>&1 || true

  awslocal s3api put-bucket-cors \
    --bucket "$S3_BUCKET" \
    --cors-configuration '{
      "CORSRules": [{
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET","PUT","POST","DELETE","HEAD"],
        "AllowedOrigins": ["http://localhost:4000","http://localhost:4001","http://localhost:4002","http://localhost:3000"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
      }]
    }' >/dev/null 2>&1 || true

  awslocal s3api put-bucket-policy \
    --bucket "$S3_BUCKET" \
    --policy "{
      \"Version\": \"2012-10-17\",
      \"Statement\": [
        {
          \"Sid\": \"AllowPublicRead\",
          \"Effect\": \"Allow\",
          \"Principal\": \"*\",
          \"Action\": \"s3:GetObject\",
          \"Resource\": \"arn:aws:s3:::${S3_BUCKET}/*\"
        },
        {
          \"Sid\": \"AllowPublicList\",
          \"Effect\": \"Allow\",
          \"Principal\": \"*\",
          \"Action\": \"s3:ListBucket\",
          \"Resource\": \"arn:aws:s3:::${S3_BUCKET}\"
        }
      ]
    }" >/dev/null 2>&1 || true
}

# ─────────────────────────────────────────────────────────────────────────────
# ADD FUTURE MIGRATIONS BELOW
# Example:
#
# migration_002_add_notifications_table() {
#   echo "  [002] Adding Notifications table..."
#   table_exists "Notifications" || awslocal dynamodb create-table \
#     --table-name "Notifications" \
#     --attribute-definitions AttributeName=notificationId,AttributeType=S \
#     --key-schema AttributeName=notificationId,KeyType=HASH \
#     --billing-mode PAY_PER_REQUEST \
#     >/dev/null
# }
# ─────────────────────────────────────────────────────────────────────────────

# ─── Migration registry (add new entries here in order) ──────────────────────
MIGRATIONS=(
  "001:migration_001_initial_schema"
  # "002:migration_002_add_notifications_table"
)

# ─── Runner ───────────────────────────────────────────────────────────────────
echo "🚀 JobMatch — LocalStack schema migration runner"
echo "   Region: $AWS_REGION | Tables prefix: '${TABLE_USERS%Users}'"

ensure_version_table

current_version=$(get_schema_version)
echo "   Current schema version: $current_version"

latest_version="$current_version"
applied=0

for entry in "${MIGRATIONS[@]}"; do
  migration_num="${entry%%:*}"
  migration_fn="${entry##*:}"

  if [ "$migration_num" -gt "$current_version" ]; then
    echo "▶ Applying migration $migration_num..."
    $migration_fn
    set_schema_version "$migration_num"
    latest_version="$migration_num"
    applied=$((applied + 1))
    echo "  ✅ Migration $migration_num applied"
  fi
done

if [ "$applied" -eq 0 ]; then
  echo "✅ Schema is up to date (version $current_version)"
else
  echo "✅ Applied $applied migration(s) — schema is now version $latest_version"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "📋 Tables:  $(awslocal dynamodb list-tables --query 'TableNames' --output text | tr '\t' ', ')"
echo "📋 Queues:  $(awslocal sqs list-queues --query 'QueueUrls' --output text 2>/dev/null | xargs -r -I{} basename {} | tr '\n' ', ')"
echo "📋 Buckets: $(awslocal s3 ls 2>/dev/null | awk '{print $3}' | tr '\n' ', ')"

