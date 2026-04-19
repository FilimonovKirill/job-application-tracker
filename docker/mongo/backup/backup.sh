#!/bin/bash

# MongoDB Backup Script
# Usage: ./backup.sh [database_name]

set -e

# Default values
MONGO_HOST=${MONGO_HOST:-mongodb}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_USER=${MONGO_USER:-admin}
MONGO_PASSWORD=${MONGO_PASSWORD:-password}
DATABASE=${1:-job_tracker}
BACKUP_DIR=${BACKUP_DIR:-/backup}
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting backup of database: $DATABASE"
echo "Date: $DATE"

# Create backup
mongodump \
  --host="$MONGO_HOST:$MONGO_PORT" \
  --username="$MONGO_USER" \
  --password="$MONGO_PASSWORD" \
  --authenticationDatabase="admin" \
  --db="$DATABASE" \
  --out="$BACKUP_DIR/$DATE"

# Create compressed archive
cd "$BACKUP_DIR" && tar -czf "$DATE.tar.gz" "$DATE"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$DATE"

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Old backups cleanup completed"